import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAppStore } from '../store/appStore';
import { UploadCloud, Film } from 'lucide-react';

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
    <div 
      {...getRootProps()} 
      className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50 hover:bg-muted/50'}
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4">
        <div className="p-4 bg-muted rounded-full">
          {isDragActive ? (
            <UploadCloud className="w-8 h-8 text-primary animate-bounce" />
          ) : (
            <Film className="w-8 h-8 text-muted-foreground" />
          )}
        </div>
        <div>
          <p className="text-lg font-medium">
            {isDragActive ? 'Drop the video here' : 'Drag & drop a video file'}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Supports MP4, MOV, WEBM, AVI, MKV
          </p>
        </div>
      </div>
    </div>
  );
};
