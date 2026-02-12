import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import MoodPrompt from "./MoodPrompt";
import { useNavigate } from "react-router-dom";

// ✅ Change this path ONLY if needed
import chatBg from "../assets/chat-logo.png";

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
  const recognitionRef = useRef(null);

  const profile = JSON.parse(localStorage.getItem("userProfile") || "{}");
  const synth = window.speechSynthesis;

  // Protect route
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");
  }, [navigate]);

  // Setup speech recognition once
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
    }
  }, []);

  // Load voices
  useEffect(() => {
    const loadVoices = () => {
      const v = synth.getVoices();
      setVoices(v);
      if (v.length > 0 && !selectedVoice) setSelectedVoice(v[0].name);
    };
    loadVoices();
    synth.onvoiceschanged = loadVoices;
  }, [synth, selectedVoice]);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Mic events
  useEffect(() => {
    if (!recognitionRef.current) return;

    recognitionRef.current.onresult = (e) => {
      let transcript = "";
      for (let i = 0; i < e.results.length; i++) {
        transcript += e.results[i][0].transcript;
      }
      setInput(transcript);
    };

    recognitionRef.current.onend = () => {
      setListening(false);
      if (input.trim()) handleSend(input);
    };
    // eslint-disable-next-line
  }, [input]);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition not supported");
      return;
    }

    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      setInput("");
      recognitionRef.current.start();
      setListening(true);
    }
  };

  const speakText = (text) => {
    if (!voiceReply) return;
    synth.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    const voice = voices.find((v) => v.name === selectedVoice);
    if (voice) utter.voice = voice;
    synth.speak(utter);
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
        profile,
      });

      const aiText = res.data.reply;
      setIsTyping(false);
      setMessages((prev) => [...prev, { type: "ai", text: aiText }]);
      speakText(aiText);
    } catch {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { type: "ai", text: "Sorry, something went wrong 😅" },
      ]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userProfile");
    navigate("/");
  };

  if (!todayMood) return <MoodPrompt onMoodSelect={setTodayMood} />;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${chatBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
        color: "white",
      }}
    >
      {/* Top Right Controls */}
      <div
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          display: "flex",
          gap: 10,
          zIndex: 10,
          alignItems: "center",
        }}
      >
        <select
          value={selectedVoice}
          onChange={(e) => setSelectedVoice(e.target.value)}
          style={{
            padding: "6px 10px",
            borderRadius: "999px",
            border: "1px solid rgba(255,255,255,0.3)",
            background: "rgba(0,0,0,0.6)",
            color: "white",
          }}
        >
          {voices.map((v, i) => (
            <option key={i} value={v.name} style={{ color: "black" }}>
              {v.name}
            </option>
          ))}
        </select>

        <button
          onClick={() => setVoiceReply(!voiceReply)}
          style={{
            padding: "6px 14px",
            borderRadius: "999px",
            background: voiceReply ? "#6366f1" : "rgba(0,0,0,0.6)",
            color: "white",
            border: "1px solid rgba(255,255,255,0.3)",
          }}
          title="Toggle AI voice"
        >
          🔊
        </button>

        <button
          onClick={handleLogout}
          style={{
            padding: "6px 14px",
            borderRadius: "999px",
            background: "rgba(239,68,68,0.9)",
            color: "white",
            border: "none",
            fontWeight: 600,
          }}
        >
          Sign Out
        </button>
      </div>

      {/* Title */}
      <div style={{ textAlign: "center", paddingTop: 40 }}>
        <h1 style={{ fontSize: 42, fontWeight: 900 }}>As You Wish</h1>
        <p style={{ opacity: 0.85 }}>Mood: {todayMood}</p>
      </div>

      {/* Messages Area */}
      <div
        style={{
          maxWidth: 900,
          margin: "40px auto 120px",
          padding: "0 20px",
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              marginBottom: 14,
              display: "flex",
              justifyContent: m.type === "user" ? "flex-end" : "flex-start",
              animation: "popIn 0.25s ease",
            }}
          >
            <div
              style={{
                maxWidth: "70%",
                padding: "10px 14px",
                borderRadius: 16,
                background:
                  m.type === "user"
                    ? "linear-gradient(135deg, #6366f1, #22d3ee)"
                    : "rgba(0,0,0,0.6)",
                color: m.type === "user" ? "#020617" : "white",
                backdropFilter: "blur(10px)",
                boxShadow:
                  m.type === "user"
                    ? "0 0 20px rgba(99,102,241,0.6)"
                    : "0 0 20px rgba(34,211,238,0.4)",
              }}
            >
              {m.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div style={{ opacity: 0.7, fontStyle: "italic" }}>
            AI is typing...
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Bar */}
      <div
        style={{
          position: "fixed",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          width: "90%",
          maxWidth: 900,
          display: "flex",
          gap: 10,
          background: "rgba(0,0,0,0.6)",
          padding: 10,
          borderRadius: 999,
          backdropFilter: "blur(10px)",
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={listening ? "Listening..." : "Type your message..."}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: 999,
            border: "none",
            outline: "none",
          }}
        />

        <button
          onClick={toggleMic}
          style={{
            padding: "0 16px",
            borderRadius: 999,
            background: listening ? "#ef4444" : "#6366f1",
            color: "white",
            border: "none",
          }}
          title="Use microphone"
        >
          🎤
        </button>

        <button
          onClick={() => handleSend()}
          disabled={!input.trim()}
          style={{
            padding: "0 20px",
            borderRadius: 999,
            background: "#22d3ee",
            color: "#020617",
            border: "none",
            fontWeight: 600,
          }}
        >
          Send
        </button>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes popIn {
          from {
            transform: scale(0.95) translateY(6px);
            opacity: 0;
          }
          to {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Chat;
