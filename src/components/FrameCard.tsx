import { memo } from 'react';
import type { Frame } from '../types';
import { useAppStore } from '../store/appStore';
import { CheckCircle2, Maximize2 } from 'lucide-react';
import { motion } from 'framer-motion';

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1 }
};

export const FrameCard = memo(({ frame, index }: { frame: Frame, index: number }) => {
  const { selectedFrames, toggleFrameSelection, setLightboxIndex } = useAppStore();
  
  const isSelected = selectedFrames.has(frame.id);

  // Quality badge logic
  let badgeColor = 'bg-green-500';
  let badgeText = 'High';
  if (frame.qualityScore !== undefined) {
    if (frame.qualityScore < 0.4) {
      badgeColor = 'bg-red-500';
      badgeText = 'Low';
    } else if (frame.qualityScore < 0.7) {
      badgeColor = 'bg-yellow-500';
      badgeText = 'Med';
    }
  }

  return (
    <motion.div 
      variants={itemVariants}
      whileHover={{ scale: 1.05, rotateY: 5, rotateX: 5, z: 20 }}
      whileTap={{ scale: 0.95 }}
      layout
      className={`group relative rounded-xl overflow-hidden border-2 transition-colors cursor-pointer shadow-lg transform-style-3d ${
        isSelected ? 'border-primary shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'border-transparent hover:border-white/20'
      }`}
      onClick={() => toggleFrameSelection(frame.id)}
    >
      <img 
        src={frame.url} 
        alt={`Frame ${frame.number}`} 
        className="w-full h-auto aspect-video object-cover bg-muted"
        loading="lazy"
      />
      
      {/* Overlay */}
      <div className={`absolute inset-0 bg-black/40 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
        
        {/* Selection Checkbox */}
        <div className="absolute top-2 left-2">
          <CheckCircle2 className={`w-6 h-6 ${isSelected ? 'text-primary fill-primary/20' : 'text-white/50'}`} />
        </div>

        {/* Expand Button */}
        <button 
          className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-primary rounded-md text-white transition-colors opacity-0 group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            setLightboxIndex(index);
          }}
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Info Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent flex justify-between items-end">
          <span className="text-xs font-mono text-white/90 font-medium">#{frame.number}</span>
          
          {frame.qualityScore !== undefined && (
            <div className="flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-sm">
              <div className={`w-2 h-2 rounded-full ${badgeColor}`} />
              <span className="text-[10px] uppercase font-bold text-white/80">{badgeText}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
});
