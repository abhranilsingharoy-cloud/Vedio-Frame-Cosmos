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

  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
  
  try {
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
  } catch (err) {
    console.error('Failed to load FFmpeg core', err);
    throw new Error('Could not load FFmpeg WASM. Network blocked or device unsupported.');
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

  // FFmpeg quality: 1 is highest, 31 is lowest
  const qScale = Math.floor(31 - ((quality - 1) / 99) * 30);
  
  onProgress(0.1, 'Extracting frames via fast-seek...');
  
  const extractedFrames: Frame[] = [];
  const interval = duration / frameCount;

  for (let i = 1; i <= frameCount; i++) {
    const timestamp = startSec + (i - 1) * interval;
    const fileName = `frame_${i.toString().padStart(3, '0')}.jpg`;
    
    // Fast seek: -ss before -i means it jumps to the nearest keyframe without decoding
    const args = [
      '-ss', timestamp.toString(),
      '-i', inputName,
      '-frames:v', '1',
      '-q:v', qScale.toString(),
      '-pix_fmt', 'yuvj420p',
      fileName
    ];

    try {
      await f.exec(args);
      
      const data = await f.readFile(fileName);
      const blob = new Blob([data as unknown as BlobPart], { type: 'image/jpeg' });
      const url = URL.createObjectURL(blob);
      
      extractedFrames.push({
        id: `frame_${Date.now()}_${i}`,
        blob,
        url,
        number: i,
        timestamp: timestamp * 1000,
        width: video.width, // fallback
        height: video.height, // fallback
        size: blob.size,
      });
      
      await f.deleteFile(fileName);
    } catch (e) {
      console.warn(`Could not extract frame at ${timestamp}s`, e);
    }

    // Update progress exactly
    const currentProgress = 0.1 + ((i / frameCount) * 0.8);
    onProgress(currentProgress, `Extracted frame ${i}/${frameCount}`);
  }

  await f.deleteFile(inputName);
  onProgress(1, 'Extraction complete!');

  return extractedFrames;
};
