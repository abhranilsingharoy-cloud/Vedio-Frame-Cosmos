import { useRef, useEffect } from 'react';
import { useAppStore } from '../store/appStore';

export const VideoPlayer = () => {
  const videoInfo = useAppStore(state => state.video);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoInfo && videoRef.current) {
      videoRef.current.src = videoInfo.url;
    }
  }, [videoInfo]);

  if (!videoInfo) return null;

  return (
    <div className="relative w-full bg-black rounded-xl overflow-hidden aspect-video">
      <video
        ref={videoRef}
        controls
        className="w-full h-full object-contain"
        crossOrigin="anonymous"
      />
    </div>
  );
};
