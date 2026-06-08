import { useAppStore } from './store/appStore';
import { UploadDropzone } from './components/UploadDropzone';
import { VideoPlayer } from './components/VideoPlayer';
import { ExtractionConfigPanel } from './components/ExtractionConfig';
import { FrameGallery } from './components/FrameGallery';
import { ProgressDisplay } from './components/ProgressDisplay';
import { LightboxModal } from './components/LightboxModal';
import { Clapperboard } from 'lucide-react';

function App() {
  const { video, frames } = useAppStore();

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <ProgressDisplay />
      <LightboxModal />

      {/* Header */}
      <header className="border-b border-border bg-card/50 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-3">
          <Clapperboard className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold tracking-tight">VideoFrame<span className="text-primary">X</span></h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-8">
        
        {/* Intro */}
        {!video && (
          <div className="text-center py-20 max-w-2xl mx-auto">
            <h2 className="text-4xl font-extrabold tracking-tight mb-4">Extract frames with precision</h2>
            <p className="text-xl text-muted-foreground mb-12">
              100% browser-based video frame extraction and dataset generation. No uploads, zero cost, total privacy.
            </p>
            <UploadDropzone />
          </div>
        )}

        {/* Workspace */}
        {video && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Video & Settings */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              <div className="bg-card border border-border rounded-xl p-4">
                <VideoPlayer />
                <div className="mt-4 flex justify-between items-center px-2">
                  <span className="font-medium truncate" title={video.name}>{video.name}</span>
                  <span className="text-sm font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                    {Math.round(video.duration)}s
                  </span>
                </div>
              </div>
              
              <ExtractionConfigPanel />
              
              <div className="mt-auto pt-8">
                <button 
                  onClick={() => useAppStore.getState().reset()}
                  className="w-full py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                >
                  Start Over
                </button>
              </div>
            </div>

            {/* Right Column: Gallery */}
            <div className="lg:col-span-2">
              {frames.length > 0 ? (
                <FrameGallery />
              ) : (
                <div className="h-full min-h-[400px] border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
                  <Clapperboard className="w-12 h-12 mb-4 opacity-20" />
                  <p className="text-lg font-medium">Ready to extract</p>
                  <p className="text-sm mt-2 max-w-sm">
                    Configure your extraction settings on the left and click "Start Extraction" to generate frames.
                  </p>
                </div>
              )}
            </div>

          </div>
        )}
      </main>
    </div>
  );
}

export default App;
