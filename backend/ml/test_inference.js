import { predictMood } from "./moodPredictor.js";

const testQueries = [
  "I got a huge promotion today and I am celebrating with my family!",
  "I feel so down and miserable, everything is falling apart.",
  "I am so mad at this terrible service, totally unacceptable!",
  "Let us grind and push past our limits to win the championship!",
  "Drinking tea and listening to soft jazz in complete peace.",
  "I am having a panic attack about tomorrow's presentation, so scared.",
  "What is the difference between Python and JavaScript?"
];

console.log("=== 🧠 Testing Friday ML Emotion Inference Engine ===");
testQueries.forEach((q) => {
  const result = predictMood(q);
  console.log(`\nInput: "${q}"`);
  console.log(`🎯 Predicted Emotion: [${result.predictedMood.toUpperCase()}] (Confidence: ${(result.confidence * 100).toFixed(1)}%)`);
  console.log(`📊 Probabilities:`, result.probabilities);
});
