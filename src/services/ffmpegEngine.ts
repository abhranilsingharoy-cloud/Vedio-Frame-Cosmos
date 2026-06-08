import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import type { Frame, ExtractionConfig, VideoInfo } from '../types';

let ffmpeg: FFmpeg | null = null;

export const initFFmpeg = async (onProgress?: (progress: number) => void): Promise<FFmpeg> => {
  if (ffmpeg) return ffmpeg;

  ffmpeg = new FFmpeg();
  
  if (onProgress) {
    ffmpeg.on('progress', ({ progress }) => {
      onProgress(progress);
    });
  }

  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
  
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
  });

  return ffmpeg;
};

export const extractFrames = async (
  video: VideoInfo,
  config: ExtractionConfig,
  onProgress: (progress: number, message: string) => void
): Promise<Frame[]> => {
  const f = await initFFmpeg();
  
  onProgress(0, 'Loading video file...');
  const inputName = 'input.mp4';
  await f.writeFile(inputName, await fetchFile(video.file));

  const { frameCount, quality, startTime, endTime } = config;
  
  // Calculate fps based on requested frameCount and video duration within the time range
  const duration = video.duration * ((endTime - startTime) / 100);
  const startSec = video.duration * (startTime / 100);
  const fps = Math.max(0.1, frameCount / duration);
  
  // FFmpeg quality: 1 is highest, 31 is lowest
  // Our quality slider: 100 is highest, 1 is lowest
  const qScale = Math.floor(31 - ((quality - 1) / 99) * 30);
  
  // Build FFmpeg command
  const args = [
    '-ss', startSec.toString(),
    '-t', duration.toString(),
    '-i', inputName,
    '-vf', `fps=${fps.toFixed(3)}`,
    '-frames:v', frameCount.toString(),
    '-q:v', qScale.toString(),
    'frame_%03d.jpg'
  ];

  onProgress(0.1, 'Extracting frames...');
  
  let _frameProgress = 0.1;
  f.on('progress', ({ progress }) => {
    // scale 0-1 to 0.1-0.9
    _frameProgress = 0.1 + (progress * 0.8);
    onProgress(_frameProgress, 'Extracting frames...');
  });

  await f.exec(args);
  
  f.off('progress', () => {}); // cleanup listener

  onProgress(0.9, 'Processing extracted frames...');

  const extractedFrames: Frame[] = [];
  
  for (let i = 1; i <= frameCount; i++) {
    const fileName = `frame_${i.toString().padStart(3, '0')}.jpg`;
    try {
      const data = await f.readFile(fileName);
      const blob = new Blob([data as unknown as BlobPart], { type: 'image/jpeg' });
      const url = URL.createObjectURL(blob);
      
      const frameTimestamp = startSec * 1000 + ((i - 1) / fps) * 1000;
      
      // We will parse actual width/height in a post-process step using an Image object
      extractedFrames.push({
        id: `frame_${Date.now()}_${i}`,
        blob,
        url,
        number: i,
        timestamp: frameTimestamp,
        width: video.width, // fallback
        height: video.height, // fallback
        size: blob.size,
      });
      
      // Cleanup file from MEMFS
      await f.deleteFile(fileName);
    } catch (e) {
      console.warn(`Could not read ${fileName}`, e);
    }
  }

  await f.deleteFile(inputName);
  onProgress(1, 'Extraction complete!');

  return extractedFrames;
};
