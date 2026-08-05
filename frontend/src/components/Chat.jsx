import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Send, Mic, Volume2, 
  VolumeX, ChevronDown, LogOut, Settings, 
  Sparkles, MessageSquare, Shield, Smile,
  Copy, Check, PanelLeftClose, PanelLeftOpen, Trash2, Heart
} from "lucide-react";
import MoodPrompt from "./MoodPrompt";
import FridayLogo from "./FridayLogo.jsx";

const quickPrompts = [
  "Help me plan a productive morning routine.",
  "Give me a 2-minute motivational boost.",
  "What are some smart tips to improve daily focus?",
  "Help me write a concise follow-up email for my team."
];

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [todayMood, setTodayMoodState] = useState(() => {
    return localStorage.getItem("userMood") || "relaxed";
  });
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [voiceReply, setVoiceReply] = useState(true);
  const voiceReplyRef = useRef(true);
  const [isTyping, setIsTyping] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(() => {
    return localStorage.getItem("userVoice") || "";
  });

  const scrollRef = useRef(null);
  const recognitionRef = useRef(null);
  const synth = typeof window !== "undefined" ? window.speechSynthesis : null;

  const profile = JSON.parse(localStorage.getItem("userProfile") || "{}");

  const handleSetMood = (newMood) => {
    setTodayMoodState(newMood);
    localStorage.setItem("userMood", newMood);
    setShowMoodModal(false);
  };

  // Setup speech recognition
  useEffect(() => {
    if (typeof window === "undefined") return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onstart = () => {
        setListening(true);
      };

      recognitionRef.current.onresult = (e) => {
        let transcript = "";
        for (let i = 0; i < e.results.length; i++) {
          transcript += e.results[i][0].transcript;
        }
        setInput(transcript);
      };

      recognitionRef.current.onend = () => {
        setListening(false);
      };

      recognitionRef.current.onerror = () => {
        setListening(false);
      };
    }
  }, []);

  // Load voices and restore saved preference
  useEffect(() => {
    if (!synth) return;
    const loadVoices = () => {
      const v = synth.getVoices();
      setVoices(v);
      if (v.length > 0) {
        const saved = localStorage.getItem("userVoice");
        const found = v.find((voice) => voice.name === saved);
        if (found) {
          setSelectedVoice(found.name);
        } else if (!selectedVoice) {
          setSelectedVoice(v[0].name);
        }
      }
    };
    loadVoices();
    synth.onvoiceschanged = loadVoices;
  }, [synth, selectedVoice]);

  // Auto scroll
  useLayoutEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const toggleMic = () => {
    if (!recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
    } else {
      try {
        setInput("");
        recognitionRef.current.start();
      } catch (err) {
        console.error("Failed to start speech recognition:", err);
      }
    }
  };

  // Load chat history
  useEffect(() => {
    if (todayMood) {
      const fetchHistory = async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await axios.get("/api/chat/history", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setMessages(res.data.map(m => ({ 
            type: m.type, 
            text: m.content,
            time: new Date(m.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          })));
        } catch (err) {
          console.error("Failed to load history:", err);
        }
      };
      fetchHistory();
    }
  }, [todayMood]);

  const [isSpeaking, setIsSpeaking] = useState(false);

  const stopAudio = () => {
    if (synth) {
      synth.cancel();
      setIsSpeaking(false);
    }
  };

  const handleVoiceChange = (newVoiceName) => {
    setSelectedVoice(newVoiceName);
    localStorage.setItem("userVoice", newVoiceName);

    if (synth && voiceReplyRef.current) {
      synth.cancel();
      const sampleText = "Voice model updated.";
      const utter = new SpeechSynthesisUtterance(sampleText);
      const matchedVoice = voices.find((v) => v.name === newVoiceName);
      if (matchedVoice) utter.voice = matchedVoice;

      utter.onstart = () => setIsSpeaking(true);
      utter.onend = () => setIsSpeaking(false);
      utter.onerror = () => setIsSpeaking(false);

      synth.speak(utter);
    }
  };

  const speakText = (text) => {
    if (!voiceReplyRef.current || !synth) return;
    synth.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    const voice = voices.find((v) => v.name === selectedVoice);
    if (voice) utter.voice = voice;
    
    utter.onstart = () => setIsSpeaking(true);
    utter.onend = () => setIsSpeaking(false);
    utter.onerror = () => setIsSpeaking(false);

    synth.speak(utter);
  };

  const handleClearHistory = async () => {
    if (!window.confirm("Are you sure you want to clear your chat history?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete("/api/chat/clear", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages([]);
    } catch (err) {
      console.error("Failed to clear history:", err);
    }
  };

  const handleSendText = async (textToSend) => {
    if (!textToSend.trim() || isTyping) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = textToSend.trim();
    setMessages((prev) => [...prev, { type: "user", text: userMsg, time: timestamp }]);
    setInput("");
    setIsTyping(true);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("/api/chat", {
        message: userMsg,
        mood: todayMood,
        profile,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const aiText = res.data.reply;
      const aiTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setIsTyping(false);
      setMessages((prev) => [...prev, { type: "ai", text: aiText, time: aiTime }]);
      speakText(aiText);
    } catch {
      setIsTyping(false);
      setMessages((prev) => [...prev, { 
        type: "ai", 
        text: "I couldn't reach the server just now. Please try again in a moment!",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }
  };

  const handleFormSubmit = (e) => {
    if (e) e.preventDefault();
    handleSendText(input);
  };

  const handleCopyMessage = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userProfile");
    navigate("/");
  };

  return (
    <div style={{ 
      height: "100vh", display: "flex", background: "#faf9f5", 
      color: "#0f172a", overflow: "hidden", position: "relative",
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Background Ambient Glow */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        background: "radial-gradient(circle at 70% 20%, rgba(225, 29, 72, 0.08) 0%, transparent 60%)"
      }} />

      {/* Retractable Light Glass Sidebar Matching Chat Page */}
      <motion.aside 
        initial={false}
        animate={{ width: showSidebar ? "300px" : "0px", opacity: showSidebar ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        style={{ 
          background: "#ffffff", 
          borderRight: "1px solid rgba(234, 179, 8, 0.22)",
          display: "flex", flexDirection: "column", overflow: "hidden", 
          flexShrink: 0, position: "relative", zIndex: 100,
          boxShadow: "4px 0 25px rgba(0, 0, 0, 0.03)"
        }}
      >
        <div style={{ padding: "24px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div onClick={() => navigate("/chat")} style={{ cursor: "pointer" }}>
            <FridayLogo size="1.3rem" color="#0f172a" />
          </div>
          <button
            onClick={() => setShowSidebar(false)}
            style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", transition: "color 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#0f172a"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#64748b"; }}
          >
            <PanelLeftClose size={18} />
          </button>
        </div>

        <div style={{ flex: 1, padding: "0 20px 24px", display: "flex", flexDirection: "column", gap: "24px", overflowY: "auto" }}>
          {/* User Profile Card */}
          <div>
            <label style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 800, display: "block", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>
              Your Account
            </label>
            <div style={{ 
              padding: "14px 16px", borderRadius: "18px",
              background: "#faf9f5", border: "1px solid rgba(234, 179, 8, 0.25)",
              display: "flex", alignItems: "center", gap: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.02)"
            }}>
              <div style={{ 
                width: "42px", height: "42px", borderRadius: "50%", 
                background: "linear-gradient(135deg, #facc15 0%, #f59e0b 100%)", color: "#0e0a05",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 14px rgba(250, 204, 21, 0.4)", flexShrink: 0
              }}>
                <User size={19} />
              </div>
              <div style={{ overflow: "hidden", textAlign: "left" }}>
                <p style={{ fontSize: "0.92rem", fontWeight: 900, color: "#0f172a", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
                  {profile.name || "User"}
                </p>
                <p style={{ fontSize: "0.78rem", color: "#d97706", fontWeight: 800, textTransform: "capitalize" }}>
                  {todayMood} Tone Active
                </p>
              </div>
            </div>
          </div>

          {/* Voice Selector */}
          <div>
            <label style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 800, display: "block", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>
              Voice Assistant Sound
            </label>
            <div style={{ position: "relative" }}>
              <select
                value={selectedVoice}
                onChange={(e) => handleVoiceChange(e.target.value)}
                style={{ 
                  width: "100%", padding: "10px 32px 10px 14px", borderRadius: "14px", 
                  background: "#faf9f5", border: "1px solid rgba(0,0,0,0.12)",
                  color: "#0f172a", outline: "none", fontSize: "0.85rem", appearance: "none",
                  fontWeight: 600, cursor: "pointer"
                }}
              >
                {voices.map((v) => (
                  <option key={v.name} value={v.name} style={{ background: "#ffffff", color: "#0f172a" }}>
                    {v.name.substring(0, 26)}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#64748b" }} />
            </div>
          </div>

          {/* Audio Response Toggle */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 0" }}>
            <span style={{ fontSize: "0.88rem", color: "#0f172a", fontWeight: 700 }}>Audio Responses</span>
            <button 
              onClick={() => {
                const newValue = !voiceReply;
                setVoiceReply(newValue);
                voiceReplyRef.current = newValue;
                if (!newValue && synth) synth.cancel();
              }}
              style={{ 
                width: "46px", height: "24px", borderRadius: "999px", 
                background: voiceReply ? "linear-gradient(135deg, #facc15 0%, #f59e0b 100%)" : "#e2e8f0",
                border: "1px solid " + (voiceReply ? "#d97706" : "rgba(0,0,0,0.1)"),
                position: "relative", transition: "all 0.25s ease",
                cursor: "pointer", boxShadow: voiceReply ? "0 2px 8px rgba(250,204,21,0.4)" : "none"
              }}
            >
              <motion.div 
                animate={{ x: voiceReply ? 24 : 2 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                style={{ 
                  width: "18px", height: "18px", borderRadius: "50%", 
                  background: "#ffffff", 
                  position: "absolute", top: "2px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                }} 
              />
            </button>
          </div>
        </div>

        {/* Sidebar Footer Actions */}
        <div style={{ padding: "20px", borderTop: "1px solid rgba(234, 179, 8, 0.2)", display: "flex", flexDirection: "column", gap: "10px" }}>
          <button 
            onClick={handleClearHistory}
            style={{ 
              width: "100%", padding: "12px", borderRadius: "14px", display: "flex", alignItems: "center", gap: "10px", 
              color: "#dc2626", background: "#fef2f2", border: "1px solid rgba(239, 68, 68, 0.2)",
              transition: "all 0.2s", cursor: "pointer", fontSize: "0.85rem", fontWeight: 700
            }}
          >
            <Trash2 size={16} /> Clear Chat History
          </button>

          <button 
            onClick={() => navigate("/profile")}
            style={{ 
              width: "100%", padding: "12px", borderRadius: "14px", display: "flex", alignItems: "center", gap: "10px", 
              color: "#0f172a", background: "#faf9f5", border: "1px solid rgba(0,0,0,0.08)",
              transition: "all 0.2s", cursor: "pointer", fontSize: "0.85rem", fontWeight: 700
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#f1efe7"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#faf9f5"; }}
          >
            <Settings size={16} /> Profile & Settings
          </button>

          <button 
            onClick={handleLogout}
            style={{ 
              width: "100%", padding: "12px", borderRadius: "14px", display: "flex", alignItems: "center", gap: "10px", 
              color: "#ffffff", background: "#0f172a", border: "none",
              transition: "all 0.2s", cursor: "pointer", fontSize: "0.85rem", fontWeight: 800,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            }}
          >
            <LogOut size={16} color="#facc15" /> Sign Out
          </button>
        </div>
      </motion.aside>

      {/* Main Chat Area */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", zIndex: 10 }}>
        
        {/* Top Header */}
        <header style={{ 
          padding: "18px 28px", display: "flex", justifyContent: "space-between", alignItems: "center",
          borderBottom: "1px solid rgba(234,179,8,0.2)",
          background: "rgba(255, 255, 255, 0.85)", backdropFilter: "blur(20px)",
          zIndex: 20 
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {!showSidebar && (
              <button 
                onClick={() => setShowSidebar(true)}
                style={{ 
                  background: "#f1efe7", border: "1px solid rgba(0,0,0,0.08)",
                  width: "36px", height: "36px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#0f172a", cursor: "pointer", transition: "all 0.2s"
                }}
              >
                <PanelLeftOpen size={18} />
              </button>
            )}
            <div style={{ textAlign: "left" }}>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 900, letterSpacing: "-0.3px", display: "flex", alignItems: "center", gap: "8px", color: "#0f172a" }}>
                Friday AI <span style={{ fontSize: "0.72rem", color: "#78350f", padding: "2px 10px", borderRadius: "999px", background: "#fef08a", border: "1px solid rgba(234,179,8,0.4)", fontWeight: 800 }}>ONLINE</span>
              </h3>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "2px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <span style={{ 
                    width: "6px", height: "6px", borderRadius: "50%", 
                    background: listening ? "#d97706" : "#10b981", 
                    boxShadow: listening ? "0 0 10px #facc15" : "0 0 8px #10b981",
                  }} />
                  <span style={{ 
                    fontSize: "0.75rem", 
                    color: listening ? "#d97706" : "#64748b", 
                    fontWeight: 700
                  }}>
                    {listening ? "Listening to you..." : "Ready to help"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {isSpeaking && (
              <motion.button
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                onClick={stopAudio}
                style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  padding: "7px 16px", borderRadius: "999px",
                  background: "#dc2626", color: "#ffffff",
                  fontSize: "0.82rem", fontWeight: 800, border: "none",
                  cursor: "pointer", boxShadow: "0 0 16px rgba(220, 38, 38, 0.4)"
                }}
              >
                <VolumeX size={15} />
                <span>Stop Audio</span>
              </motion.button>
            )}

            {/* Tone Switcher Pill in Top Right Header */}
            <button
              onClick={() => setShowMoodModal(true)}
              style={{
                display: "flex", alignItems: "center", gap: "8px",
                padding: "7px 16px", borderRadius: "999px",
                background: "#faf9f5", border: "1px solid rgba(234, 179, 8, 0.35)",
                color: "#0f172a", fontSize: "0.82rem", fontWeight: 800,
                cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#fef08a"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#faf9f5"; }}
            >
              <Sparkles size={14} color="#d97706" />
              <span>Tone: <strong style={{ color: "#d97706", textTransform: "capitalize" }}>{todayMood}</strong></span>
              <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 600 }}>(Change)</span>
            </button>
          </div>
        </header>

        {/* Messages Scroll Area with WhatsApp-Style Friday AI Doodle Background */}
        <div 
          ref={scrollRef}
          style={{ 
            flex: 1, padding: "24px clamp(16px, 4vw, 100px) 140px", 
            overflowY: "auto", display: "flex", flexDirection: "column", gap: "18px",
            position: "relative",
            backgroundColor: "#f5f2e9",
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d97706' fill-opacity='0.07' fill-rule='evenodd'%3E%3Cpath d='M15 15h10v10H15zM45 15l5 10h-10zM80 15a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM15 50a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM50 50h12v6H50zM85 50l6 12h-12zM15 85h14v4H15zM50 85a6 6 0 1 0 0 12 6 6 0 0 0 0-12zM85 85h8v8h-8z'/%3E%3Cpath d='M20 20l4-4m-4 4l-4-4m24 4l4 4m-4-4l-4 4m60 0l-4-4m4 4l4-4M30 60a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm35 0a4 4 0 1 1-8 0 4 4 0 0 1 8 0zm35 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0z'/%3E%3Ctext x='15' y='110' font-family='sans-serif' font-size='7' font-weight='bold' fill='%23d97706' fill-opacity='0.08'%3EFRIDAY AI%3C/text%3E%3Ctext x='70' y='35' font-family='sans-serif' font-size='6' font-weight='bold' fill='%23d97706' fill-opacity='0.08'%3ESYNAPSE%3C/text%3E%3Ctext x='75' y='110' font-family='sans-serif' font-size='6' font-weight='bold' fill='%23d97706' fill-opacity='0.08'%3EVOICE%3C/text%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "180px 180px"
          }}
        >
          {messages.length === 0 && (
            <div style={{ margin: "auto", textAlign: "center", maxWidth: "540px", padding: "40px 20px" }}>
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                <div style={{ 
                  width: "72px", height: "72px", borderRadius: "24px",
                  background: "#fef08a",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: "1px solid rgba(234, 179, 8, 0.4)", margin: "0 auto 20px",
                  boxShadow: "0 10px 25px rgba(250,204,21,0.3)"
                }}>
                  <Sparkles size={32} color="#78350f" />
                </div>
              </motion.div>

              <h3 style={{ fontSize: "1.4rem", fontWeight: 900, marginBottom: "8px", color: "#0f172a" }}>How can Friday help you today?</h3>
              <p style={{ fontSize: "0.9rem", color: "#64748b", marginBottom: "28px", fontWeight: 500 }}>
                Select a quick prompt to start or type your question below.
              </p>

              {/* Starter Prompt Chips */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "12px", width: "100%" }}>
                {quickPrompts.map((prompt, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.02, backgroundColor: "#fef08a", borderColor: "#facc15" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSendText(prompt)}
                    style={{
                      padding: "14px 18px", borderRadius: "16px",
                      background: "#ffffff", border: "1px solid rgba(0,0,0,0.08)",
                      color: "#0f172a", fontSize: "0.88rem", fontWeight: 600, textAlign: "left",
                      cursor: "pointer", transition: "all 0.2s ease",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.02)"
                    }}
                  >
                    {prompt}
                  </motion.button>
                ))}
              </div>
            </div>
          )}
          
          <AnimatePresence>
            {messages.map((m, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ 
                  alignSelf: m.type === "user" ? "flex-end" : "flex-start",
                  maxWidth: "80%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: m.type === "user" ? "flex-end" : "flex-start",
                  gap: "6px"
                }}
              >
                <div style={{
                  padding: "16px 22px",
                  borderRadius: m.type === "user" ? "22px 22px 4px 22px" : "22px 22px 22px 4px",
                  background: m.type === "user" 
                    ? "linear-gradient(135deg, #facc15 0%, #f59e0b 100%)" 
                    : "#ffffff",
                  border: m.type === "user" ? "none" : "1px solid rgba(234, 179, 8, 0.25)",
                  color: "#0f172a",
                  fontWeight: m.type === "user" ? 800 : 500,
                  fontSize: "0.95rem",
                  lineHeight: 1.6,
                  boxShadow: m.type === "user" ? "0 6px 20px rgba(250,204,21,0.35)" : "0 6px 20px rgba(0,0,0,0.04)"
                }}>
                  {m.text}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.75rem", color: "#64748b" }}>
                  <span>{m.time}</span>
                  {m.type === "ai" && (
                    <>
                      <button 
                        onClick={() => handleCopyMessage(m.text, i)}
                        style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
                      >
                        {copiedIndex === i ? <Check size={12} color="#d97706" /> : <Copy size={12} />}
                        {copiedIndex === i ? "Copied" : "Copy"}
                      </button>

                      {isSpeaking ? (
                        <button 
                          onClick={stopAudio}
                          style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontWeight: 700 }}
                        >
                          <VolumeX size={13} color="#dc2626" /> Stop Audio
                        </button>
                      ) : (
                        <button 
                          onClick={() => speakText(m.text)}
                          style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
                        >
                          <Volume2 size={13} /> Listen
                        </button>
                      )}
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: "8px", padding: "12px 18px", borderRadius: "18px", background: "#ffffff", border: "1px solid rgba(234, 179, 8, 0.25)" }}
            >
              <div className="wave-animation" style={{ display: "flex", gap: "4px" }}>
                <span /><span /><span /><span />
              </div>
              <span style={{ fontSize: "0.85rem", color: "#d97706", fontWeight: 700 }}>Friday is typing...</span>
            </motion.div>
          )}
        </div>

        {/* Input Bar */}
        <div style={{ 
          position: "absolute", bottom: 0, left: 0, right: 0, 
          padding: "20px clamp(16px, 5vw, 120px)", 
          background: "linear-gradient(to top, #faf9f5 80%, transparent)"
        }}>
          <form 
            onSubmit={handleFormSubmit}
            style={{ 
              display: "flex", alignItems: "center", gap: "10px", 
              background: "#ffffff", 
              border: "1px solid rgba(234, 179, 8, 0.3)",
              borderRadius: "999px", padding: "8px 12px 8px 22px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.06)",
              backdropFilter: "blur(30px)"
            }}
          >
            <input 
              type="text" 
              placeholder="Ask Friday anything..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ 
                flex: 1, background: "none", border: "none", outline: "none", 
                color: "#0f172a", fontSize: "0.95rem", fontWeight: 600
              }}
              disabled={isTyping}
            />

            <button 
              type="button"
              onClick={toggleMic}
              style={{ 
                padding: "10px", borderRadius: "50%", 
                background: listening ? "rgba(250,204,21,0.3)" : "#f1efe7", 
                border: "1px solid " + (listening ? "#eab308" : "rgba(0,0,0,0.08)"),
                color: listening ? "#d97706" : "#64748b", cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              <Mic size={18} />
            </button>

            <button 
              type="submit" 
              disabled={!input.trim() || isTyping}
              className="btn-primary"
              style={{ 
                width: "42px", height: "42px", borderRadius: "50%", padding: 0,
                opacity: !input.trim() || isTyping ? 0.4 : 1
              }}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </main>

      {/* Mood Switcher Modal Overlay */}
      {showMoodModal && (
        <MoodPrompt 
          isModal={true} 
          onClose={() => setShowMoodModal(false)} 
          onMoodSelect={handleSetMood} 
        />
      )}
    </div>
  );
};

export default Chat;

