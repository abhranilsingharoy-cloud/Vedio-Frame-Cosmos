import JSZip from 'jszip';
import type { Frame, ExtractionConfig, VideoInfo } from '../types';

export const generateYoloDataset = async (frames: Frame[], zip: JSZip) => {
  const datasetFolder = zip.folder('dataset');
  if (!datasetFolder) return;

  const imagesFolder = datasetFolder.folder('images');
  const labelsFolder = datasetFolder.folder('labels');
  
  if (!imagesFolder || !labelsFolder) return;

  const trainImages = imagesFolder.folder('train');
  const trainLabels = labelsFolder.folder('train');

  if (!trainImages || !trainLabels) return;

  frames.forEach(frame => {
    const filename = `frame_${frame.number.toString().padStart(3, '0')}`;
    trainImages.file(`${filename}.jpg`, frame.blob);
    trainLabels.file(`${filename}.txt`, ''); // Blank label file
  });

  const yamlContent = `nc: 0\nnames: []\npath: .\ntrain: images/train\nval: images/train`;
  datasetFolder.file('dataset.yaml', yamlContent);
};

export const generateCocoDataset = async (frames: Frame[], zip: JSZip) => {
  const images = frames.map(f => ({
    id: f.number,
    file_name: `frame_${f.number.toString().padStart(3, '0')}.jpg`,
    width: f.width,
    height: f.height,
  }));

  const coco = {
    images,
    annotations: [],
    categories: []
  };

  zip.file('coco_annotations.json', JSON.stringify(coco, null, 2));
  
  const imagesFolder = zip.folder('images');
  if (!imagesFolder) return;
  
  frames.forEach(frame => {
    const filename = `frame_${frame.number.toString().padStart(3, '0')}.jpg`;
    imagesFolder.file(filename, frame.blob);
  });
};

export const generateCSV = (frames: Frame[], videoName: string): string => {
  const header = ['frame_id', 'filename', 'timestamp_ms', 'width', 'height', 'filesize_kb', 'blur_score', 'brightness', 'scene_id'];
  const rows = frames.map(f => [
    f.number,
    `${videoName}_frame_${f.number.toString().padStart(3, '0')}.jpg`,
    Math.round(f.timestamp),
    f.width,
    f.height,
    (f.size / 1024).toFixed(2),
    f.blurScore?.toFixed(4) || 0,
    f.brightnessScore?.toFixed(4) || 0,
    f.sceneId || 0
  ]);

  return [header.join(','), ...rows.map(r => r.join(','))].join('\n');
};

export const exportFrames = async (
  frames: Frame[], 
  config: ExtractionConfig, 
  videoInfo: VideoInfo,
  onProgress?: (p: number) => void
): Promise<Blob> => {
  const zip = new JSZip();

  if (config.format === 'yolo') {
    await generateYoloDataset(frames, zip);
  } else if (config.format === 'coco') {
    await generateCocoDataset(frames, zip);
  } else {
    // Just dump images
    const imagesFolder = zip.folder('frames');
    if (imagesFolder) {
      frames.forEach(frame => {
        const filename = `${videoInfo.name.replace(/\.[^/.]+$/, "")}_frame_${frame.number.toString().padStart(3, '0')}.jpg`;
        imagesFolder.file(filename, frame.blob);
      });
    }
  }

  if (config.format === 'csv' || config.format === 'yolo' || config.format === 'coco') {
    zip.file('metadata.csv', generateCSV(frames, videoInfo.name.replace(/\.[^/.]+$/, "")));
  }

  const content = await zip.generateAsync({ 
    type: 'blob',
    streamFiles: true,
  }, (metadata) => {
    if (onProgress) {
      onProgress(metadata.percent / 100);
    }
  });

  return content;
};
