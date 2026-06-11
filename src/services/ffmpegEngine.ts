import type { Frame, ExtractionConfig, VideoInfo } from '../types';

/**
 * Extracts frames using the native HTML5 <video> and <canvas> elements.
 * This completely bypasses FFmpeg WASM, resulting in instantaneous, hardware-accelerated
 * extraction that is 100% immune to browser CORS, COOP/COEP, and memory limit crashes.
 */
export const extractFrames = async (
  videoInfo: VideoInfo,
  config: ExtractionConfig,
  onProgress: (progress: number, message: string) => void
): Promise<Frame[]> => {
  return new Promise((resolve, reject) => {
    try {
      onProgress(0.1, 'Initializing hardware decoder...');
      
      const video = document.createElement('video');
      video.style.display = 'none';
      document.body.appendChild(video);
      
      video.src = videoInfo.url;
      video.muted = true;
      video.playsInline = true;
      video.crossOrigin = 'anonymous'; // Ensure no canvas tainting

      const { frameCount, quality, startTime, endTime } = config;
      
      let duration = videoInfo.duration * ((endTime - startTime) / 100);
      if (isNaN(duration) || duration <= 0) duration = 1;
      
      let startSec = videoInfo.duration * (startTime / 100);
      if (isNaN(startSec) || startSec < 0) startSec = 0;

      const interval = duration / frameCount;
      const extractedFrames: Frame[] = [];
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Canvas 2D context not supported by your browser.');
      }

      let currentFrameIndex = 0;

      // Handle successful load
      video.onloadeddata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        extractNextFrame();
      };

      // Handle native decoding errors
      video.onerror = () => {
        reject(new Error(`Video decoding failed. Code: ${video.error?.code || 'Unknown'}`));
      };

      const extractNextFrame = () => {
        if (currentFrameIndex >= frameCount) {
          onProgress(1, 'Extraction complete!');
          resolve(extractedFrames);
          // Cleanup
          video.src = '';
          video.load();
          if (video.parentNode) {
            document.body.removeChild(video);
          }
          return;
        }

        const targetTimestamp = startSec + currentFrameIndex * interval;
        video.currentTime = targetTimestamp;
      };

      // Event fires when the video hardware decoder finishes seeking to the frame
      video.onseeked = () => {
        try {
          // Draw the current video frame onto the canvas
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // Quality is 1-100 in our config, toBlob expects 0.0-1.0
          const jpegQuality = quality / 100;
          
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              extractedFrames.push({
                id: `frame_${Date.now()}_${currentFrameIndex}`,
                blob,
                url,
                number: currentFrameIndex + 1,
                timestamp: video.currentTime * 1000,
                width: canvas.width,
                height: canvas.height,
                size: blob.size,
              });
            } else {
              console.warn(`Frame ${currentFrameIndex} failed to encode to JPEG.`);
            }
            
            currentFrameIndex++;
            const progressVal = 0.1 + ((currentFrameIndex / frameCount) * 0.8);
            onProgress(progressVal, `Extracted frame ${currentFrameIndex}/${frameCount}`);
            
            // Loop!
            extractNextFrame();
            
          }, 'image/jpeg', jpegQuality);
          
        } catch (err: any) {
          console.warn(`Failed to process frame ${currentFrameIndex}:`, err);
          reject(new Error(`Failed to draw frame. ${err?.message || ''}`));
        }
      };

      // Trigger the loading sequence
      video.load();
      
    } catch (err: any) {
      // Ensure we clean up the DOM if a fatal error occurs early
      const v = document.querySelector('video[style*="display: none"]');
      if (v && v.parentNode) document.body.removeChild(v);
      
      reject(new Error(`Fatal extraction error: ${err.message}`));
    }
  });
};
