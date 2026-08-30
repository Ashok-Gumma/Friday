import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { MultinomialNaiveBayes } from "./modelTrainer.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let cachedModel = null;

export function getTrainedModel() {
  if (cachedModel) return cachedModel;

  try {
    const modelPath = path.join(__dirname, "data", "trained_model.json");
    if (fs.existsSync(modelPath)) {
      const modelData = JSON.parse(fs.readFileSync(modelPath, "utf-8"));
      cachedModel = new MultinomialNaiveBayes();
      cachedModel.importModel(modelData);
      return cachedModel;
    }
  } catch (err) {
    console.error("Error loading trained ML model:", err);
  }

  // Fallback: train on the fly if file missing
  const datasetPath = path.join(__dirname, "data", "emotion_dataset.json");
  const dataset = JSON.parse(fs.readFileSync(datasetPath, "utf-8"));
  cachedModel = new MultinomialNaiveBayes(0.5);
  cachedModel.train(dataset);
  return cachedModel;
}

/**
 * Predicts user mood/emotion from raw input message text using the trained ML model.
 * @param {string} text - User message
 * @returns {{ predictedMood: string, confidence: number, probabilities: object }}
 */
export function predictMood(text) {
  const model = getTrainedModel();
  return model.predict(text);
}
