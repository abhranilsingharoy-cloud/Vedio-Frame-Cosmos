import { useAppStore } from '../store/appStore';
import { extractFrames } from '../services/ffmpegEngine';
import { analyzeAllFrames } from '../services/metadataParser';
import { detectScenes } from '../services/sceneAnalyzer';

export const useFrameExtract = () => {
  const { video, config, setFrames, setIsExtracting, setProgress, clearFrames } = useAppStore();

  const startExtraction = async () => {
    if (!video) return;

    try {
      setIsExtracting(true);
      clearFrames();
      
      // Step 1: Extract frames via FFmpeg
      let extracted = await extractFrames(video, config, (progress, message) => {
        setProgress(progress * 0.7, `[1/3] ${message}`);
      });

      // Step 2: Compute quality metrics
      setProgress(0.7, '[2/3] Analyzing frame quality...');
      extracted = await analyzeAllFrames(extracted, (p) => {
        setProgress(0.7 + (p * 0.15), `[2/3] Analyzing frame quality (${Math.round(p * 100)}%)`);
      });

      // Step 3: Scene detection (optional filtering)
      if (config.smartSceneDetection) {
        setProgress(0.85, '[3/3] Detecting distinct scenes...');
        extracted = await detectScenes(extracted, config.sceneSensitivity, (p) => {
          setProgress(0.85 + (p * 0.15), `[3/3] Detecting scenes (${Math.round(p * 100)}%)`);
        });
      } else {
        setProgress(1, '[3/3] Finalizing...');
      }

      setFrames(extracted);
      setProgress(1, 'Complete!');
    } catch (error: any) {
      console.error('Extraction failed:', error);
      const msg = error?.message || String(error);
      setProgress(0, `Failed: ${msg.substring(0, 50)}`);
    } finally {
      setIsExtracting(false);
      setTimeout(() => setProgress(0, ''), 6000);
    }
  };

  return { startExtraction };
};
