import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import MoodPrompt from "./MoodPrompt";
import { useNavigate } from "react-router-dom";
import { User, Send, Mic, MicOff, Volume2, VolumeX, ChevronDown } from "lucide-react";
import logo from "../assets/white-logo.png";

const CursorFollower = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div 
      className="cursor-follower" 
      style={{ 
        transform: `translate(${position.x}px, ${position.y}px)`,
      }} 
    />
  );
};

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [todayMood, setTodayMood] = useState(null);
  const [listening, setListening] = useState(false);
  const [voiceReply, setVoiceReply] = useState(true);
  const voiceReplyRef = useRef(true);
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
  }, [messages.length, isTyping]);

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
      // Use current input value at end of speech
      if (inputRef.current.trim()) handleSend(inputRef.current);
    };
    // Bind only once
    // eslint-disable-next-line
  }, []);

  // Sync ref for callback stability
  const inputRef = useRef(input);
  useEffect(() => {
    inputRef.current = input;
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
    if (!voiceReplyRef.current) return;
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
    <div className="chat-page-root">
      <CursorFollower />
      {/* 3D Animated Background Blobs */}
      <div className="chat-bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
        <div className="blob blob-4"></div>
        <div className="blob blob-5"></div>
        <div className="blob blob-6"></div>
      </div>

      <div className="chat-immersive-container">
        {/* Grand Header */}
        <header className="chat-header-grand">
          <div 
            onClick={() => {
              sessionStorage.removeItem("todayMood");
              window.location.reload();
            }} 
            style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}
          >
            <img src={logo} alt="Logo" style={{ width: "32px", height: "32px", objectFit: "contain" }} />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "700", margin: 0, color: "white" }}>As You Wish</h2>
              <p style={{ margin: 0, opacity: 0.7, fontSize: "10px", color: "white" }}>Mood: {todayMood}</p>
            </div>
          </div>

          <div className="chat-header-actions" style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="voice-select"
              >
                {voices.map((v) => (
                  <option key={v.name} value={v.name} style={{ background: "#0f172a", color: "white" }}>
                    {v.name.length > 25 ? v.name.substring(0, 25) + '...' : v.name}
                  </option>
                ))}
              </select>
              <ChevronDown 
                size={14} 
                style={{ position: "absolute", right: "12px", pointerEvents: "none", opacity: 0.6 }} 
              />
            </div>

            <button
              onClick={() => {
                const newValue = !voiceReply;
                setVoiceReply(newValue);
                voiceReplyRef.current = newValue;
                if (!newValue) synth.cancel();
              }}
              className="voice-toggle-btn"
              title={voiceReply ? "AI Voice On" : "AI Voice Off"}
              style={{ background: voiceReply ? "rgba(52, 168, 83, 0.2)" : "rgba(255,255,255,0.05)", color: voiceReply ? "var(--primary)" : "white", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", width: "42px", height: "42px", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              {voiceReply ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>

            <button
              onClick={() => navigate("/profile")}
              className="btn-secondary"
              title="View Profile"
              style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}
            >
              <User size={18} />
              Profile
            </button>

            <button
              onClick={handleLogout}
              className="btn-secondary"
              style={{ background: "rgba(234, 67, 53, 0.2)", border: "1px solid rgba(234, 67, 53, 0.3)", color: "#ff8080" }}
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* 3D Chat History */}
        <div className="chat-history-grand" ref={chatEndRef}>
          {messages.map((m, i) => (
            <div 
              key={i} 
              className={`message-card-3d ${m.type === "user" ? "user-message-3d" : "ai-message-3d"}`}
            >
              <div className="message-content-glass">
                {m.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="message-card-3d ai-message-3d">
              <div className="message-content-glass" style={{ opacity: 0.6 }}>
                Thinking...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Grand Input Area */}
        <div className="chat-input-grand-wrapper">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
            className="chat-input-grand"
          >
            <button 
              type="button"
              className={`grand-voice-btn ${listening ? "active" : ""}`}
              onClick={toggleMic}
              style={{ background: listening ? "rgba(234, 67, 53, 0.4)" : "rgba(255,255,255,0.05)", border: "none", width: "42px", height: "42px", borderRadius: "50%", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              {listening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={listening ? "Listening to you..." : "Type your message..."}
              disabled={isTyping}
            />
            <button 
              type="submit" 
              className="grand-send-btn"
              disabled={!input.trim() || isTyping}
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
