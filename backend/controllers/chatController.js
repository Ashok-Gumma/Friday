import Message from "../models/Message.js";

// Mood → instruction mapping
const moodPrompts = {
  happy: "Be cheerful, upbeat, and playful.",
  calm: "Be calm, reassuring, and gently supportive.",
  angry: "Be firm but cool-headed, slightly witty, never rude.",
  sad: "Be kind, empathetic, and softly encouraging.",
  romantic: "Be sweet, warm, and a little charming.",
  motivational: "Be hype, energetic, and encouraging like a coach.",
  chill: "Be relaxed, cool, and friendly.",
  professional: "Be clear, polite, and lightly friendly.",
};

export const chatWithAI = async (req, res) => {
  try {
    const { message, mood, profile } = req.body;
    const userId = req.userId;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    // Save user message
    await Message.create({ userId, content: message, type: "user" });

    const moodInstruction = moodPrompts[mood] || "Be friendly and helpful.";

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
            content: `Instruction: You are a funny, cool AI chat buddy.
${moodInstruction}
Reply like a real human texting a friend. 
Keep replies short (1–2 sentences max). 
No long explanations. No essays. 
Be witty, a little playful, and supportive. 
Use simple words. Sound natural, not robotic.
${personalization}`
          },
          ...context,
          { role: "user", content: message }
        ],
        web_access: false
      })
    });

    const data = await response.json();
    
    // Extract reply from 'result' field for this specific API
    const reply = data.result || "Neural link saturation reached. Try again.";

    // Save AI reply
    await Message.create({ userId, content: reply, type: "ai" });

    res.json({ reply });
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
