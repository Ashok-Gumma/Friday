import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Send, Mic, MicOff, Volume2, 
  VolumeX, ChevronDown, LogOut, Settings, 
  Sparkles, MessageSquare, Shield, Zap 
} from "lucide-react";
import MoodPrompt from "./MoodPrompt";
import WordScroller from "./WordScroller";
import logo from "../assets/red-logo.png";
import FridayLogo from "./FridayLogo.jsx";

import chatBg from "../assets/chat-bg.png";

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [todayMood, setTodayMood] = useState(null);
  const [listening, setListening] = useState(false);
  const [voiceReply, setVoiceReply] = useState(true);
  const voiceReplyRef = useRef(true);
  const [isTyping, setIsTyping] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState("");

  const scrollRef = useRef(null);
  const recognitionRef = useRef(null);
  const synth = window.speechSynthesis;

  const profile = JSON.parse(localStorage.getItem("userProfile") || "{}");
  const chatWords = ["NEURAL", "SYNC", "EXECUTE", "ENCRYPT", "active", "secure"];

  // Protect route
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");
  }, [navigate]);

  // Setup speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onstart = () => {
        console.log("Speech recognition started.");
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
        console.log("Speech recognition ended.");
        setListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech Recognition Error:", event.error);
        setListening(false);
      };
    } else {
      console.warn("Speech Recognition not supported in this browser.");
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

  // Ultra-smooth auto scroll
  useLayoutEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      console.error("Speech Recognition not initialized");
      return;
    }
    if (listening) {
      console.log("User stopped mic recording manually.");
      recognitionRef.current.stop();
    } else {
      try {
        console.log("Starting speech recognition...");
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
          setMessages(res.data.map(m => ({ type: m.type, text: m.content })));
        } catch (err) {
          console.error("Failed to load history:", err);
        }
      };
      fetchHistory();
    }
  }, [todayMood]);

  const speakText = (text) => {
    if (!voiceReplyRef.current) return;
    synth.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    const voice = voices.find((v) => v.name === selectedVoice);
    if (voice) utter.voice = voice;
    synth.speak(utter);
  };

  const handleClearHistory = async () => {
    if (!window.confirm("Are you sure you want to clear your neural log? This cannot be undone.")) return;
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

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setMessages((prev) => [...prev, { type: "user", text: userMsg }]);
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
      setIsTyping(false);
      setMessages((prev) => [...prev, { type: "ai", text: aiText }]);
      speakText(aiText);
    } catch {
      setIsTyping(false);
      setMessages((prev) => [...prev, { type: "ai", text: "Neural link interrupted. Please retry." }]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userProfile");
    navigate("/");
  };

  if (!todayMood) return <MoodPrompt onMoodSelect={setTodayMood} />;

  return (
    <div style={{ 
      height: "100vh", display: "flex", background: "#000", 
      color: "var(--text-primary)", overflow: "hidden", position: "relative",
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Immersive Reference Background */}
      <div style={{ 
        position: "fixed", inset: 0, zIndex: 0, 
        backgroundImage: `url(${chatBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: "brightness(0.9)"
      }} />
      
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: showSidebar ? "320px" : "0px", opacity: showSidebar ? 1 : 0 }}
        style={{ 
          background: "rgba(0,0,0,0.4)", borderRight: "1px solid rgba(255,255,255,0.05)",
          display: "flex", flexDirection: "column", overflow: "hidden", 
          flexShrink: 0, position: "relative", zIndex: 100, backdropFilter: "blur(20px)"
        }}
      >
        <div style={{ padding: "32px 24px", display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }} onClick={() => navigate("/")}>
          <FridayLogo size="1.2rem" />
        </div>


        <div style={{ flex: 1, padding: "0 24px 24px", display: "flex", flexDirection: "column", gap: "32px" }}>
          <div>
            <label style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", letterSpacing: "1px", textTransform: "uppercase", fontWeight: 700 }}>Active Operator</label>
            <div style={{ 
              marginTop: "12px", padding: "16px", borderRadius: "16px",
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)",
              display: "flex", alignItems: "center", gap: "12px" 
            }}>
              <div style={{ 
                width: "44px", height: "44px", borderRadius: "12px", 
                background: "rgba(255,255,255,0.05)", color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <User size={20} />
              </div>
              <div>
                <p style={{ fontSize: "0.95rem", fontWeight: 600 }}>{profile.name || "Operator"}</p>
                <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)" }}>{todayMood} Calibration</p>
              </div>
            </div>
          </div>

          <div>
            <label style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", letterSpacing: "1px", textTransform: "uppercase", fontWeight: 700 }}>Neural Voice</label>
            <div style={{ marginTop: "12px", position: "relative" }}>
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                style={{ 
                  width: "100%", padding: "14px 18px", borderRadius: "14px", 
                  background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)",
                  color: "#fff", outline: "none", fontSize: "0.85rem", appearance: "none"
                }}
              >
                {voices.map((v) => (
                  <option key={v.name} value={v.name} style={{ background: "#111" }}>
                    {v.name.substring(0, 30)}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", opacity: 0.5 }} />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px" }}>
            <span style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>Audio Feedback</span>
            <button 
              onClick={() => {
                const newValue = !voiceReply;
                console.log("Audio Feedback Toggled:", newValue ? "ON" : "OFF");
                setVoiceReply(newValue);
                voiceReplyRef.current = newValue;
                if (!newValue) {
                  console.log("Cancelling active speech...");
                  synth.cancel();
                }
              }}
              style={{ 
                width: "48px", height: "24px", borderRadius: "12px", 
                background: voiceReply ? "#ff4d4d" : "rgba(255,255,255,0.05)",
                border: "1px solid " + (voiceReply ? "rgba(255, 77, 77, 0.3)" : "rgba(255,255,255,0.1)"),
                position: "relative", transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                boxShadow: voiceReply ? "0 0 15px rgba(255, 77, 77, 0.3)" : "none",
                cursor: "pointer"
              }}
            >
              <motion.div 
                animate={{ x: voiceReply ? 26 : 2 }}
                style={{ 
                  width: "20px", height: "20px", borderRadius: "50%", 
                  background: "#fff", 
                  position: "absolute", top: "1px",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
                }} 
              />
            </button>
          </div>
        </div>

        <div style={{ padding: "24px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <button 
            onClick={handleClearHistory}
            style={{ 
              width: "100%", padding: "14px", borderRadius: "14px", display: "flex", alignItems: "center", gap: "12px", 
              color: "rgba(255,255,255,0.4)", marginBottom: "8px", background: "transparent", border: "1px solid transparent",
              transition: "all 0.3s", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600
            }}
            className="sidebar-action-btn"
          >
            <Zap size={18} /> Clear Neural Log
          </button>
          <button 
            onClick={() => navigate("/profile")}
            style={{ 
              width: "100%", padding: "14px", borderRadius: "14px", display: "flex", alignItems: "center", gap: "12px", 
              color: "rgba(255,255,255,0.4)", marginBottom: "8px", background: "transparent", border: "1px solid transparent",
              transition: "all 0.3s"
            }}
            className="sidebar-btn-ref"
          >
            <Settings size={18} /> Configuration
          </button>
          <button 
            onClick={handleLogout}
            style={{ 
              width: "100%", padding: "14px", borderRadius: "14px", display: "flex", alignItems: "center", gap: "12px", 
              color: "rgba(255, 77, 77, 0.6)", background: "transparent", border: "1px solid transparent",
              transition: "all 0.3s"
            }}
            className="sidebar-btn-ref"
          >
            <LogOut size={18} /> De-authorize
          </button>
        </div>
      </motion.aside>

      {/* Main Chat Area */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", zIndex: 10 }}>
        
        {/* Transparent Header */}
        <header style={{ 
          padding: "24px 40px", display: "flex", justifyContent: "space-between", alignItems: "center",
          zIndex: 20 
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <button 
              onClick={() => setShowSidebar(!showSidebar)}
              style={{ 
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                width: "42px", height: "42px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center",
                color: "rgba(255,255,255,0.8)", backdropFilter: "blur(20px)",
                boxShadow: "0 4px 15px rgba(0,0,0,0.2)", transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.color = "rgba(255,255,255,0.8)"; }}
            >
              <ChevronDown size={20} style={{ transform: showSidebar ? "rotate(90deg)" : "rotate(-90deg)", transition: "0.3s" }} />
            </button>
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, letterSpacing: "-0.5px" }}>Neural Gateway</h3>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{ 
                  width: "8px", height: "8px", borderRadius: "50%", 
                  background: listening ? "#ff4d4d" : "#10b981", 
                  boxShadow: listening ? "0 0 12px #ff4d4d" : "0 0 10px #10b981",
                  transition: "0.3s"
                }} />
                <p style={{ 
                  fontSize: "0.75rem", 
                  color: listening ? "#ff4d4d" : "rgba(255,255,255,0.5)", 
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "1px"
                }}>
                  {listening ? "Listening..." : "Operational"}
                </p>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
             <div style={{ 
               padding: "10px 20px", borderRadius: "30px", fontSize: "0.8rem", fontWeight: 700,
               background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
               color: "#fff"
             }}>
               {todayMood}
             </div>
          </div>
        </header>

        {/* Message List */}
        <div 
          ref={scrollRef}
          style={{ 
            flex: 1, overflowY: "auto", padding: "40px 10%", 
            display: "flex", flexDirection: "column", gap: "40px"
          }}
          className="chat-scroll-ref"
        >
          {messages.length === 0 && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 0.3, scale: 1 }}
                transition={{ duration: 2 }}
              >
                <div style={{ 
                  width: "120px", height: "120px", borderRadius: "40px",
                  background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <Sparkles size={60} color="#fff" />
                </div>
              </motion.div>
              <p style={{ letterSpacing: "4px", fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", fontWeight: 700, marginTop: "24px" }}>READY FOR COMMANDS</p>
            </div>
          )}
          
          <AnimatePresence>
            {messages.map((m, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ 
                  alignSelf: m.type === "user" ? "flex-end" : "flex-start",
                  maxWidth: "75%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: m.type === "user" ? "flex-end" : "flex-start",
                  gap: "12px"
                }}
              >
                <div style={{ 
                  padding: "20px 28px", 
                  borderRadius: m.type === "user" ? "28px 28px 4px 28px" : "28px 28px 28px 4px",
                  background: m.type === "user" ? "#fff" : "rgba(255,255,255,0.03)",
                  border: m.type === "user" ? "none" : "1px solid rgba(255,255,255,0.08)",
                  color: m.type === "user" ? "#000" : "#fff",
                  fontWeight: m.type === "user" ? 600 : 400,
                  fontSize: "1.05rem",
                  lineHeight: 1.6,
                  boxShadow: m.type === "user" ? "0 20px 40px rgba(255,255,255,0.15)" : "0 20px 40px rgba(0,0,0,0.2)",
                  backdropFilter: m.type === "user" ? "none" : "blur(20px)"
                }}>
                  {m.text}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", opacity: 0.4 }}>
                  <span style={{ fontSize: "0.7rem", color: "#fff", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" }}>
                    {m.type === "user" ? "Directive" : "Assistant"}
                  </span>
                </div>
              </motion.div>
            ))}
            
            {isTyping && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ alignSelf: "flex-start", padding: "12px 24px", background: "rgba(255,255,255,0.03)", borderRadius: "20px", display: "flex", gap: "12px", alignItems: "center" }}
              >
                <div className="dot-pulse" style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#fff" }} />
                <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>System processing...</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Minimalist Floating Input */}
        <div style={{ padding: "40px 10%", position: "relative" }}>
          <form 
            onSubmit={handleSend}
            style={{ 
              display: "flex", alignItems: "center", gap: "16px", padding: "12px",
              background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "28px", backdropFilter: "blur(40px)",
              boxShadow: "0 30px 60px rgba(0,0,0,0.4)",
              transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
            }}
          >
            <button 
              type="button" 
              onClick={toggleMic}
              style={{ 
                width: "52px", height: "52px", borderRadius: "18px", 
                background: listening ? "#ff4d4d" : "rgba(255,255,255,0.03)",
                border: "none",
                color: listening ? "#fff" : "rgba(255,255,255,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center", 
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                boxShadow: listening ? "0 0 25px rgba(255, 77, 77, 0.5)" : "none",
                cursor: "pointer", zIndex: 10
              }}
              className={listening ? "mic-pulse-ref" : ""}
            >
              <Mic size={24} fill={listening ? "#fff" : "none"} />
            </button>
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Start typing..."
              style={{ 
                flex: 1, padding: "12px", background: "transparent", border: "none", 
                color: "#fff", outline: "none", fontSize: "1.1rem", fontWeight: 400
              }}
              disabled={isTyping}
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isTyping}
              style={{ 
                width: "52px", height: "52px", borderRadius: "50%", 
                background: "#fff", color: "#000",
                display: "flex", alignItems: "center", justifyContent: "center",
                opacity: (!input.trim() || isTyping) ? 0.3 : 1,
                transition: "0.3s", cursor: "pointer",
                boxShadow: "0 10px 30px rgba(255,255,255,0.2)"
              }}
            >
              <Send size={24} />
            </button>
          </form>
          <p style={{ textAlign: "center", marginTop: "16px", fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.5px" }}>
            As You Wish Terminal • Neural Encryption Active
          </p>
        </div>
      </main>

      <style>{`
        .sidebar-btn-ref {
          transition: all 0.2s;
        }
        .sidebar-btn-ref:hover {
          background: rgba(255,255,255,0.05);
          color: #fff !important;
        }
        .chat-scroll-ref::-webkit-scrollbar {
          width: 4px;
        }
        .chat-scroll-ref::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
        }
        .dot-pulse {
          animation: dotPulse 1.5s infinite ease-in-out;
        }
        @keyframes dotPulse {
          0% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.1); }
          100% { opacity: 0.2; transform: scale(0.8); }
        }
        .mic-pulse-ref {
          animation: micPulse 2s infinite cubic-bezier(0.4, 0, 0.6, 1);
        }
        @keyframes micPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); box-shadow: 0 0 30px rgba(255, 77, 77, 0.4); }
        }
      `}</style>
    </div>
  );
};

export default Chat;
