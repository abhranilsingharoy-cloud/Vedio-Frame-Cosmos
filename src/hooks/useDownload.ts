import { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { exportFrames } from '../services/datasetBuilder';
import type { Frame } from '../types';

export const useDownload = () => {
  const { video, config, frames, selectedFrames } = useAppStore();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const downloadSingleFrame = (frame: Frame) => {
    if (!video) return;
    const a = document.createElement('a');
    a.href = frame.url;
    a.download = `${video.name.replace(/\.[^/.]+$/, "")}_frame_${frame.number.toString().padStart(3, '0')}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadDataset = async () => {
    if (!video || frames.length === 0) return;
    
    try {
      setIsDownloading(true);
      setDownloadProgress(0);
      
      const framesToExport = selectedFrames.size > 0 
        ? frames.filter(f => selectedFrames.has(f.id))
        : frames;

      const blob = await exportFrames(framesToExport, config, video, (p) => setDownloadProgress(p));
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${video.name.replace(/\.[^/.]+$/, "")}_dataset.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (e) {
      console.error('Download failed', e);
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  return { downloadSingleFrame, downloadDataset, isDownloading, downloadProgress };
};
