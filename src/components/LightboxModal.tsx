import { useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import { useDownload } from '../hooks/useDownload';
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react';

export const LightboxModal = () => {
  const { frames, lightboxIndex, setLightboxIndex } = useAppStore();
  const { downloadSingleFrame } = useDownload();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowLeft') setLightboxIndex(Math.max(0, lightboxIndex - 1));
      if (e.key === 'ArrowRight') setLightboxIndex(Math.min(frames.length - 1, lightboxIndex + 1));
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, frames.length, setLightboxIndex]);

  if (lightboxIndex === null || !frames[lightboxIndex]) return null;

  const frame = frames[lightboxIndex];

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center">
      
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <div className="text-white">
          <span className="font-mono text-lg font-bold">Frame #{frame.number}</span>
          <span className="ml-4 text-sm text-white/70">
            {frame.width}x{frame.height} • {(frame.size / 1024).toFixed(1)} KB
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => downloadSingleFrame(frame)}
            className="flex items-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary text-primary-foreground rounded-md transition-colors"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
          
          <button 
            onClick={() => setLightboxIndex(null)}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      {lightboxIndex > 0 && (
        <button 
          onClick={() => setLightboxIndex(lightboxIndex - 1)}
          className="absolute left-4 p-3 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
      )}

      {lightboxIndex < frames.length - 1 && (
        <button 
          onClick={() => setLightboxIndex(lightboxIndex + 1)}
          className="absolute right-4 p-3 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      )}

      {/* Image */}
      <div className="max-w-6xl w-full max-h-[85vh] p-4 flex justify-center">
        <img 
          src={frame.url} 
          alt={`Frame ${frame.number}`} 
          className="max-w-full max-h-full object-contain shadow-2xl rounded-sm"
        />
      </div>

      {/* Bottom Bar: Metadata */}
      <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-center gap-8 bg-gradient-to-t from-black/80 to-transparent">
        {frame.qualityScore !== undefined && (
          <div className="flex items-center gap-2">
            <span className="text-white/50 text-sm">Quality:</span>
            <span className="text-white font-mono">{(frame.qualityScore * 100).toFixed(0)}%</span>
          </div>
        )}
        {frame.blurScore !== undefined && (
          <div className="flex items-center gap-2">
            <span className="text-white/50 text-sm">Blur Score:</span>
            <span className="text-white font-mono">{frame.blurScore.toFixed(3)}</span>
          </div>
        )}
        {frame.brightnessScore !== undefined && (
          <div className="flex items-center gap-2">
            <span className="text-white/50 text-sm">Brightness:</span>
            <span className="text-white font-mono">{(frame.brightnessScore * 100).toFixed(1)}%</span>
          </div>
        )}
        {frame.sceneId !== undefined && (
          <div className="flex items-center gap-2">
            <span className="text-white/50 text-sm">Scene ID:</span>
            <span className="text-white font-mono">{frame.sceneId}</span>
          </div>
        )}
      </div>

    </div>
  );
};
