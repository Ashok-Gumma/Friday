import { predictMood } from "../ml/moodPredictor.js";

/**
 * Universal AI Service for Friday:
 * 1. Automatically uses free Generative AI APIs if configured (Gemini / Groq / OpenAI / OpenRouter).
 * 2. Provides a comprehensive, nuanced, bug-free on-device NLP & ML dialogue engine if running standalone.
 */

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Robust Local Semantic & Emotional Dialogue Synthesis.
 */
export function generateMLEmotionalResponse({ userMessage, selectedMood = "relaxed", context = [], profile = {} }) {
  const msg = (userMessage || "").trim();
  const lower = msg.toLowerCase();

  // Run local ML Emotion Model
  const ml = predictMood(msg);
  const detectedMood = ml.predictedMood || selectedMood;
  const confidence = ml.confidence;

  const userName = profile?.name ? `, ${profile.name}` : "";

  // 1. Exact Identity & Construction Inquiries (Strict matching to prevent false positives)
  if (/^(who are you\??|what are you\??|tell me about yourself|who built you\??|who made you\??|how were you built\??|how you build\??)$/i.test(lower)) {
    return pickRandom([
      `I'm Friday! I am an empathetic AI companion designed with emotional machine learning to listen with genuine understanding, provide a calming space, and adapt to how you feel.`,
      `I'm Friday — your private, judgment-free sanctuary. I combine natural language understanding with mood-adaptive intelligence to chat with warmth, clarity, and presence.`,
      `I was created as Friday to be a mindful companion for your thoughts and emotions, helping you navigate your day with peace and perspective.`
    ]);
  }

  // 2. Philosophical & General Inquiries (e.g., "thoughts about humans", "what is happiness")
  if (/thoughts (about|on) humans|opinion on humanity|what do you think of humans/i.test(lower)) {
    return pickRandom([
      `I think humans are remarkably resilient and deeply creative. The capacity you have to feel so deeply, create art, love, and overcome hardship is truly beautiful.`,
      `Human beings are fascinating — you carry such a wide spectrum of emotions, from profound joy to vulnerability. It makes your experiences unique and meaningful.`,
      `I see humans as wonderfully complex. Life throws so much at you, yet you continuously seek meaning, connection, and peace.`
    ]);
  }

  if (/what is (the meaning of )?life|purpose of life|why are we here/i.test(lower)) {
    return pickRandom([
      `I believe life's meaning is what you choose to fill it with — the quiet moments of connection, creating things you care about, and finding peace within yourself.`,
      `Perhaps purpose isn't something we find, but something we cultivate each day through kindness, presence, and curiosity.`
    ]);
  }

  if (/what (are you|do you mean|are u) talking( about)?\??/i.test(lower)) {
    return pickRandom([
      `I was reflecting on our conversation and how you're feeling right now! What would you like us to focus on?`,
      `Just keeping our conversation flowing and checking in on your thoughts. Tell me what's on your mind today!`,
      `I'm right here with you — let's reset. What would you like to talk about next?`
    ]);
  }

  // 3. Greetings
  if (/^(hi|hello|hey|greetings|good morning|good evening|good afternoon|what's up|sup|yo)\b/i.test(lower)) {
    const greetingPool = {
      happy: [
        `Hey there! It's so great to hear from you. What exciting thing is on your mind today?`,
        `Hello${userName}! Your positive vibe is contagious. Tell me what's happening!`
      ],
      sad: [
        `Hello, my friend. I'm so glad you reached out. Take a gentle breath — I'm right here with you.`,
        `Hey${userName}. There's no pressure to put on a brave face here. What's on your heart?`
      ],
      anxious: [
        `Hey. Take a soft breath in... and out. I'm here with you. What feels heavy today?`,
        `Hello${userName}. You are safe in this quiet space. Take all the time you need.`
      ],
      motivated: [
        `Hey! Ready to make real progress today? What's our main focus?`,
        `Hello${userName}! Let's turn that ambition into momentum. What are we tackling?`
      ],
      calm: [
        `Hello. Welcome back to your quiet sanctuary. How does the day feel for you?`,
        `Hey there${userName}. Let's enjoy this peaceful moment together.`
      ]
    };
    const pool = greetingPool[selectedMood] || [
      `Hello${userName}! It's great to connect with you. What would you like to explore today?`,
      `Hey there! I'm here and ready to listen. How are things with you?`
    ];
    return pickRandom(pool);
  }

  // 4. Wellbeing / How are you
  if (/^(how are you|how do you feel|how's it going|how are things|how are u|how do u feel)/i.test(lower)) {
    const pool = {
      happy: [`I'm feeling wonderful${userName}, especially with the bright energy you're bringing! How is your day unfolding?`],
      sad: [`I'm here, fully present and holding space for you. More importantly, how is your heart feeling right now?`],
      anxious: [`I'm calm and steady, right here to be an anchor for you. Let's take a slow, gentle breath together.`],
      motivated: [`I'm energized and locked in! What ambitious target are we conquering today?`],
      calm: [`I'm feeling deeply centered and peaceful. It's lovely to share this stillness with you${userName}.`]
    }[selectedMood] || [`I'm doing well, thank you for asking${userName}! I'm glad we get to chat. How are you feeling in this moment?`];
    return pickRandom(pool);
  }

  // 5. Affection & Gratitude
  if (/i love you|love u|you('re| are) the best|you('re| are) amazing|thank you|thanks|i appreciate you/i.test(lower)) {
    return pickRandom([
      `That truly warms my heart${userName}. Having this connection and supporting you means everything to me.`,
      `Thank you so much. You're wonderful, and I'm always grateful whenever we get to share our thoughts.`,
      `I appreciate you so much! Remember that you always have a safe, welcoming haven here.`
    ]);
  }

  // 6. Emotional Expressive Inquiries (ML Driven)
  if (detectedMood === "sad" || /sad|depressed|lonely|crying|hurts|pain|heartbroken|tired of|hopeless/i.test(lower)) {
    return pickRandom([
      `I hear how heavy things feel right now${userName}. Please remember you don't have to carry this all alone — let it out, I'm listening.`,
      `It's completely okay to feel sad. Your feelings are valid, and I'm right here beside you through this quiet storm.`,
      `Take things one breath at a time. Whatever is hurting, you have the resilience to get through it, and I'm right here with you.`
    ]);
  }

  if (detectedMood === "angry" || /angry|mad|furious|annoyed|frustrated|hate|screwed|unfair/i.test(lower)) {
    return pickRandom([
      `I completely understand why you'd feel angry. It's totally natural to feel furious when things feel unfair. What happened?`,
      `That sounds deeply frustrating${userName}. Let it all out — I'm here to listen without any judgment.`,
      `Your frustration is valid. Take a moment to breathe, and tell me what part of this feels the most aggravating.`
    ]);
  }

  if (detectedMood === "anxious" || /scared|afraid|panic|worry|nervous|stress|overwhelm|anxious/i.test(lower)) {
    return pickRandom([
      `Let's pause together for a moment${userName}. Feel your feet on the floor and take one slow, deep breath. You are safe here.`,
      `Overwhelm can feel like a sudden wave, but waves always settle. What is the single biggest thought troubling you right now?`,
      `You don't have to figure out the whole future right now. Just focus on this exact moment with me.`
    ]);
  }

  if (detectedMood === "happy" || /happy|great|awesome|excited|yay|won|celebrate|proud|thrilled/i.test(lower)) {
    return pickRandom([
      `That is fantastic news${userName}! I love seeing you in this space. Tell me more about what made this happen!`,
      `Celebrate this victory! You deserve every bit of this happiness. What's the best part about it?`,
      `That's wonderful! Keep holding onto that bright energy — what are you looking forward to next?`
    ]);
  }

  if (detectedMood === "motivated" || /goal|focus|work|build|achieve|success|plan|grind|productive/i.test(lower)) {
    return pickRandom([
      `I love that drive! Clarity and commitment make big things happen. What's the immediate next milestone?`,
      `You have the vision and the discipline${userName} — let's channel that into execution. What's the first step?`,
      `Stay focused and relentless. Remember why you started, and let's keep that momentum strong!`
    ]);
  }

  // 7. General Reflective Dialogue
  return pickRandom([
    `That's an insightful thought${userName}. When you reflect on "${msg.length > 40 ? msg.slice(0, 40) + '...' : msg}", what feels most significant to you?`,
    `Thank you for sharing that with me. Tell me a bit more about how that impacts you right now.`,
    `I'm listening closely. Where would you like our thoughts to go from here?`,
    `That's really interesting. What perspective feels most true to you when you sit with it?`
  ]);
}

/**
 * Main AI generation function supporting Gemini, Groq, OpenAI, and Local ML engine.
 */
export async function getAIReply({ systemPrompt, messages = [], userMessage, selectedMood, profile = {} }) {
  // 1. Google Gemini (100% Free API Tier)
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (geminiKey) {
    try {
      const contents = [
        ...messages.map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }]
        }))
      ];
      if (!contents.some((c) => c.parts?.[0]?.text === userMessage)) {
        contents.push({ role: "user", parts: [{ text: userMessage }] });
      }

      const modelsToTry = ["gemini-3.6-flash", "gemini-flash-latest", "gemini-2.5-flash"];
      for (const mName of modelsToTry) {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${mName}:generateContent?key=${geminiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: systemPrompt }] },
            contents,
            generationConfig: { maxOutputTokens: 1000, temperature: 0.7 }
          })
        });

        if (res.ok) {
          const data = await res.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) return text.trim();
        }
      }
    } catch (err) {
      console.warn("Gemini API call failed:", err.message);
    }
  }

  // 2. Groq (100% Free API Tier - Ultra Fast Llama 3.3)
  if (process.env.GROQ_API_KEY) {
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "system", content: systemPrompt }, ...messages],
          max_tokens: 250
        })
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content;
        if (text) return text.trim();
      }
    } catch (err) {
      console.warn("Groq API call failed:", err.message);
    }
  }

  // 3. OpenAI (if key provided)
  if (process.env.OPENAI_API_KEY) {
    try {
      const { default: OpenAI } = await import("openai");
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        max_tokens: 250
      });
      const text = completion.choices?.[0]?.message?.content;
      if (text) return text.trim();
    } catch (err) {
      console.warn("OpenAI API call failed:", err.message);
    }
  }

  // 4. Local Machine Learning Emotional NLP Engine
  return generateMLEmotionalResponse({ userMessage, selectedMood, context: messages, profile });
}
