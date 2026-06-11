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

  ffmpeg.on('log', ({ message }) => {
    console.log('[FFmpeg Log]', message);
  });

  const baseURL = 'https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm';
  
  try {
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
  } catch (err) {
    console.error('Failed to load FFmpeg core', err);
    throw new Error('Could not load FFmpeg WASM. Your browser may not support it or network failed.');
  }

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
  
  let duration = video.duration * ((endTime - startTime) / 100);
  if (isNaN(duration) || duration <= 0) duration = 1;

  let startSec = video.duration * (startTime / 100);
  if (isNaN(startSec) || startSec < 0) startSec = 0;

  let fps = Math.max(0.1, frameCount / duration);
  if (isNaN(fps) || !isFinite(fps)) fps = 1;
  
  // FFmpeg quality: 1 is highest, 31 is lowest
  // Our quality slider: 100 is highest, 1 is lowest
  const qScale = Math.floor(31 - ((quality - 1) / 99) * 30);
  
  // Build FFmpeg command
  const args = [
    '-threads', '0',
    '-ss', startSec.toString(),
    '-t', duration.toString(),
    '-i', inputName,
    '-vf', `fps=${fps.toFixed(3)}`,
    '-frames:v', frameCount.toString(),
    '-q:v', qScale.toString(),
    '-pix_fmt', 'yuvj420p',
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
