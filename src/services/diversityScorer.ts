import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import type { Frame } from '../types';

let model: mobilenet.MobileNet | null = null;

export const loadModel = async () => {
  if (model) return model;
  await tf.ready();
  model = await mobilenet.load({ version: 2, alpha: 1.0 });
  return model;
};

// Compute cosine similarity between two 1D tensors (arrays)
const cosineSimilarity = (a: Float32Array | Int32Array | Uint8Array, b: Float32Array | Int32Array | Uint8Array) => {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

export const selectDiverseFrames = async (
  frames: Frame[],
  targetCount: number,
  onProgress?: (p: number) => void
): Promise<Frame[]> => {
  if (frames.length <= targetCount) return frames;

  const m = await loadModel();
  
  // Extract features for all frames
  const embeddings: { frame: Frame; features: Float32Array | Int32Array | Uint8Array }[] = [];
  
  for (let i = 0; i < frames.length; i++) {
    const frame = frames[i];
    const img = new Image();
    img.src = frame.url;
    await new Promise((resolve) => {
      img.onload = resolve;
    });
    
    // Infer the features (we use the intermediate activation if possible, 
    // but mobilenet.infer returns the embeddings)
    const activation = m.infer(img, true); // true = get embeddings, not class predictions
    embeddings.push({
      frame,
      features: activation.dataSync(),
    });
    
    activation.dispose(); // free memory
    if (onProgress) onProgress((i + 1) / frames.length * 0.5); // First 50% is extraction
  }

  // Maximum Marginal Relevance (Greedy Selection)
  const selected: typeof embeddings = [];
  const remaining = [...embeddings];
  
  // Start with the first frame (or we could compute the centroid)
  selected.push(remaining.shift()!);

  while (selected.length < targetCount && remaining.length > 0) {
    let bestIdx = -1;
    let maxMinDist = -1;

    for (let i = 0; i < remaining.length; i++) {
      let minDistToSelected = Infinity;
      
      for (const sel of selected) {
        // Distance = 1 - cosine similarity
        const sim = cosineSimilarity(remaining[i].features, sel.features);
        const dist = 1 - sim;
        if (dist < minDistToSelected) {
          minDistToSelected = dist;
        }
      }

      if (minDistToSelected > maxMinDist) {
        maxMinDist = minDistToSelected;
        bestIdx = i;
      }
    }

    selected.push(remaining[bestIdx]);
    remaining.splice(bestIdx, 1);
    
    if (onProgress) {
      onProgress(0.5 + (selected.length / targetCount) * 0.5);
    }
  }

  return selected.map(s => s.frame).sort((a, b) => a.number - b.number);
};
