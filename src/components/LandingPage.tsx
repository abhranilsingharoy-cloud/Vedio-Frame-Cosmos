import { UploadDropzone } from './UploadDropzone';
import { Settings, Zap, Database, CheckCircle2, Shield, FileOutput } from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="flex flex-col gap-32 pb-32">
      {/* Hero Section */}
      <section id="home" className="text-center pt-20 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary mb-8 border border-primary/20 backdrop-blur-md">
          <Zap className="w-4 h-4" />
          <span className="text-sm font-medium">100% In-Browser Processing</span>
        </div>
        <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          Extract frames with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">precision</span>
        </h2>
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
          The ultimate zero-server platform for video frame extraction and AI dataset generation. No uploads, zero cost, total privacy.
        </p>
        <div className="max-w-2xl mx-auto">
          <UploadDropzone />
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold mb-4">How it Works</h3>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Three simple steps to transform your videos into high-quality datasets.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Upload Video', desc: 'Drag and drop any local video file. It never leaves your device.' },
            { step: '02', title: 'Configure AI Settings', desc: 'Set frame intervals, enable smart scene detection, and pick formats.' },
            { step: '03', title: 'Export Dataset', desc: 'Download a ZIP with frames, annotations, and YOLO/COCO configurations.' }
          ].map((item, i) => (
            <div key={i} className="relative p-8 rounded-2xl bg-black/30 border border-white/10 backdrop-blur-md">
              <div className="text-6xl font-black text-white/5 absolute top-4 right-4">{item.step}</div>
              <h4 className="text-xl font-semibold mb-3 mt-4">{item.title}</h4>
              <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold mb-4">Advanced Features</h3>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need for computer vision workflows, built natively into your browser.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: <Database className="w-6 h-6 text-primary" />, title: 'AI Dataset Ready', desc: 'Auto-generates YOLO-format folder structures and COCO JSON.' },
            { icon: <Settings className="w-6 h-6 text-primary" />, title: 'Smart Scene Detection', desc: 'Perceptual hashing skips near-duplicate frames automatically.' },
            { icon: <Shield className="w-6 h-6 text-primary" />, title: 'Total Privacy', desc: 'Zero backend API calls. The video bytes never leave your local machine.' },
            { icon: <FileOutput className="w-6 h-6 text-primary" />, title: 'Metadata Export', desc: 'Detailed CSV exports with blur scores, brightness, and timestamps.' },
            { icon: <Zap className="w-6 h-6 text-primary" />, title: 'FFmpeg WASM', desc: 'Powered by WebAssembly for near-native extraction performance.' },
            { icon: <CheckCircle2 className="w-6 h-6 text-primary" />, title: 'Quality Control', desc: 'Built-in real-time frame quality scoring to remove blurry images.' }
          ].map((feature, i) => (
            <div key={i} className="flex gap-4 p-6 rounded-2xl bg-black/20 border border-white/5 hover:bg-black/40 transition-colors">
              <div className="flex-shrink-0 p-3 bg-primary/10 rounded-xl h-fit">
                {feature.icon}
              </div>
              <div>
                <h4 className="font-semibold mb-2">{feature.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="max-w-4xl mx-auto px-4 text-center">
        <h3 className="text-3xl font-bold mb-4">Pricing</h3>
        <p className="text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
          We believe foundational tools for AI researchers should be accessible to everyone.
        </p>
        
        <div className="p-10 rounded-3xl bg-gradient-to-br from-primary/20 via-black/40 to-black/60 border border-primary/30 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Zap className="w-48 h-48" />
          </div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="text-primary font-semibold tracking-wider uppercase mb-2">Community Edition</div>
            <div className="flex items-baseline gap-2 mb-8">
              <span className="text-6xl font-black">$0</span>
              <span className="text-xl text-muted-foreground">forever</span>
            </div>
            
            <ul className="text-left space-y-4 mb-10 w-full max-w-sm">
              {[
                'Unlimited video processing',
                'Smart Scene Detection',
                'YOLO & COCO Dataset Exports',
                'Real-time Quality Scoring',
                '100% Client-side Processing',
                'No watermarks, no limits'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            
            <button 
              onClick={() => {
                document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-transform active:scale-95 w-full max-w-sm shadow-lg shadow-primary/25"
            >
              Start Extracting Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
