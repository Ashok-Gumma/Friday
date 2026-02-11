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
  const [voiceReply, setVoiceReply] = useState(true);
  const [isTyping, setIsTyping] = useState(false);

  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState("");

  const chatEndRef = useRef(null);

  const profile = JSON.parse(localStorage.getItem("userProfile") || "{}");

  // Speech recognition
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  const synth = window.speechSynthesis;

  // Protect route
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");
  }, [navigate]);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const v = synth.getVoices();
      setVoices(v);
      if (v.length > 0 && !selectedVoice) {
        setSelectedVoice(v[0].name);
      }
    };

    loadVoices();
    synth.onvoiceschanged = loadVoices;
  }, [synth, selectedVoice]);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Setup speech recognition
  useEffect(() => {
    if (!recognition) return;

    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (e) => {
      let transcript = "";
      for (let i = 0; i < e.results.length; i++) {
        transcript += e.results[i][0].transcript;
      }
      setInput(transcript);
    };

    recognition.onend = () => {
      setListening(false);
      if (input.trim()) {
        handleSend(input);
      }
    };
    // eslint-disable-next-line
  }, [input]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userProfile");
    navigate("/");
  };

  const toggleMic = () => {
    if (!recognition) {
      alert("Speech recognition not supported in this browser");
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

    const voice = voices.find((v) => v.name === selectedVoice);
    if (voice) utter.voice = voice;

    utter.rate = todayMood === "relaxed" ? 0.9 : 1.05;
    utter.pitch = 1;

    setTimeout(() => {
      synth.speak(utter);
    }, 100);
  };

  const handleSend = async (text = input) => {
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { type: "user", text }]);
    setInput("");
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

      // Speak AI reply
      speakText(aiText);
    } catch (err) {
      console.error("Chat error:", err);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { type: "ai", text: "Sorry, I had trouble responding. 😅" },
      ]);
    }
  };

  // Ask for mood first
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
            <p>Mood today: {todayMood}</p>
          </div>

          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {/* Voice selector */}
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              style={{
                padding: "6px 10px",
                borderRadius: "999px",
                border: "1px solid var(--border)",
                fontSize: "12px",
                background: "var(--card)",
                color: "var(--text)",
              }}
              title="Select AI voice"
            >
              {voices.map((v, i) => (
                <option key={i} value={v.name}>
                  {v.name}
                </option>
              ))}
            </select>

            {/* Voice toggle */}
            <button
              className={`voice-btn ${voiceReply ? "active" : ""}`}
              onClick={() => setVoiceReply(!voiceReply)}
              title="Toggle AI voice reply"
            >
              🔊 {voiceReply ? "ON" : "OFF"}
            </button>

            <button className="logout-btn" onClick={handleLogout}>
              Sign Out
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="chat-messages">
          {messages.length === 0 && !isTyping && (
            <div className="chat-empty">
              👋 Type or use the mic to start talking!
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`chat-message ${msg.type}`}>
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
            placeholder={listening ? "Listening..." : "Type your message or use mic..."}
          />

          <button
            onClick={toggleMic}
            title="Use microphone"
            className={`mic-btn ${listening ? "listening" : ""}`}
          >
            {listening ? "🛑" : "🎤"}
          </button>

          <button onClick={() => handleSend()}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
