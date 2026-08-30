import Message from "../models/Message.js";
import { predictMood } from "../ml/moodPredictor.js";

// Mood → instruction mapping
const moodPrompts = {
  happy: "Be cheerful, upbeat, and playful. Match their positive energy!",
  calm: "Be calm, reassuring, and gently supportive.",
  angry: "Be calm, de-escalating, cool-headed, and understanding.",
  sad: "Be comforting, deeply empathetic, gentle, and softly encouraging.",
  romantic: "Be sweet, warm, and a little charming.",
  motivated: "Be hype, energetic, ambitious, and encouraging like a high-performance coach.",
  anxious: "Be soothing, reassuring, validating, and grounding.",
  chill: "Be relaxed, cool, and friendly.",
  relaxed: "Be serene, easygoing, and warm.",
  neutral: "Be clear, concise, and helpful.",
  professional: "Be clear, polite, and lightly friendly.",
};

export const chatWithAI = async (req, res) => {
  try {
    const { message, mood, profile } = req.body;
    const userId = req.userId;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    // The user's selected mood is the primary driver
    const selectedMood = (mood || "relaxed").toLowerCase();

    // ML predicts emotional nuances/tone from user's message
    const mlPrediction = predictMood(message);

    // Save user message
    await Message.create({ userId, content: message, type: "user" });

    // Strong mood-specific behavioral instructions based on user selected mood
    const moodInstruction = moodPrompts[selectedMood] || "Be calm, supportive, and friendly.";

    // Optional personalization
    let personalization = "";
    if (profile?.hobbies?.length) {
      personalization += `The user likes ${profile.hobbies.join(", ")}. `;
    }
    if (profile?.strengths?.length) {
      personalization += `Their strengths are ${profile.strengths.join(", ")}. `;
    }
    if (profile?.weaknesses?.length) {
      personalization += `Their weaknesses are ${profile.weaknesses.join(", ")}. `;
    }

    // Fetch recent history
    const history = await Message.find({ userId }).sort({ createdAt: -1 }).limit(6);
    const context = history.reverse().map(m => ({
      role: m.type === "user" ? "user" : "assistant",
      content: m.content
    }));

    // Build targeted prompt directly adhering to user's selected mood
    const systemPrompt = `You are Friday, an AI companion. 
The user is currently feeling: "${selectedMood.toUpperCase()}".
Your primary goal is to respond specifically to match and support their "${selectedMood}" mood.
Tone Guidelines: ${moodInstruction}
Style:
- Reply in 1-2 natural, human-like sentences.
- If the user is SAD: Comfort them gently and empathetically.
- If the user is ANGRY: Validate their frustration with cool-headed calmness.
- If the user is MOTIVATED: Be energetic and high-performing.
- If the user is HAPPY: Be cheerful and celebrate with them.
- If the user is CALM / RELAXED: Be soothing and unhurried.
${personalization}`;

    // Call Llama via RapidAPI
    const response = await fetch('https://open-ai21.p.rapidapi.com/conversationllama', {
      method: "POST",
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        'x-rapidapi-host': process.env.RAPIDAPI_HOST,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: systemPrompt
          },
          ...context,
          { role: "user", content: message }
        ],
        web_access: false
      })
    });

    const data = await response.json();
    
    // Extract reply from 'result' field for this specific API
    const reply = data.result || "I'm right here with you. What would you like to talk about?";

    // Save AI reply
    await Message.create({ userId, content: reply, type: "ai" });

    res.json({ 
      reply,
      activeMood: selectedMood,
      detectedMood: mlPrediction.predictedMood,
      confidence: mlPrediction.confidence
    });
  } catch (err) {
    console.error("Llama AI error:", err);
    res.status(500).json({ message: "AI response system offline" });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const messages = await Message.find({ userId: req.userId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch history" });
  }
};

export const clearChatHistory = async (req, res) => {
  try {
    await Message.deleteMany({ userId: req.userId });
    res.json({ message: "History cleared successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to clear history" });
  }
};
