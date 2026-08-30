// Synthetic Large-Scale Data Generator for Friday Emotion ML Engine
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const moodVocabularies = {
  happy: {
    subjects: ["I", "My friend and I", "We", "Everyone here", "My team", "I really", "Honestly I"],
    verbs: ["am feeling", "am so", "feel totally", "cannot stop being", "am incredibly", "became", "feel genuinely"],
    adjectives: ["happy", "cheerful", "thrilled", "joyful", "ecstatic", "excited", "delighted", "overjoyed", "blessed", "radiant", "gleeful", "content", "sunny", "elated"],
    contexts: [
      "because of this wonderful news",
      "after celebrating our big victory today",
      "with how everything turned out so great",
      "about starting this amazing new adventure",
      "with my family and best friends tonight",
      "hearing such uplifting compliments",
      "winning first place in the tournament",
      "getting accepted into my dream program",
      "enjoying this beautiful sunny day",
      "having such a fun and unforgettable time"
    ],
    extras: ["!", "!!", " Truly the best day ever.", " Life is awesome.", " So thankful for everything.", " Smiling from ear to ear."]
  },
  sad: {
    subjects: ["I", "I really", "Deep down I", "Lately I", "Honestly I", "My heart", "I just"],
    verbs: ["am feeling", "feel so", "am completely", "feel deeply", "cannot stop feeling", "am profoundly", "feel utterly"],
    adjectives: ["sad", "depressed", "heartbroken", "down", "lonely", "miserable", "sorrowful", "gloomy", "unhappy", "hopeless", "grief-stricken", "defeated", "dismal", "devastated"],
    contexts: [
      "and everything seems so dark lately",
      "because nothing is working out for me",
      "missing my dearest companion so much",
      "after failing my important examination",
      "crying alone in my room tonight",
      "feeling neglected and ignored by everyone",
      "after losing something so precious to me",
      "carrying this heavy emotional pain inside",
      "and feeling completely exhausted and empty",
      "wondering if things will ever get better"
    ],
    extras: [".", "...", " It really hurts inside.", " Feeling so broken.", " I just want to cry.", " So emotionally drained."]
  },
  angry: {
    subjects: ["I", "I am", "Honestly I", "I swear I", "I really", "You people", "This situation"],
    verbs: ["am so", "am extremely", "am furiously", "cannot stand being", "feel totally", "am outrageously", "am insanely"],
    adjectives: ["angry", "furious", "mad", "pissed off", "enraged", "infuriated", "irritated", "livid", "outraged", "fuming", "disgusted", "annoyed", "bitter", "provoked"],
    contexts: [
      "at the continuous incompetence and lies",
      "with how terribly I was treated today",
      "because they stole credit for my hard work",
      "at this atrocious and rude customer service",
      "having wasted hours due to stupid mistakes",
      "with these endless broken promises and excuses",
      "because of this completely unfair treatment",
      "when people disrespect my personal boundaries",
      "at the utter lack of responsibility shown",
      "watching this blatant betrayal and arrogance"
    ],
    extras: ["!", "!!", " This is totally unacceptable!", " I am at my breaking point!", " Absolutely ridiculous!", " Stop wasting my time!"]
  },
  motivated: {
    subjects: ["I", "We", "My team and I", "Every single day I", "Right now I", "I am ready to", "I definitely"],
    verbs: ["am fully", "feel completely", "am relentlessly", "am extraordinarily", "am intensely", "am massively", "remain"],
    adjectives: ["motivated", "driven", "determined", "inspired", "ambitious", "focused", "energized", "unstoppable", "disciplined", "passionate", "committed", "hyped up", "fierce", "tenacious"],
    contexts: [
      "to grind hard and achieve all my targets",
      "to crush this workout and break records",
      "to build something truly legendary and impactful",
      "to execute our business strategy flawlessly",
      "to learn new skills and level up in my career",
      "to conquer any obstacle that stands in the way",
      "to hustle day and night until we win",
      "to turn every single setback into a major comeback",
      "to outwork the competition with pure discipline",
      "to reach peak performance and master my craft"
    ],
    extras: ["!", " Let us make it happen!", " No excuses allowed.", " Full focus and dedication.", " Time to dominate.", " Ready to win."]
  },
  calm: {
    subjects: ["I", "Right now I", "This evening I", "Lately I", "Honestly I", "My mind", "I just"],
    verbs: ["am feeling", "feel so", "am deeply", "feel thoroughly", "am very", "feel perfectly", "remain entirely"],
    adjectives: ["calm", "relaxed", "peaceful", "serene", "tranquil", "chill", "composed", "centered", "unbothered", "restful", "mellow", "placid", "soothing", "grounded"],
    contexts: [
      "sipping warm herbal tea while listening to the rain",
      "meditating quietly in a quiet serene room",
      "reading my favorite book on the comfortable couch",
      "taking slow deep breaths and enjoying silence",
      "taking a leisurely stroll in the nature park",
      "listening to soft relaxing ambient music",
      "unwinding quietly after a long productive week",
      "watching the tranquil ocean waves gently roll in",
      "enjoying a cozy slow evening without any rush",
      "appreciating the quiet stillness of the night"
    ],
    extras: [".", "...", " So tranquil and nice.", " Very peaceful feeling.", " Completely at ease.", " Balanced and serene."]
  },
  anxious: {
    subjects: ["I", "My mind", "Honestly I", "Lately I", "I feel like I", "Right now I", "Deep down I"],
    verbs: ["am feeling", "feel so", "am extremely", "am terribly", "am insanely", "cannot stop feeling", "am severely"],
    adjectives: ["anxious", "nervous", "stressed", "panicked", "worried", "fearful", "jittery", "terrified", "apprehensive", "on edge", "overwhelmed", "frightened", "uneasy", "tense"],
    contexts: [
      "about tomorrow's critical interview and test results",
      "with my heart racing fast and hands shaking",
      "overthinking all possible worst-case scenarios",
      "with dread and worry keeping me awake at night",
      "feeling like everything is spinning out of control",
      "terrified of making a mistake and failing everyone",
      "dreading the upcoming deadline and high pressure",
      "wondering if something terrible is going to happen",
      "with continuous panic and tension building up",
      "feeling suffocated by stress and heavy uncertainty"
    ],
    extras: ["...", "!", " I can barely breathe.", " My heart is pounding.", " Please help me calm down.", " So much stress."]
  },
  neutral: {
    subjects: ["Can you", "Please", "I want to", "Could you", "Kindly", "How do I", "Tell me"],
    verbs: ["explain", "summarize", "describe", "clarify", "detail", "calculate", "translate", "list", "compare", "provide"],
    adjectives: ["a concise overview of", "the exact steps for", "the key technical differences between", "a simple guide on", "the historical timeline of", "the primary principles of", "the definition and usage of"],
    contexts: [
      "building REST APIs with Node.js and Express",
      "quantum computing principles and quantum bits",
      "machine learning classifiers and statistical models",
      "the orbital mechanics of planets in the solar system",
      "database indexing algorithms in B-Trees and Hash Maps",
      "modern web design and frontend component lifecycles",
      "cloud computing architectures and microservices",
      "the economic principles of inflation and interest rates",
      "photosynthesis in plant biology and chloroplasts",
      "data structures including linked lists and binary trees"
    ],
    extras: ["?", ".", " for my research.", " step by step.", " in clear bullet points.", " with an example."]
  }
};

export function generateLargeDataset(targetCount = 100000) {
  console.log(`⚡ Generating ${targetCount.toLocaleString()} rich synthetic ML training samples across 7 emotion classes...`);
  const dataset = [];
  const moods = Object.keys(moodVocabularies);
  const perMood = Math.ceil(targetCount / moods.length);

  moods.forEach((mood) => {
    const vocab = moodVocabularies[mood];
    const { subjects, verbs, adjectives, contexts, extras } = vocab;

    for (let i = 0; i < perMood && dataset.length < targetCount; i++) {
      const s = subjects[Math.floor(Math.random() * subjects.length)];
      const v = verbs[Math.floor(Math.random() * verbs.length)];
      const a = adjectives[Math.floor(Math.random() * adjectives.length)];
      const c = contexts[Math.floor(Math.random() * contexts.length)];
      const e = extras[Math.floor(Math.random() * extras.length)];

      let text = "";
      if (mood === "neutral") {
        text = `${s} ${v} ${a} ${c}${e}`;
      } else {
        const variation = Math.random();
        if (variation < 0.4) {
          text = `${s} ${v} ${a} ${c}${e}`;
        } else if (variation < 0.7) {
          text = `${s} ${v} ${a}${e}`;
        } else {
          text = `${a.toUpperCase()}! ${s} ${v} ${c}${e}`;
        }
      }

      dataset.push({ text, label: mood });
    }
  });

  // Shuffle dataset thoroughly
  for (let i = dataset.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [dataset[i], dataset[j]] = [dataset[j], dataset[i]];
  }

  const outputPath = path.join(__dirname, "data", "emotion_dataset.json");
  console.log(`💾 Writing ${dataset.length.toLocaleString()} samples to ${outputPath}...`);
  fs.writeFileSync(outputPath, JSON.stringify(dataset, null, 2));
  console.log(`✅ Successfully saved 100,000 samples to dataset!`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const count = parseInt(process.argv[2]) || 100000;
  generateLargeDataset(count);
}
