import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const Chat = ({ profile, todayMood }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [voiceMode, setVoiceMode] = useState(false);
  const chatEndRef = useRef(null);

  const recognition =
    window.SpeechRecognition || window.webkitSpeechRecognition
      ? new (window.SpeechRecognition || window.webkitSpeechRecognition)()
      : null;

  const synth = window.speechSynthesis;

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Voice input
  useEffect(() => {
    if (!recognition) return;

    if (voiceMode) {
      recognition.onresult = (e) => {
        const text = e.results[0][0].transcript;
        handleSend(text);
      };
      recognition.start();
    }

    return () => recognition?.stop();
  }, [voiceMode]);

  const handleSend = async (text = input) => {
    if (!text.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { type: "user", text }]);
    setInput("");

    try {
      const res = await axios.post("/api/chat", {
        message: text,
        mood: todayMood,
        profile: profile,
      });

      const aiText = res.data.reply;

      setMessages((prev) => [...prev, { type: "ai", text: aiText }]);

      // Speak AI reply if voice mode is on
      if (voiceMode) {
        const utter = new SpeechSynthesisUtterance(aiText);
        utter.rate = todayMood === "relaxed" ? 0.85 : 1.1;
        synth.speak(utter);
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        { type: "ai", text: "Sorry, I had trouble responding. 😅" },
      ]);
    }
  };

  return (
    <div className="chat-container">
      {/* Header */}
      <div className="chat-header">
        <div>
          <h2>Your AI Friend</h2>
          <p>Mood today: {todayMood}</p>
        </div>

        <button
          className={`voice-btn ${voiceMode ? "active" : ""}`}
          onClick={() => setVoiceMode(!voiceMode)}
        >
          🎙 {voiceMode ? "Voice ON" : "Voice OFF"}
        </button>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`chat-message ${msg.type === "user" ? "user" : "ai"}`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type or speak..."
        />
        <button onClick={() => handleSend()}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
