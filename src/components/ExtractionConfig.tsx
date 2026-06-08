import { useAppStore } from '../store/appStore';
import { Settings2, Download, Zap } from 'lucide-react';
import { useFrameExtract } from '../hooks/useFrameExtract';

export const ExtractionConfigPanel = () => {
  const { config, setConfig, isExtracting } = useAppStore();
  const { startExtraction } = useFrameExtract();

  const presets = [
    { id: 'quick', name: 'Quick Preview', count: 10, quality: 50, scene: false },
    { id: 'ml', name: 'ML Training', count: 100, quality: 85, scene: true },
    { id: 'archive', name: 'Full Archive', count: 500, quality: 95, scene: false },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-6">
      <div className="flex items-center gap-2 border-b border-border pb-4">
        <Settings2 className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-medium">Extraction Settings</h2>
      </div>

      {/* Presets */}
      <div className="grid grid-cols-3 gap-2">
        {presets.map(p => (
          <button
            key={p.id}
            className="px-3 py-2 text-sm bg-muted hover:bg-muted/80 rounded-md transition-colors"
            onClick={() => setConfig({
              frameCount: p.count,
              quality: p.quality,
              smartSceneDetection: p.scene
            })}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {/* Frame Count */}
        <div>
          <label className="text-sm font-medium flex justify-between">
            <span>Frame Count</span>
            <span className="text-muted-foreground">{config.frameCount}</span>
          </label>
          <input 
            type="range" 
            min="1" max="500" 
            value={config.frameCount}
            onChange={(e) => setConfig({ frameCount: parseInt(e.target.value) })}
            className="w-full mt-2 accent-primary"
          />
        </div>

        {/* Quality */}
        <div>
          <label className="text-sm font-medium flex justify-between">
            <span>JPEG Quality</span>
            <span className="text-muted-foreground">{config.quality}%</span>
          </label>
          <input 
            type="range" 
            min="10" max="100" 
            value={config.quality}
            onChange={(e) => setConfig({ quality: parseInt(e.target.value) })}
            className="w-full mt-2 accent-primary"
          />
        </div>

        {/* Smart Scene Detection */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <Zap className={`w-4 h-4 ${config.smartSceneDetection ? 'text-yellow-500' : 'text-muted-foreground'}`} />
            <span className="text-sm font-medium">Smart Scene Detection</span>
          </div>
          <button
            className={`w-11 h-6 rounded-full transition-colors ${config.smartSceneDetection ? 'bg-primary' : 'bg-muted'}`}
            onClick={() => setConfig({ smartSceneDetection: !config.smartSceneDetection })}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${config.smartSceneDetection ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>

        {config.smartSceneDetection && (
          <div className="pl-6">
            <label className="text-xs text-muted-foreground">Sensitivity</label>
            <select 
              value={config.sceneSensitivity}
              onChange={(e) => setConfig({ sceneSensitivity: e.target.value as any })}
              className="w-full mt-1 bg-muted border border-border rounded-md px-3 py-1.5 text-sm"
            >
              <option value="low">Low (More Scenes)</option>
              <option value="medium">Medium</option>
              <option value="high">High (Fewer Scenes)</option>
            </select>
          </div>
        )}

        {/* Format */}
        <div className="pt-2">
          <label className="text-sm font-medium">Dataset Format</label>
          <select 
            value={config.format}
            onChange={(e) => setConfig({ format: e.target.value as any })}
            className="w-full mt-2 bg-muted border border-border rounded-md px-3 py-2 text-sm"
          >
            <option value="none">None (Images Only)</option>
            <option value="yolo">YOLO v8</option>
            <option value="coco">COCO JSON</option>
            <option value="csv">CSV Metadata</option>
          </select>
        </div>
      </div>

      <button
        onClick={startExtraction}
        disabled={isExtracting}
        className="w-full mt-4 bg-primary text-primary-foreground py-3 rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
      >
        <Download className="w-4 h-4" />
        {isExtracting ? 'Processing...' : 'Start Extraction'}
      </button>
    </div>
  );
};
