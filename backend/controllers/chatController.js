import OpenAI from "openai";

// Create client using API key from .env
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const moodInstruction = moodPrompts[mood] || "Be friendly and helpful.";

    // Optional personalization using profile
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

    // Call OpenAI
    const response = await client.responses.create({
      model: "gpt-5-nano", // or "gpt-4o-mini"
      input: [
        {
          role: "system",
          content: `You are a funny, cool AI chat buddy.
${moodInstruction}
Reply like a real human texting a friend.
Keep replies short (1–2 sentences max).
No long explanations. No essays.
Be witty, a little playful, and supportive.
You can use light humor or a small joke if it fits.
Use simple words. Sound natural, not robotic.
${personalization}`,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply = response.output_text;

    res.json({ reply });
  } catch (err) {
    console.error("AI error:", err);
    res.status(500).json({ message: "AI failed to respond" });
  }
};
