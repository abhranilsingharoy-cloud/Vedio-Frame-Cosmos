import { create } from 'zustand';
import type { Frame, VideoInfo, ExtractionConfig } from '../types';

interface AppState {
  video: VideoInfo | null;
  frames: Frame[];
  selectedFrames: Set<string>;
  config: ExtractionConfig;
  isExtracting: boolean;
  progress: number;
  progressMessage: string;
  lightboxIndex: number | null;
  
  setVideo: (video: VideoInfo | null) => void;
  addFrame: (frame: Frame) => void;
  setFrames: (frames: Frame[]) => void;
  clearFrames: () => void;
  toggleFrameSelection: (id: string) => void;
  selectAllFrames: () => void;
  clearSelection: () => void;
  deleteSelectedFrames: () => void;
  setConfig: (config: Partial<ExtractionConfig>) => void;
  setIsExtracting: (isExtracting: boolean) => void;
  setProgress: (progress: number, message?: string) => void;
  setLightboxIndex: (index: number | null) => void;
  reset: () => void;
}

const defaultConfig: ExtractionConfig = {
  frameCount: 50,
  quality: 85,
  format: 'none',
  smartSceneDetection: false,
  sceneSensitivity: 'medium',
  resolutionScale: 100,
  startTime: 0,
  endTime: 100,
};

export const useAppStore = create<AppState>((set) => ({
  video: null,
  frames: [],
  selectedFrames: new Set(),
  config: defaultConfig,
  isExtracting: false,
  progress: 0,
  progressMessage: '',
  lightboxIndex: null,

  setVideo: (video) => set({ video }),
  addFrame: (frame) => set((state) => ({ frames: [...state.frames, frame] })),
  setFrames: (frames) => set({ frames }),
  clearFrames: () => set({ frames: [], selectedFrames: new Set() }),
  toggleFrameSelection: (id) => set((state) => {
    const newSelection = new Set(state.selectedFrames);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    return { selectedFrames: newSelection };
  }),
  selectAllFrames: () => set((state) => ({
    selectedFrames: new Set(state.frames.map(f => f.id))
  })),
  clearSelection: () => set({ selectedFrames: new Set() }),
  deleteSelectedFrames: () => set((state) => {
    const newFrames = state.frames.filter(f => !state.selectedFrames.has(f.id));
    return { frames: newFrames, selectedFrames: new Set(), lightboxIndex: null };
  }),
  setConfig: (newConfig) => set((state) => ({ config: { ...state.config, ...newConfig } })),
  setIsExtracting: (isExtracting) => set({ isExtracting }),
  setProgress: (progress, message) => set((state) => ({ 
    progress, 
    progressMessage: message !== undefined ? message : state.progressMessage 
  })),
  setLightboxIndex: (index) => set({ lightboxIndex: index }),
  reset: () => set({
    video: null,
    frames: [],
    selectedFrames: new Set(),
    config: defaultConfig,
    isExtracting: false,
    progress: 0,
    progressMessage: '',
    lightboxIndex: null
  }),
}));
