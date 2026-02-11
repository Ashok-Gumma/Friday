import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import MoodPrompt from "./MoodPrompt";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [todayMood, setTodayMood] = useState(null);
  const [listening, setListening] = useState(false);
  const [voiceReply, setVoiceReply] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const chatEndRef = useRef(null);
  const profile = JSON.parse(localStorage.getItem("userProfile") || "{}");

  // Protect route
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");
  }, [navigate]);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Speech recognition
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;
  const synth = window.speechSynthesis;

  useEffect(() => {
    if (!recognition) return;

    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.onend = () => {
      setListening(false);
    };
  }, [recognition]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userProfile");
    navigate("/");
  };

  const toggleMic = () => {
    if (!recognition) {
      alert("Speech recognition not supported");
      return;
    }

    if (listening) {
      recognition.stop();
      setListening(false);
    } else {
      setInput("");
      recognition.start();
      setListening(true);
    }
  };

  const speakText = (text) => {
    if (!voiceReply) return;
    synth.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    synth.speak(utter);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const text = input;
    setInput("");
    setMessages((prev) => [...prev, { type: "user", text }]);
    setIsTyping(true);

    try {
      const res = await axios.post("/api/chat", {
        message: text,
        mood: todayMood,
        profile: profile,
      });

      const aiText = res.data.reply;

      setIsTyping(false);
      setMessages((prev) => [...prev, { type: "ai", text: aiText }]);
      speakText(aiText);
    } catch (err) {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { type: "ai", text: "Sorry, something went wrong 😅" },
      ]);
    }
  };

  if (!todayMood) {
    return <MoodPrompt onMoodSelect={setTodayMood} />;
  }

  return (
    <div className="chat-wrapper">
      <div className="chat-container">
        {/* Header */}
        <div className="chat-header">
          <div>
            <h2>Your AI Friend</h2>
            <p>Mood: {todayMood}</p>
          </div>

          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button
              className={`voice-btn ${voiceReply ? "active" : ""}`}
              onClick={() => setVoiceReply(!voiceReply)}
              title="Toggle voice"
            >
              🔊
            </button>

            <button className="logout-btn" onClick={handleLogout}>
              Sign Out
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="chat-messages">
          {messages.length === 0 && !isTyping && (
            <div className="chat-empty">👋 Start chatting!</div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`chat-message ${msg.type === "user" ? "user" : "ai"}`}
            >
              {msg.text}
            </div>
          ))}

          {isTyping && (
            <div className="chat-message ai typing-indicator">
              AI is typing<span className="dots">...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="chat-input">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={listening ? "Listening..." : "Type your message..."}
          />

          <button
            onClick={toggleMic}
            className={`mic-btn ${listening ? "listening" : ""}`}
            title="Mic"
          >
            {listening ? "🛑" : "🎤"}
          </button>

          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Chat;