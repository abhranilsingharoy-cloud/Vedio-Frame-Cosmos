import type { Frame } from '../types';

// Simple perceptive hash (pHash-like)
const computeHash = async (blob: Blob): Promise<Uint8Array> => {
  const bitmap = await createImageBitmap(blob);
  
  // Use OffscreenCanvas if available, else fallback to standard Canvas
  const canvas = typeof OffscreenCanvas !== 'undefined' 
    ? new OffscreenCanvas(32, 32) 
    : document.createElement('canvas');
    
  if (canvas instanceof HTMLCanvasElement) {
    canvas.width = 32;
    canvas.height = 32;
  }
  
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
  ctx.drawImage(bitmap, 0, 0, 32, 32);
  
  const imageData = ctx.getImageData(0, 0, 32, 32);
  const data = imageData.data;
  const grayscale = new Uint8Array(32 * 32);
  
  let totalLuminance = 0;
  for (let i = 0; i < data.length; i += 4) {
    const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    grayscale[i / 4] = lum;
    totalLuminance += lum;
  }
  
  const meanLuminance = totalLuminance / (32 * 32);
  const hash = new Uint8Array(32 * 32);
  
  for (let i = 0; i < grayscale.length; i++) {
    hash[i] = grayscale[i] > meanLuminance ? 1 : 0;
  }
  
  bitmap.close();
  return hash;
};

const hammingDistance = (hash1: Uint8Array, hash2: Uint8Array): number => {
  let distance = 0;
  for (let i = 0; i < hash1.length; i++) {
    if (hash1[i] !== hash2[i]) {
      distance++;
    }
  }
  return distance;
};

export const detectScenes = async (frames: Frame[], sensitivity: 'low' | 'medium' | 'high' = 'medium', onProgress?: (p: number) => void): Promise<Frame[]> => {
  if (frames.length === 0) return frames;
  
  const thresholdMap = {
    // Hamming distance max is 1024 (32x32). Distance > threshold = new scene.
    // Higher threshold means LESS scenes (harder to trigger).
    // Low sensitivity = High threshold
    low: 250,
    medium: 150,
    high: 80
  };
  
  const threshold = thresholdMap[sensitivity];
  
  const sceneFrames: Frame[] = [];
  let currentSceneId = 1;
  
  // First frame is always a scene
  frames[0].sceneId = currentSceneId;
  sceneFrames.push(frames[0]);
  
  let lastHash = await computeHash(frames[0].blob);
  if (onProgress) onProgress(1 / frames.length);
  
  for (let i = 1; i < frames.length; i++) {
    const hash = await computeHash(frames[i].blob);
    const distance = hammingDistance(lastHash, hash);
    
    if (distance > threshold) {
      currentSceneId++;
      lastHash = hash;
      frames[i].sceneId = currentSceneId;
      sceneFrames.push(frames[i]);
    } else {
      frames[i].sceneId = currentSceneId;
    }
    
    if (onProgress) onProgress((i + 1) / frames.length);
  }
  
  // Return only the distinct scene frames
  return sceneFrames;
};
