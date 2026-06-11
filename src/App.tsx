import { useAppStore } from './store/appStore';
import { LandingPage } from './components/LandingPage';
import { VideoPlayer } from './components/VideoPlayer';
import { ExtractionConfigPanel } from './components/ExtractionConfig';
import { FrameGallery } from './components/FrameGallery';
import { ProgressDisplay } from './components/ProgressDisplay';
import { LightboxModal } from './components/LightboxModal';
import { Clapperboard } from 'lucide-react';
import { Canvas3DBackground } from './components/Canvas3DBackground';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const { video, frames } = useAppStore();

  return (
    <div className="min-h-screen text-foreground pb-20 relative">
      <Canvas3DBackground />
      <ProgressDisplay />
      <LightboxModal />

      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="border-b border-white/10 bg-black/30 sticky top-0 z-40 backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
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
      </motion.header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 flex flex-col gap-6 md:gap-8 perspective-1000">
        <AnimatePresence mode="wait">
        
        {/* Intro / Landing Page */}
        {!video ? (
          <motion.div key="landing" exit={{ opacity: 0, y: -50, scale: 0.95 }} transition={{ duration: 0.4 }}>
            <LandingPage />
          </motion.div>
        ) : (
          <motion.div 
            key="workspace"
            initial={{ opacity: 0, y: 50, scale: 0.95, rotateX: 10 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 transform-style-3d"
          >
            
            {/* Left Column: Video & Settings */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-b from-white/5 to-white/0 backdrop-blur-2xl border-t border-l border-white/20 border-r border-b border-black/50 shadow-[0_20px_50px_rgba(0,0,0,0.7)] rounded-3xl p-5"
              >
                <VideoPlayer />
                <div className="mt-4 flex justify-between items-center px-2">
                  <span className="font-medium truncate" title={video.name}>{video.name}</span>
                  <span className="text-sm font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                    {Math.round(video.duration)}s
                  </span>
                </div>
              </motion.div>
              
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
            <motion.div 
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
              className="lg:col-span-2"
            >
              {frames.length > 0 ? (
                <FrameGallery />
              ) : (
                <div className="h-full min-h-[400px] border-t border-l border-white/10 border-r border-b border-black/40 bg-black/20 backdrop-blur-xl rounded-3xl flex flex-col items-center justify-center text-muted-foreground p-8 text-center shadow-[inset_0_2px_20px_rgba(0,0,0,0.5),0_20px_50px_rgba(0,0,0,0.4)]">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Clapperboard className="w-16 h-16 mb-6 opacity-20" />
                  </motion.div>
                  <p className="text-xl font-bold text-white/70">Ready to extract</p>
                  <p className="text-sm mt-2 max-w-sm">
                    Configure your extraction settings on the left and click "Start Extraction" to generate frames.
                  </p>
                </div>
              )}
            </motion.div>

          </motion.div>
        )}
        </AnimatePresence>
      </main>

      {/* Credit Footer */}
      <div className="hidden md:block fixed bottom-4 right-6 z-50 text-xs font-medium text-muted-foreground/50 hover:text-muted-foreground transition-colors pointer-events-none">
        Designed and Developed by Abhranil Singha Roy.
      </div>
    </div>
  );
}

export default App;
