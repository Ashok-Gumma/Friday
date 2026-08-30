// Multinomial Naive Bayes Classifier with TF-IDF Vectorization
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { preprocessText } from "./nlpPreprocessor.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class MultinomialNaiveBayes {
  constructor(alpha = 1.0) {
    this.alpha = alpha; // Laplace smoothing
    this.classes = [];
    this.classDocCounts = {};
    this.classWordCounts = {};
    this.totalClassTokens = {};
    this.vocabulary = new Set();
    this.idf = {};
    this.totalDocs = 0;
    this.classPriors = {};
  }

  train(trainingData) {
    this.totalDocs = trainingData.length;
    const docFrequency = {};
    this.classes = [];
    this.classDocCounts = {};
    this.classWordCounts = {};
    this.totalClassTokens = {};
    this.vocabulary = new Set();
    this.idf = {};
    this.classPriors = {};

    // 1. Collect classes and document statistics
    trainingData.forEach(({ text, label }) => {
      if (!this.classes.includes(label)) {
        this.classes.push(label);
        this.classDocCounts[label] = 0;
        this.classWordCounts[label] = {};
        this.totalClassTokens[label] = 0;
      }
      this.classDocCounts[label]++;

      const tokens = preprocessText(text, true);
      const uniqueTokensInDoc = new Set(tokens);

      uniqueTokensInDoc.forEach((token) => {
        docFrequency[token] = (docFrequency[token] || 0) + 1;
        this.vocabulary.add(token);
      });

      tokens.forEach((token) => {
        this.classWordCounts[label][token] = (this.classWordCounts[label][token] || 0) + 1;
        this.totalClassTokens[label]++;
      });
    });

    // 2. Calculate IDF for each token in vocabulary
    this.vocabulary.forEach((token) => {
      const df = docFrequency[token] || 1;
      this.idf[token] = Math.log((this.totalDocs + 1) / (df + 1)) + 1;
    });

    // 3. Calculate Class Prior Probabilities P(C)
    this.classes.forEach((c) => {
      this.classPriors[c] = Math.log(this.classDocCounts[c] / this.totalDocs);
    });

    return this;
  }

  predict(text) {
    const tokens = preprocessText(text, true);
    if (tokens.length === 0) {
      return { predictedMood: "neutral", confidence: 0.5, probabilities: {} };
    }

    const vocabSize = this.vocabulary.size;
    const logPosteriors = {};

    // Check how many tokens exist in our learned vocabulary
    const knownTokens = tokens.filter(t => this.vocabulary.has(t));
    if (knownTokens.length === 0) {
      return {
        predictedMood: "neutral",
        confidence: 0.85,
        probabilities: { neutral: 0.85, happy: 0.025, sad: 0.025, angry: 0.025, motivated: 0.025, calm: 0.025, anxious: 0.025 }
      };
    }

    this.classes.forEach((c) => {
      let logProb = this.classPriors[c];
      const totalTokens = this.totalClassTokens[c] || 1;

      knownTokens.forEach((token) => {
        const count = (this.classWordCounts[c] && this.classWordCounts[c][token]) || 0;
        const idfWeight = this.idf[token] || 1.0;
        
        // Standard Multinomial Naive Bayes smoothed conditional probability P(w|c)
        // Weighted by term specificity (IDF)
        const smoothedProb = (count * idfWeight + this.alpha) / (totalTokens + this.alpha * vocabSize);
        logProb += Math.log(smoothedProb);
      });

      logPosteriors[c] = logProb;
    });

    // Softmax normalization for probabilities
    const maxLog = Math.max(...Object.values(logPosteriors));
    let sumExp = 0;
    const expScores = {};

    this.classes.forEach((c) => {
      expScores[c] = Math.exp(logPosteriors[c] - maxLog);
      sumExp += expScores[c];
    });

    const probabilities = {};
    let highestProb = -1;
    let predictedClass = "neutral";

    this.classes.forEach((c) => {
      const prob = sumExp > 0 ? expScores[c] / sumExp : 1 / this.classes.length;
      probabilities[c] = parseFloat(prob.toFixed(4));
      if (prob > highestProb) {
        highestProb = prob;
        predictedClass = c;
      }
    });

    // If highest confidence is very weak (under 40%), classify as neutral
    if (highestProb < 0.40) {
      predictedClass = "neutral";
    }

    return {
      predictedMood: predictedClass,
      confidence: parseFloat(highestProb.toFixed(3)),
      probabilities,
    };
  }

  exportModel() {
    return {
      classes: this.classes,
      classDocCounts: this.classDocCounts,
      classWordCounts: this.classWordCounts,
      totalClassTokens: this.totalClassTokens,
      vocabulary: Array.from(this.vocabulary),
      idf: this.idf,
      totalDocs: this.totalDocs,
      classPriors: this.classPriors,
      alpha: this.alpha,
    };
  }

  importModel(data) {
    this.classes = data.classes;
    this.classDocCounts = data.classDocCounts;
    this.classWordCounts = data.classWordCounts;
    this.totalClassTokens = data.totalClassTokens;
    this.vocabulary = new Set(data.vocabulary);
    this.idf = data.idf;
    this.totalDocs = data.totalDocs;
    this.classPriors = data.classPriors;
    this.alpha = data.alpha || 1.0;
    return this;
  }
}

// Training & Evaluation Runner
export function runTraining() {
  const datasetPath = path.join(__dirname, "data", "emotion_dataset.json");
  const dataset = JSON.parse(fs.readFileSync(datasetPath, "utf-8"));

  // Stratified Shuffle / Split: 80% train, 20% validation
  const shuffled = [...dataset].sort(() => 0.5 - Math.random());
  const splitIdx = Math.floor(shuffled.length * 0.8);
  const trainSet = shuffled.slice(0, splitIdx);
  const testSet = shuffled.slice(splitIdx);

  console.log(`📊 ML Dataset loaded: ${dataset.length} samples.`);
  console.log(`⚙️ Training on ${trainSet.length} samples, testing on ${testSet.length} samples.`);

  const model = new MultinomialNaiveBayes(0.5);
  model.train(trainSet);

  // Evaluate on Test Set
  let correct = 0;
  testSet.forEach((sample) => {
    const { predictedMood } = model.predict(sample.text);
    if (predictedMood === sample.label) correct++;
  });

  const accuracy = ((correct / testSet.length) * 100).toFixed(2);
  console.log(`✅ Evaluation Test Accuracy: ${accuracy}% (${correct}/${testSet.length})`);

  // Retrain on full dataset for production use
  model.train(dataset);

  const outputPath = path.join(__dirname, "data", "trained_model.json");
  fs.writeFileSync(outputPath, JSON.stringify(model.exportModel(), null, 2));
  console.log(`🚀 Production Model saved to ${outputPath}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runTraining();
}
