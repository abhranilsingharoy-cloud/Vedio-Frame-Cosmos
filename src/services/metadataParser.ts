import type { Frame } from '../types';

export const computeFrameMetrics = async (frame: Frame): Promise<Frame> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(frame);
        return;
      }

      const width = img.width;
      const height = img.height;
      
      // Update frame with actual dimensions
      frame.width = width;
      frame.height = height;

      // Scale down for faster analysis
      const scale = 224 / Math.max(width, height);
      const scaledW = Math.round(width * scale);
      const scaledH = Math.round(height * scale);

      canvas.width = scaledW;
      canvas.height = scaledH;
      ctx.drawImage(img, 0, 0, scaledW, scaledH);

      const imageData = ctx.getImageData(0, 0, scaledW, scaledH);
      const data = imageData.data;

      let totalLuminance = 0;
      
      // Compute Brightness (Mean Luminance)
      const grayscale = new Float32Array(scaledW * scaledH);
      for (let i = 0; i < data.length; i += 4) {
        // Luminance formula
        const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        const pixelIdx = i / 4;
        grayscale[pixelIdx] = lum;
        totalLuminance += lum;
      }
      
      frame.brightnessScore = totalLuminance / (scaledW * scaledH * 255);

      // Compute Blur Score (Variance of Laplacian approximation)
      // Fast approximation using simple difference
      let laplacianVariance = 0;
      let meanLaplacian = 0;
      const laplacian = new Float32Array(scaledW * scaledH);
      
      for (let y = 1; y < scaledH - 1; y++) {
        for (let x = 1; x < scaledW - 1; x++) {
          const idx = y * scaledW + x;
          const val = grayscale[idx] * 4 
            - grayscale[idx - 1] 
            - grayscale[idx + 1] 
            - grayscale[idx - scaledW] 
            - grayscale[idx + scaledW];
          laplacian[idx] = val;
          meanLaplacian += val;
        }
      }
      
      meanLaplacian /= (scaledW * scaledH);
      
      for (let i = 0; i < laplacian.length; i++) {
        const diff = laplacian[i] - meanLaplacian;
        laplacianVariance += diff * diff;
      }
      laplacianVariance /= (scaledW * scaledH);

      // Normalize blur score to a 0-1 range (heuristically mapped)
      frame.blurScore = Math.min(1, laplacianVariance / 1000);
      
      // Calculate overall quality score (simple weighted average)
      frame.qualityScore = (frame.blurScore * 0.7) + (frame.brightnessScore > 0.2 && frame.brightnessScore < 0.8 ? 0.3 : 0.1);

      resolve(frame);
    };
    img.src = frame.url;
  });
};

export const analyzeAllFrames = async (frames: Frame[], onProgress: (p: number) => void): Promise<Frame[]> => {
  const analyzed = [];
  for (let i = 0; i < frames.length; i++) {
    analyzed.push(await computeFrameMetrics(frames[i]));
    onProgress((i + 1) / frames.length);
  }
  return analyzed;
};
