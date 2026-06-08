import { useAppStore } from './store/appStore';
import { LandingPage } from './components/LandingPage';
import { VideoPlayer } from './components/VideoPlayer';
import { ExtractionConfigPanel } from './components/ExtractionConfig';
import { FrameGallery } from './components/FrameGallery';
import { ProgressDisplay } from './components/ProgressDisplay';
import { LightboxModal } from './components/LightboxModal';
import { Clapperboard } from 'lucide-react';
import { Canvas3DBackground } from './components/Canvas3DBackground';

function App() {
  const { video, frames } = useAppStore();

  return (
    <div className="min-h-screen text-foreground pb-20 relative">
      <Canvas3DBackground />
      <ProgressDisplay />
      <LightboxModal />

      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 sticky top-0 z-40 backdrop-blur-xl shadow-lg">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clapperboard className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold tracking-tight">Vedio Frame <span className="text-primary">Cosmos</span></h1>
          </div>
          
          {!video && (
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
              <a href="#home" className="hover:text-foreground transition-colors">Home</a>
              <a href="#how-it-works" className="hover:text-foreground transition-colors">How it Works</a>
              <a href="#features" className="hover:text-foreground transition-colors">Features</a>
              <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            </nav>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-8">
        
        {/* Intro / Landing Page */}
        {!video && <LandingPage />}

        {/* Workspace */}
        {video && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Video & Settings */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              <div className="bg-black/30 backdrop-blur-lg border border-white/10 shadow-2xl rounded-2xl p-4">
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
                  className="w-full py-3 mt-4 text-sm font-semibold text-destructive-foreground bg-destructive/80 hover:bg-destructive rounded-xl shadow-[0_0_15px_rgba(220,38,38,0.5)] border border-destructive/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
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
                <div className="h-full min-h-[400px] border-2 border-dashed border-white/20 bg-black/20 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center text-muted-foreground p-8 text-center shadow-xl">
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

      {/* Credit Footer */}
      <div className="fixed bottom-4 right-6 z-50 text-xs font-medium text-muted-foreground/50 hover:text-muted-foreground transition-colors pointer-events-none">
        Designed and Developed by Abhranil Singha Roy.
      </div>
    </div>
  );
}

export default App;
