export interface Frame {
  id: string;
  blob: Blob;
  url: string;
  number: number;
  timestamp: number; // in milliseconds
  width: number;
  height: number;
  size: number; // in bytes
  qualityScore?: number;
  blurScore?: number;
  brightnessScore?: number;
  sceneId?: number;
}

export interface VideoInfo {
  file: File;
  name: string;
  url: string;
  duration: number;
  width: number;
  height: number;
  fps: number;
}

export interface ExtractionConfig {
  frameCount: number;
  quality: number;
  format: 'yolo' | 'coco' | 'csv' | 'none';
  smartSceneDetection: boolean;
  sceneSensitivity: 'low' | 'medium' | 'high';
  resolutionScale: 25 | 50 | 75 | 100;
  startTime: number; // percentage 0-100
  endTime: number; // percentage 0-100
}

export interface Preset {
  id: string;
  name: string;
  config: ExtractionConfig;
}
