import { useAppStore } from '../store/appStore';
import { FrameCard } from './FrameCard';
import { useDownload } from '../hooks/useDownload';
import { Download, Trash2, CheckSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

export const FrameGallery = () => {
  const { frames, selectedFrames, selectAllFrames, clearSelection, deleteSelectedFrames } = useAppStore();
  const { downloadDataset, isDownloading, downloadProgress } = useDownload();

  if (frames.length === 0) return null;

  const handleSelectAll = () => {
    if (selectedFrames.size === frames.length) {
      clearSelection();
    } else {
      selectAllFrames();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-card border border-border p-3 rounded-xl sticky top-4 z-10">
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSelectAll}
            className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
          >
            <CheckSquare className="w-4 h-4" />
            {selectedFrames.size === frames.length ? 'Deselect All' : 'Select All'}
          </button>
          <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-md">
            {selectedFrames.size} of {frames.length} selected
          </span>
        </div>

        <div className="flex items-center gap-2">
          {selectedFrames.size > 0 && (
            <button 
              onClick={deleteSelectedFrames}
              className="flex items-center gap-2 text-sm font-medium text-destructive hover:bg-destructive/10 px-3 py-1.5 rounded-md transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Remove Selected
            </button>
          )}
          
          <button 
            onClick={downloadDataset}
            disabled={isDownloading}
            className="flex items-center gap-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-1.5 rounded-md transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {isDownloading 
              ? `Exporting... ${Math.round(downloadProgress * 100)}%` 
              : selectedFrames.size > 0 
                ? `Export Selected (${selectedFrames.size})` 
                : 'Export All Frames'
            }
          </button>
        </div>
      </div>

      {/* Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 perspective-1000"
      >
        {frames.map((frame, idx) => (
          <FrameCard key={frame.id} frame={frame} index={idx} />
        ))}
      </motion.div>
    </div>
  );
};
