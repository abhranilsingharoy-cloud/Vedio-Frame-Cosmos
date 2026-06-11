import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAppStore } from '../store/appStore';
import { UploadCloud, Film } from 'lucide-react';
import { motion } from 'framer-motion';

export const UploadDropzone = () => {
  const setVideo = useAppStore(state => state.setVideo);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];
    
    // Create an object URL to load the video metadata
    const url = URL.createObjectURL(file);
    const videoElement = document.createElement('video');
    videoElement.src = url;
    videoElement.onloadedmetadata = () => {
      setVideo({
        file,
        name: file.name,
        url,
        duration: videoElement.duration,
        width: videoElement.videoWidth,
        height: videoElement.videoHeight,
        fps: 30, // Approximate, FFmpeg will recalculate
      });
    };
  }, [setVideo]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.webm', '.avi', '.mkv']
    },
    maxFiles: 1
  });

  return (
    <motion.div 
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98, y: 0 }}
      {...(getRootProps() as any)} 
      className={`border-t border-l border-white/20 border-r border-black/50 border-b-8 rounded-3xl p-8 md:p-16 text-center cursor-pointer transition-all duration-300 transform-style-3d shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-md relative overflow-hidden
        ${isDragActive ? 'border-b-primary/80 bg-primary/20 shadow-[0_20px_50px_rgba(99,102,241,0.4)]' : 'border-b-black/80 bg-black/40 hover:border-b-primary/50'}
      `}
    >
      {isDragActive && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent pointer-events-none" 
        />
      )}
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4">
        <motion.div 
          animate={isDragActive ? { y: [0, -10, 0], scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="p-5 bg-gradient-to-br from-white/10 to-transparent rounded-2xl shadow-inner border border-white/5"
        >
          {isDragActive ? (
            <UploadCloud className="w-10 h-10 text-primary drop-shadow-[0_0_15px_rgba(99,102,241,0.8)]" />
          ) : (
            <Film className="w-10 h-10 text-muted-foreground drop-shadow-md" />
          )}
        </motion.div>
        <div>
          <p className="text-lg font-medium">
            {isDragActive ? 'Drop the video here' : 'Drag & drop a video file'}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Supports MP4, MOV, WEBM, AVI, MKV
          </p>
        </div>
      </div>
    </motion.div>
  );
};
