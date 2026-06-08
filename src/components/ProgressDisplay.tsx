import { useAppStore } from '../store/appStore';
import { motion } from 'framer-motion';

export const ProgressDisplay = () => {
  const { isExtracting, progress, progressMessage } = useAppStore();

  if (!isExtracting && progress === 0) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center">
      <div className="bg-card border border-border rounded-xl p-8 max-w-sm w-full shadow-2xl flex flex-col items-center">
        
        {/* Animated Ring */}
        <div className="relative w-24 h-24 mb-6">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              className="text-muted stroke-current"
              strokeWidth="8"
              cx="50" cy="50" r="40"
              fill="transparent"
            />
            <motion.circle
              className="text-primary stroke-current"
              strokeWidth="8"
              strokeLinecap="round"
              cx="50" cy="50" r="40"
              fill="transparent"
              initial={{ strokeDasharray: "251.2", strokeDashoffset: "251.2" }}
              animate={{ strokeDashoffset: 251.2 - (251.2 * progress) }}
              transition={{ ease: "linear", duration: 0.2 }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold">{Math.round(progress * 100)}%</span>
          </div>
        </div>

        <p className="text-center font-medium animate-pulse">{progressMessage}</p>
      </div>
    </div>
  );
};
