// NLP Preprocessing & Feature Extraction Engine

// Common English stopwords
const STOPWORDS = new Set([
  "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", 
  "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", 
  "by", "could", "did", "do", "does", "doing", "down", "during", "each", "few", "for", "from", 
  "further", "had", "has", "have", "having", "he", "her", "here", "hers", "herself", "him", 
  "himself", "his", "how", "i", "if", "in", "into", "is", "it", "its", "itself", "me", "more", 
  "most", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", 
  "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "she", "should", "so", 
  "some", "such", "than", "that", "the", "their", "theirs", "them", "themselves", "then", "there", 
  "these", "they", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", 
  "we", "were", "what", "when", "where", "which", "while", "who", "whom", "why", "with", "would", 
  "you", "your", "yours", "yourself", "yourselves"
]);

// Basic suffix stemming to reduce words to root form
export function stemWord(word) {
  if (word.length <= 3) return word;
  if (word.endsWith("ing") && word.length > 5) return word.slice(0, -3);
  if (word.endsWith("ly") && word.length > 4) return word.slice(0, -2);
  if (word.endsWith("ed") && word.length > 4) return word.slice(0, -2);
  if (word.endsWith("es") && word.length > 4) return word.slice(0, -2);
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) return word.slice(0, -1);
  return word;
}

// Tokenize, remove punctuation, filter stopwords, apply stemming & generate 1-gram + 2-gram features
export function preprocessText(text, generateBigrams = true) {
  if (!text || typeof text !== "string") return [];

  // Normalize: lowercasing and replacing special punctuation with spaces
  const clean = text.toLowerCase().replace(/[^a-z0-9\s]/g, " ");
  const rawTokens = clean.split(/\s+/).filter(t => t.length > 1);

  const tokens = [];
  for (const t of rawTokens) {
    if (!STOPWORDS.has(t)) {
      tokens.push(stemWord(t));
    }
  }

  // Generate bigrams for capturing phrase-level context (e.g., "not good", "job offer")
  if (generateBigrams && tokens.length > 1) {
    const bigrams = [];
    for (let i = 0; i < tokens.length - 1; i++) {
      bigrams.push(`${tokens[i]}_${tokens[i + 1]}`);
    }
    return [...tokens, ...bigrams];
  }

  return tokens;
}
