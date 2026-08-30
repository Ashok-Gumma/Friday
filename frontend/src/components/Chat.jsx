import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, Mic, Volume2, VolumeX, LogOut, Settings,
  Copy, Check, Trash2, ChevronDown,
  PanelLeftClose, PanelLeftOpen, BrainCircuit
} from "lucide-react";
import MoodPrompt from "./MoodPrompt";
import ThemeToggle from "./ThemeToggle.jsx";
import { NotionChatArt } from "./NotionArt.jsx";

const MOOD_EMOJI = {
  happy: "😊", sad: "😔", angry: "😤", motivated: "🔥",
  calm: "🌿", anxious: "😰", relaxed: "☕", romantic: "💛",
  focused: "🎯", professional: "💼", neutral: "😐"
};

const quickPrompts = [
  "I'm feeling overwhelmed — help me ground myself.",
  "Give me an inspiring thought to start my day.",
  "Help me reflect on a difficult conversation.",
  "Guide me through a quick breathing exercise.",
];

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [todayMood, setTodayMoodState] = useState(() => localStorage.getItem("userMood") || "relaxed");
  const moodRef = useRef(localStorage.getItem("userMood") || "relaxed");
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [voiceReply, setVoiceReply] = useState(true);
  const voiceReplyRef = useRef(true);
  const [isTyping, setIsTyping] = useState(false);
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" ? window.innerWidth < 768 : false);
  const [showSidebar, setShowSidebar] = useState(() => typeof window !== "undefined" ? window.innerWidth >= 768 : true);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(() => localStorage.getItem("userVoice") || "");
  const selectedVoiceRef = useRef(localStorage.getItem("userVoice") || "");

  // ── Responsive mobile listener ──
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile && showSidebar) {
        // keep sidebar state or manage smoothly
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [showSidebar]);

  const scrollRef = useRef(null);
  const recognitionRef = useRef(null);
  const synth = typeof window !== "undefined" ? window.speechSynthesis : null;
  const profile = JSON.parse(localStorage.getItem("userProfile") || "{}");

  // ── Mood setter ──
  const handleSetMood = (newMood) => {
    setTodayMoodState(newMood);
    moodRef.current = newMood;
    localStorage.setItem("userMood", newMood);
    setShowMoodModal(false);
  };

  // ── Speech recognition setup ──
  useEffect(() => {
    if (typeof window === "undefined") return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = "en-US";
    rec.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setInput(text);
      handleSendText(text);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recognitionRef.current = rec;
  }, []);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert("Voice input is not supported in this browser.");
      return;
    }
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  // ── Voice synthesis setup ──
  useEffect(() => {
    if (!synth) return;
    const load = () => {
      const v = synth.getVoices();
      if (!v || v.length === 0) return;
      setVoices(v);
      const saved = localStorage.getItem("userVoice");
      const found = v.find(x => x.name === saved);
      if (found) {
        setSelectedVoice(found.name);
        selectedVoiceRef.current = found.name;
      } else if (v.length > 0) {
        const defaultV = v.find(x => x.lang.startsWith("en")) || v[0];
        setSelectedVoice(defaultV.name);
        selectedVoiceRef.current = defaultV.name;
      }
    };
    load();
    synth.onvoiceschanged = load;
  }, [synth]);

  const handleVoiceChange = (voiceName) => {
    setSelectedVoice(voiceName);
    selectedVoiceRef.current = voiceName;
    localStorage.setItem("userVoice", voiceName);

    // Audio preview of selected voice
    if (synth) {
      synth.cancel();
      const allVoices = synth.getVoices();
      const targetVoice = allVoices.find(x => x.name === voiceName);
      const previewUtterance = new SpeechSynthesisUtterance("Voice updated.");
      if (targetVoice) {
        previewUtterance.voice = targetVoice;
        previewUtterance.lang = targetVoice.lang || "en-US";
      }
      synth.speak(previewUtterance);
    }
  };

  // ── Bottom anchor ref for reliable scroll ──
  const bottomRef = useRef(null);

  // ── Auto scroll ──
  useEffect(() => {
    const timer = setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 40);
    return () => clearTimeout(timer);
  }, [messages, isTyping]);

  // ── Load history ──
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/chat/history", { headers: { Authorization: `Bearer ${token}` } });
        setMessages(res.data.map(m => ({
          type: m.type, text: m.content,
          time: new Date(m.createdAt || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        })));
      } catch { /* silent */ }
    };
    fetchHistory();
  }, []);

  // ── TTS ──
  const stopAudio = () => { if (synth) { synth.cancel(); setIsSpeaking(false); } };
  const speakText = (text) => {
    if (!voiceReplyRef.current || !synth) return;
    synth.cancel();

    // Fresh voice lookup directly from browser synth
    const allVoices = synth.getVoices();
    const activeVoiceName = selectedVoiceRef.current || localStorage.getItem("userVoice") || selectedVoice;
    const v = allVoices.find(x => x.name === activeVoiceName) || allVoices[0];

    const u = new SpeechSynthesisUtterance(text);
    if (v) {
      u.voice = v;
      u.lang = v.lang || "en-US";
    }

    // Dynamic Tone Modulation according to active mood
    const currentMood = String(moodRef.current || "").toLowerCase();
    if (currentMood === "calm" || currentMood === "sad" || currentMood === "relaxed") {
      u.rate = 0.90;   // slower, gentle cadence
      u.pitch = 0.95;  // deeper, softer pitch
    } else if (currentMood === "motivated" || currentMood === "happy" || currentMood === "joyful") {
      u.rate = 1.06;   // energetic, upbeat pace
      u.pitch = 1.08;  // brighter pitch
    } else if (currentMood === "anxious") {
      u.rate = 0.92;   // grounding, steady
      u.pitch = 0.98;
    } else if (currentMood === "angry") {
      u.rate = 0.95;   // soothing, calm
      u.pitch = 0.92;
    } else {
      u.rate = 1.0;
      u.pitch = 1.0;
    }

    u.onstart = () => setIsSpeaking(true);
    u.onend = () => setIsSpeaking(false);
    u.onerror = () => setIsSpeaking(false);
    synth.speak(u);
  };

  // ── Send message ──
  const handleSendText = async (textToSend) => {
    if (!textToSend.trim() || isTyping) return;
    const ts = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg = textToSend.trim();
    setMessages(prev => [...prev, { type: "user", text: userMsg, time: ts }]);
    setInput("");
    setIsTyping(true);

    // Safety net — if API hangs for 30s, auto-reset
    const safetyTimer = setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        { type: "ai", text: "Friday is taking too long to respond. Please try again.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }
      ]);
    }, 30000);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("/api/chat", {
        message: userMsg,
        mood: moodRef.current,
        profile,
      }, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 25000,   // 25-second hard timeout
      });
      clearTimeout(safetyTimer);
      const aiTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setIsTyping(false);
      setMessages(prev => [...prev, { type: "ai", text: res.data.reply, time: aiTime }]);
      speakText(res.data.reply);
    } catch (err) {
      clearTimeout(safetyTimer);
      setIsTyping(false);
      const errMsg = err.code === "ECONNABORTED"
        ? "Friday took too long. Check your connection and try again."
        : "Couldn't reach Friday. Please try again.";
      setMessages(prev => [...prev, {
        type: "ai", text: errMsg,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }]);
    }
  };

  const handleCopy = (text, i) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(i);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleClearHistory = async () => {
    if (!window.confirm("Clear all chat history?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete("/api/chat/history", { headers: { Authorization: `Bearer ${token}` } });
      setMessages([]);
    } catch {
      alert("Failed to clear history");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userProfile");
    navigate("/login");
  };

  const moodEmoji = MOOD_EMOJI[todayMood] || "💬";

  return (
    <div style={{
      display: "flex", height: "100dvh", minHeight: "100vh", width: "100vw",
      background: "var(--bg)", color: "var(--text)",
      fontFamily: "'Inter', sans-serif", overflow: "hidden",
      position: "relative",
      transition: "background 0.2s ease, color 0.2s ease"
    }}>

      {/* ── MOBILE BACKDROP ── */}
      {isMobile && showSidebar && (
        <div
          className="chat-sidebar-backdrop"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* ── SIDEBAR ── */}
      <AnimatePresence>
        {showSidebar && (
          <motion.aside
            initial={{ width: 0, opacity: 0, x: isMobile ? -280 : 0 }}
            animate={{ width: isMobile ? 280 : 260, opacity: 1, x: 0 }}
            exit={{ width: 0, opacity: 0, x: isMobile ? -280 : 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className={isMobile ? "chat-sidebar-mobile" : ""}
            style={{
              background: "var(--bg-soft)",
              borderRight: "1px solid var(--border)",
              display: "flex", flexDirection: "column",
              flexShrink: 0, overflow: "hidden"
            }}
          >
            {/* Brand / Logo */}
            <div style={{
              padding: "16px 18px", borderBottom: "1px solid var(--border)",
              display: "flex", alignItems: "center", justifyContent: "space-between"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontWeight: 800, fontSize: "0.95rem", letterSpacing: "-0.3px", color: "var(--text)" }}>
                  Friday AI
                </span>
                <span style={{
                  fontSize: "0.68rem", fontWeight: 700, padding: "2px 6px",
                  borderRadius: "4px", background: "var(--bg-card)", border: "1px solid var(--border)",
                  color: "var(--text-muted)", textTransform: "uppercase"
                }}>
                  ML 100K
                </span>
              </div>
              <ThemeToggle size="sm" />
            </div>

            {/* Sidebar content */}
            <div style={{ flex: 1, overflowY: "auto", padding: "14px 12px", display: "flex", flexDirection: "column", gap: "16px" }}>

              {/* Current Mood card */}
              <div style={{
                background: "var(--bg-card)", border: "1px solid var(--border)",
                borderRadius: "10px", padding: "12px 14px",
                boxShadow: "var(--shadow-sm)"
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Active Mood
                  </span>
                  <button
                    onClick={() => setShowMoodModal(true)}
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      fontSize: "0.75rem", color: "var(--accent-purple)", fontWeight: 600
                    }}
                  >
                    Change
                  </button>
                </div>
                <button
                  onClick={() => setShowMoodModal(true)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: "8px",
                    background: "var(--bg-soft)", border: "1px solid var(--border)",
                    borderRadius: "8px", padding: "8px 10px",
                    cursor: "pointer", textAlign: "left",
                    transition: "all 0.15s"
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "var(--text)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
                >
                  <span style={{ fontSize: "1.2rem" }}>{moodEmoji}</span>
                  <div>
                    <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text)", textTransform: "capitalize" }}>
                      {todayMood}
                    </p>
                    <p style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                      AI tone adapted
                    </p>
                  </div>
                </button>
              </div>

              {/* Settings Section */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", paddingLeft: "4px" }}>
                  Preferences
                </span>

                {/* Voice Reply toggle */}
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "8px 10px", background: "var(--bg-card)",
                  border: "1px solid var(--border)", borderRadius: "8px"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Volume2 size={15} color="var(--text-muted)" />
                    <span style={{ fontSize: "0.82rem", fontWeight: 500, color: "var(--text)" }}>Voice Reply</span>
                  </div>
                  <button
                    onClick={() => {
                      const next = !voiceReply;
                      setVoiceReply(next);
                      voiceReplyRef.current = next;
                      if (!next) stopAudio();
                    }}
                    style={{
                      width: "36px", height: "20px", borderRadius: "999px",
                      background: voiceReply ? "var(--accent)" : "var(--border)",
                      border: "none", position: "relative", cursor: "pointer", transition: "background .2s"
                    }}
                  >
                    <span style={{
                      position: "absolute", top: "2px",
                      left: voiceReply ? "18px" : "2px",
                      width: "16px", height: "16px", borderRadius: "50%",
                      background: "var(--bg)", transition: "left .2s",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
                    }} />
                  </button>
                </div>

                {/* Voice selector */}
                {voices.length > 0 && (
                  <div style={{
                    padding: "8px 10px", background: "var(--bg-card)",
                    border: "1px solid var(--border)", borderRadius: "8px"
                  }}>
                    <label style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                      Voice Character
                    </label>
                    <select
                      value={selectedVoice}
                      onChange={e => handleVoiceChange(e.target.value)}
                      style={{
                        width: "100%", background: "var(--bg-soft)", border: "1px solid var(--border)",
                        borderRadius: "6px", padding: "6px 8px", fontSize: "0.78rem",
                        color: "var(--text)", outline: "none", cursor: "pointer"
                      }}
                    >
                      {voices.map(v => (
                        <option key={v.name} value={v.name}>
                          {v.name.replace(/(Microsoft|Google|Apple)\s*/gi, "").slice(0, 24)} ({v.lang})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Footer */}
            <div style={{ padding: "12px", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "6px" }}>
              <button
                onClick={handleClearHistory}
                style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  padding: "8px 10px", borderRadius: "6px", border: "none",
                  background: "transparent", cursor: "pointer", color: "var(--text-muted)",
                  fontSize: "0.82rem", fontWeight: 500, width: "100%", textAlign: "left",
                  transition: "all 0.15s"
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-hover)"; e.currentTarget.style.color = "var(--text)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-muted)"; }}
              >
                <Trash2 size={14} /> Clear chat
              </button>

              <button
                onClick={() => navigate("/profile")}
                style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  padding: "8px 10px", borderRadius: "6px", border: "none",
                  background: "transparent", cursor: "pointer", color: "var(--text-muted)",
                  fontSize: "0.82rem", fontWeight: 500, width: "100%", textAlign: "left",
                  transition: "all 0.15s"
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-hover)"; e.currentTarget.style.color = "var(--text)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-muted)"; }}
              >
                <Settings size={14} /> Profile & ML Stats
              </button>

              <button
                onClick={handleLogout}
                style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  padding: "8px 10px", borderRadius: "6px", border: "none",
                  background: "transparent", cursor: "pointer", color: "#ef4444",
                  fontSize: "0.82rem", fontWeight: 500, width: "100%", textAlign: "left",
                  transition: "all 0.15s"
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(239, 68, 68, 0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
              >
                <LogOut size={14} /> Sign out
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── MAIN CHAT COLUMN ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>

        {/* Header */}
        <header style={{
          padding: "0 20px", height: "52px", flexShrink: 0,
          borderBottom: "1px solid var(--border)",
          background: "var(--bg)",
          display: "flex", alignItems: "center", justifyContent: "space-between"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              onClick={() => setShowSidebar(s => !s)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex", padding: "4px" }}
              title={showSidebar ? "Hide sidebar" : "Show sidebar"}
            >
              {showSidebar ? <PanelLeftClose size={17} /> : <PanelLeftOpen size={17} />}
            </button>
            <span style={{ fontSize: "0.92rem", fontWeight: 700, color: "var(--text)" }}>Friday</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <ThemeToggle size="sm" />

            {/* Mood pill in header */}
            <button
              onClick={() => setShowMoodModal(true)}
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: "5px 12px", borderRadius: "8px", border: "1px solid var(--border)",
                background: "var(--bg-soft)", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600, color: "var(--text)",
                transition: "all .15s"
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "var(--text)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
            >
              {moodEmoji}
              <span style={{ textTransform: "capitalize" }}>{todayMood}</span>
              <ChevronDown size={12} color="var(--text-muted)" />
            </button>
          </div>
        </header>

        {/* Messages */}
        <div
          ref={scrollRef}
          data-lenis-prevent="true"
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "32px 20px 120px",
            display: "flex",
            flexDirection: "column",
            background: "var(--bg)",
            overscrollBehavior: "contain",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <div style={{ width: "100%", maxWidth: "760px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Empty state with Notion Artwork */}
            {messages.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px 20px 20px" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
                  <NotionChatArt width={160} height={160} />
                </div>
                <h2 style={{ fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.5px", color: "var(--text)", marginBottom: "8px" }}>
                  Hey, I'm Friday.
                </h2>
                <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", maxWidth: "400px", margin: "0 auto 28px", lineHeight: 1.6 }}>
                  You're feeling <strong style={{ color: "var(--text)", textTransform: "capitalize" }}>{todayMood}</strong> right now.
                  I'll match my tone to support you. What's on your mind?
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px", maxWidth: "600px", margin: "0 auto" }}>
                  {quickPrompts.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendText(p)}
                      style={{
                        padding: "12px 14px", borderRadius: "10px", border: "1px solid var(--border)",
                        background: "var(--bg-card)", cursor: "pointer", textAlign: "left",
                        fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 500, lineHeight: 1.4,
                        transition: "all .15s", fontFamily: "'Inter', sans-serif",
                        boxShadow: "var(--shadow-sm)"
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--text)"; e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.background = "var(--bg-soft)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.background = "var(--bg-card)"; }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            <AnimatePresence>
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: m.type === "user" ? "flex-end" : "flex-start",
                    gap: "4px"
                  }}
                >
                  <div style={{
                    maxWidth: "72%",
                    padding: "12px 18px",
                    borderRadius: m.type === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    background: m.type === "user" ? "var(--chat-bubble-user)" : "var(--chat-bubble-ai)",
                    color: m.type === "user" ? "var(--chat-bubble-user-text)" : "var(--chat-bubble-ai-text)",
                    border: m.type === "user" ? "none" : "1px solid var(--border)",
                    fontSize: "0.9375rem",
                    lineHeight: 1.6,
                    fontWeight: 400,
                    boxShadow: "var(--shadow-sm)"
                  }}>
                    {m.text}
                  </div>

                  {/* Message meta */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.72rem", color: "var(--text-faint)" }}>
                    <span>{m.time}</span>
                    {m.type === "ai" && (
                      <>
                        <button
                          onClick={() => handleCopy(m.text, i)}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "3px", fontSize: "0.72rem", padding: "0" }}
                          onMouseEnter={e => e.currentTarget.style.color = "var(--text)"}
                          onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
                        >
                          {copiedIndex === i ? <Check size={11} /> : <Copy size={11} />}
                          {copiedIndex === i ? "Copied" : "Copy"}
                        </button>
                        <button
                          onClick={() => isSpeaking ? stopAudio() : speakText(m.text)}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "3px", fontSize: "0.72rem", padding: "0" }}
                          onMouseEnter={e => e.currentTarget.style.color = "var(--text)"}
                          onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
                        >
                          {isSpeaking ? <VolumeX size={11} /> : <Volume2 size={11} />}
                          {isSpeaking ? "Stop" : "Listen"}
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing indicator */}
            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ alignSelf: "flex-start" }}>
                <div style={{
                  padding: "12px 16px", borderRadius: "18px 18px 18px 4px",
                  background: "var(--chat-bubble-ai)", border: "1px solid var(--border)",
                  display: "flex", alignItems: "center", gap: "4px"
                }}>
                  <span className="wave-dot" />
                  <span className="wave-dot" />
                  <span className="wave-dot" />
                </div>
                <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "4px", marginLeft: "4px" }}>
                  Friday is thinking…
                </p>
              </motion.div>
            )}

            {/* Scroll anchor — always at the very bottom */}
            <div ref={bottomRef} style={{ height: "1px" }} />
          </div>
        </div>

        {/* Input bar */}
        <div style={{
          padding: "12px 20px 20px",
          borderTop: "1px solid var(--border)",
          background: "var(--bg)",
          flexShrink: 0
        }}>
          <form
            onSubmit={e => { e.preventDefault(); handleSendText(input); }}
            style={{
              maxWidth: "760px", margin: "0 auto",
              display: "flex", alignItems: "flex-end", gap: "8px",
              background: "var(--bg-soft)", border: "1px solid var(--border)",
              borderRadius: "12px", padding: "10px 12px",
              transition: "border-color .15s"
            }}
            onFocus={e => e.currentTarget.style.borderColor = "var(--text)"}
            onBlur={e => e.currentTarget.style.borderColor = "var(--border)"}
          >
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendText(input); } }}
              placeholder={`Message Friday (you're feeling ${todayMood})...`}
              rows={1}
              style={{
                flex: 1, background: "transparent", border: "none", outline: "none",
                resize: "none", fontFamily: "'Inter', sans-serif", fontSize: "0.9375rem",
                color: "var(--text)", lineHeight: 1.5, maxHeight: "120px", overflowY: "auto"
              }}
            />
            <div style={{ display: "flex", gap: "6px", alignItems: "center", flexShrink: 0 }}>
              <button
                type="button"
                onClick={toggleMic}
                title="Voice input"
                style={{
                  width: "34px", height: "34px", borderRadius: "8px", border: "none",
                  background: listening ? "var(--accent)" : "transparent",
                  color: listening ? "var(--bg)" : "var(--text-muted)",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all .15s"
                }}
              >
                <Mic size={16} />
              </button>
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                style={{
                  width: "34px", height: "34px", borderRadius: "8px", border: "none",
                  background: input.trim() ? "var(--accent)" : "var(--border)",
                  color: input.trim() ? "var(--bg)" : "var(--text-faint)",
                  cursor: input.trim() ? "pointer" : "not-allowed",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all .15s"
                }}
              >
                <Send size={15} />
              </button>
            </div>
          </form>
          <p style={{ fontSize: "0.72rem", color: "var(--text-faint)", textAlign: "center", marginTop: "8px" }}>
            Friday uses ML to adapt its tone to your selected mood
          </p>
        </div>
      </div>

      {/* Mood Modal */}
      {showMoodModal && (
        <MoodPrompt
          onMoodSelect={handleSetMood}
          isModal={true}
          onClose={() => setShowMoodModal(false)}
        />
      )}
    </div>
  );
};

export default Chat;
