import { UploadDropzone } from './UploadDropzone';
import { Settings, Zap, Database, CheckCircle2, Shield, FileOutput } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants: any = {
  hidden: { y: 40, opacity: 0, scale: 0.95 },
  visible: { y: 0, opacity: 1, scale: 1, transition: { type: "spring", stiffness: 100, damping: 20 } }
};

export const LandingPage = () => {
  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col gap-20 md:gap-32 pb-20 md:pb-32 overflow-hidden perspective-1000"
    >
      {/* Hero Section */}
      <motion.section variants={itemVariants} id="home" className="text-center pt-10 md:pt-20 max-w-4xl mx-auto transform-style-3d">
        <motion.div 
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary mb-8 border border-primary/20 backdrop-blur-md shadow-[0_0_15px_rgba(99,102,241,0.3)]"
        >
          <Zap className="w-4 h-4" />
          <span className="text-sm font-medium">100% In-Browser Processing</span>
        </motion.div>
        <h2 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-shadow-xl">
          Extract frames with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">precision</span>
        </h2>
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
          The ultimate zero-server platform for video frame extraction and AI dataset generation. No uploads, zero cost, total privacy.
        </p>
        <div className="max-w-2xl mx-auto">
          <UploadDropzone />
        </div>
      </motion.section>

      {/* How it Works Section */}
      <motion.section variants={itemVariants} id="how-it-works" className="max-w-6xl mx-auto px-4 transform-style-3d">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold mb-4 drop-shadow-lg">How it Works</h3>
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
            <motion.div 
              key={i} 
              whileHover={{ scale: 1.05, rotateY: 5, rotateX: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative p-6 md:p-8 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.8)] hover:shadow-[0_20px_50px_-10px_rgba(99,102,241,0.3)] transition-shadow"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="text-7xl font-black text-white/5 absolute top-2 right-4 translate-z-10">{item.step}</div>
              <h4 className="text-2xl font-bold mb-3 mt-4 text-white/90 translate-z-10">{item.title}</h4>
              <p className="text-muted-foreground leading-relaxed translate-z-10">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section variants={itemVariants} id="features" className="max-w-6xl mx-auto px-4 transform-style-3d">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold mb-4 drop-shadow-lg">Advanced Features</h3>
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
            { icon: <Zap className="w-6 h-6 text-primary" />, title: 'Native Hardware Engine', desc: 'Powered by HTML5 Canvas for instant, hardware-accelerated extraction without WASM limits.' },
            { icon: <CheckCircle2 className="w-6 h-6 text-primary" />, title: 'Quality Control', desc: 'Built-in real-time frame quality scoring to remove blurry images.' }
          ].map((feature, i) => (
            <motion.div 
              key={i} 
              whileHover={{ scale: 1.03, z: 20 }}
              className="flex gap-4 p-6 rounded-2xl bg-gradient-to-br from-black/40 to-black/20 border border-white/5 shadow-xl hover:shadow-[0_10px_30px_rgba(99,102,241,0.15)] transition-shadow backdrop-blur-md"
            >
              <div className="flex-shrink-0 p-3 bg-primary/20 rounded-xl h-fit shadow-inner">
                {feature.icon}
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-white/90">{feature.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Pricing Section */}
      <motion.section variants={itemVariants} id="pricing" className="max-w-4xl mx-auto px-4 text-center transform-style-3d">
        <h3 className="text-3xl font-bold mb-4 drop-shadow-lg">Pricing</h3>
        <p className="text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
          We believe foundational tools for AI researchers should be accessible to everyone.
        </p>
        
        <motion.div 
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="p-6 md:p-10 rounded-3xl bg-gradient-to-br from-primary/20 via-black/40 to-black/60 border border-primary/30 backdrop-blur-xl relative overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8),0_0_40px_rgba(99,102,241,0.2)]"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Zap className="w-48 h-48" />
          </div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="text-primary font-bold tracking-widest uppercase mb-4 drop-shadow-md">Community Edition</div>
            <div className="flex items-baseline gap-2 mb-8 drop-shadow-2xl">
              <span className="text-7xl font-black bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">$0</span>
              <span className="text-2xl text-muted-foreground font-medium">forever</span>
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
                <li key={i} className="flex items-center gap-4 text-white/80">
                  <CheckCircle2 className="w-6 h-6 text-primary drop-shadow-[0_0_5px_rgba(99,102,241,0.8)]" />
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
            
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(99,102,241,0.6)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-4 bg-gradient-to-r from-primary to-indigo-500 text-white font-bold rounded-2xl w-full max-w-sm shadow-[0_10px_20px_rgba(99,102,241,0.4)] border border-white/20"
            >
              Start Extracting Now
            </motion.button>
          </div>
        </motion.div>
      </motion.section>
    </motion.div>
  );
};
