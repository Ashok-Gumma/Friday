import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, Mic, Sparkles, Shield, ArrowRight, Heart, Smile, 
  Sun, Moon, Cloud, Thermometer, Compass, Activity, ChevronRight,
  TrendingUp, BarChart2, Cpu, Zap, Lock, Volume2, VolumeX, RefreshCw
} from "lucide-react";
import FridayLogo from "./FridayLogo.jsx";

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Real-time Clock State
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  
  // Real-time Weather State
  const [weatherMode, setWeatherMode] = useState("sun");
  const weatherPresets = {
    sun: { label: "72°F • Sunny Clear", icon: <Sun size={14} color="#facc15" />, code: "1380" },
    moon: { label: "62°F • Calm Night", icon: <Moon size={14} color="#a855f7" />, code: "0940" },
    cloud: { label: "68°F • Misty Valley", icon: <Cloud size={14} color="#38bdf8" />, code: "1120" }
  };

  // Hero Background Image Switcher State
  const [currentHeroImg, setCurrentHeroImg] = useState("/hero.png");

  // Daily Focus Tokens Realtime Incrementing Counter
  const [focusTokens, setFocusTokens] = useState(5729);

  // Sparkline Range State
  const [sparklineRange, setSparklineRange] = useState("today");

  // Interactive Neural Tone Orbs State
  const [activeTone, setActiveTone] = useState("golden");

  // Live Chat & Mic State
  const [heroInput, setHeroInput] = useState("");
  const [isMicActive, setIsMicActive] = useState(false);
  const [heroMessages, setHeroMessages] = useState([
    { type: "ai", text: "Hello! Friday AI is online and set to Golden Sunset mode. How can I help you today?" }
  ]);

  const synth = typeof window !== "undefined" ? window.speechSynthesis : null;
  const recognitionRef = useRef(null);

  // Realtime Clock Ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Protect route if logged in
  useEffect(() => {
    if (token) navigate("/chat");
  }, [token, navigate]);

  // Speech Recognition Setup
  useEffect(() => {
    if (typeof window === "undefined") return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.onstart = () => setIsMicActive(true);
      recognitionRef.current.onresult = (e) => {
        const text = e.results[0][0].transcript;
        setHeroInput(text);
      };
      recognitionRef.current.onend = () => setIsMicActive(false);
    }
  }, []);

  const toggleMic = () => {
    if (!recognitionRef.current) return;
    if (isMicActive) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const speakText = (text) => {
    if (!synth) return;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 1.0;
    utterance.rate = 1.0;
    synth.speak(utterance);
  };

  const handleHeroSubmit = (e) => {
    e.preventDefault();
    if (!heroInput.trim()) return;

    const userMsg = heroInput.trim();
    setHeroMessages((prev) => [...prev, { type: "user", text: userMsg }]);
    setHeroInput("");
    setFocusTokens((prev) => prev + 15);

    setTimeout(() => {
      const aiReply = `Acknowledged. Processing "${userMsg}" in ${activeToneObj.name} mode. System synced!`;
      setHeroMessages((prev) => [...prev, { type: "ai", text: aiReply }]);
      speakText(aiReply);
    }, 500);
  };

  const tones = [
    { id: "golden", name: "Golden Sunset", color: "#facc15", shadow: "rgba(250, 204, 21, 0.5)", desc: "Warm, energetic, and highly motivating" },
    { id: "mocha", name: "Mocha Focus", color: "#d97706", shadow: "rgba(217, 119, 6, 0.5)", desc: "Deep analytical clarity and structured task priority" },
    { id: "emerald", name: "Emerald Calm", color: "#10b981", shadow: "rgba(16, 185, 129, 0.5)", desc: "Peaceful, attentive, and relaxed conversationalist" },
    { id: "violet", name: "Violet Nebula", color: "#a855f7", shadow: "rgba(168, 85, 247, 0.5)", desc: "Creative synthesis, writing, and brainstorming" }
  ];

  const activeToneObj = tones.find((t) => t.id === activeTone) || tones[0];

  return (
    <div
      style={{
        minHeight: "100vh",
        color: "#0f172a",
        fontFamily: "'Inter', sans-serif",
        overflowX: "hidden",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundImage: `linear-gradient(180deg, rgba(250, 249, 245, 0.35) 0%, rgba(250, 249, 245, 0.55) 100%), url('${currentHeroImg}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        transition: "background-image 0.5s ease"
      }}
    >
      {/* Ambient Radial Lighting */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          background: "radial-gradient(circle at 50% 15%, rgba(250, 204, 21, 0.2) 0%, transparent 70%)"
        }}
      />

      <div style={{ position: "relative", zIndex: 10 }}>
        {/* Header Navigation */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px clamp(20px, 4vw, 60px)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(234, 179, 8, 0.18)",
            position: "sticky",
            top: 0,
            zIndex: 100,
            background: "rgba(255, 255, 255, 0.85)"
          }}
        >
          <div onClick={() => navigate("/")} data-cursor="FRIDAY">
            <FridayLogo size="1.4rem" color="#0f172a" />
          </div>

          {/* Quick Header Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(250,204,21,0.12)", padding: "6px 16px", borderRadius: "999px", border: "1px solid rgba(250,204,21,0.3)" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: activeToneObj.color, boxShadow: `0 0 10px ${activeToneObj.color}` }} />
              <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "#0f172a" }}>{activeToneObj.name}</span>
            </div>

            <Link to="/login" style={{ textDecoration: "none" }}>
              <button 
                data-cursor="SIGN IN"
                style={{
                  padding: "9px 22px",
                  borderRadius: "999px",
                  background: "#ffffff",
                  border: "1px solid rgba(0, 0, 0, 0.12)",
                  color: "#0f172a",
                  fontSize: "0.88rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.03)"
                }}
              >
                Sign In
              </button>
            </Link>
            <Link to="/signup" style={{ textDecoration: "none" }}>
              <button className="btn-primary" data-cursor="START" style={{ padding: "9px 24px", fontSize: "0.88rem" }}>
                Get Started <ArrowRight size={15} />
              </button>
            </Link>
          </div>
        </header>

        {/* MAIN DASHBOARD CONTAINER (WHITE & GOLDEN YELLOW THEME MATCHING REFERENCE LAYOUT) */}
        <div style={{ maxWidth: "1400px", margin: "32px auto 0", padding: "0 clamp(16px, 3vw, 40px)" }}>
          
          {/* TOP ROW: HERO LANDSCAPE WINDOW + TOP-RIGHT STACKED CARDS */}
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 2.3fr) minmax(0, 1fr)", gap: "24px", marginBottom: "24px" }}>
            
            {/* MAIN LANDSCAPE HERO WINDOW */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              style={{
                borderRadius: "32px",
                height: "520px",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 25px 60px rgba(0,0,0,0.12)",
                border: "1px solid rgba(234, 179, 8, 0.25)",
                backgroundImage: `url('${currentHeroImg}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                transition: "background-image 0.5s ease"
              }}
            >
              {/* Overlay gradient for crisp text readability */}
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.3) 50%, rgba(15,23,42,0.85) 100%)"
              }} />

              {/* TOP-RIGHT FLOATING GLASS WEATHER & REALTIME CLOCK WIDGET OVERLAY */}
              <div style={{
                position: "absolute", top: "20px", right: "20px",
                background: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(24px)",
                border: "1px solid rgba(234, 179, 8, 0.3)",
                borderRadius: "24px",
                padding: "16px 22px",
                boxShadow: "0 15px 35px rgba(0,0,0,0.15)",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                minWidth: "270px",
                color: "#0f172a"
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", gap: "6px" }}>
                    {Object.keys(weatherPresets).map((key) => (
                      <button
                        key={key}
                        onClick={() => setWeatherMode(key)}
                        style={{
                          padding: "6px", borderRadius: "50%", border: "none", cursor: "pointer",
                          background: weatherMode === key ? "rgba(250,204,21,0.3)" : "rgba(0,0,0,0.04)",
                          transition: "all 0.2s"
                        }}
                      >
                        {weatherPresets[key].icon}
                      </button>
                    ))}
                  </div>
                  <span style={{ fontSize: "1.1rem", fontWeight: 900, color: "#d97706", letterSpacing: "0.5px" }}>
                    {currentTime}
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: "10px" }}>
                  <div style={{ textAlign: "left" }}>
                    <p style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: 800, textTransform: "uppercase" }}>WEATHER ATMOSPHERE</p>
                    <p style={{ fontSize: "0.85rem", color: "#0f172a", fontWeight: 800 }}>{weatherPresets[weatherMode].label}</p>
                  </div>
                  <div style={{ background: "#facc15", padding: "4px 12px", borderRadius: "999px", fontSize: "0.8rem", fontWeight: 900, color: "#0f172a" }}>
                    {weatherPresets[weatherMode].code}
                  </div>
                </div>
              </div>

              {/* BOTTOM-LEFT FLOATING CHAT INTERACTION BAR INSIDE HERO */}
              <div style={{
                position: "absolute", bottom: "24px", left: "24px", right: "24px",
                zIndex: 20
              }}>
                {/* Simulated Recent Chat Messages */}
                <div style={{ marginBottom: "12px", display: "flex", flexDirection: "column", gap: "8px", maxWidth: "520px" }}>
                  {heroMessages.slice(-2).map((m, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        alignSelf: m.type === "user" ? "flex-end" : "flex-start",
                        background: m.type === "user" ? "linear-gradient(135deg, #facc15 0%, #f59e0b 100%)" : "rgba(255, 255, 255, 0.92)",
                        color: "#0f172a",
                        padding: "12px 20px",
                        borderRadius: m.type === "user" ? "18px 18px 2px 18px" : "18px 18px 18px 2px",
                        fontSize: "0.9rem",
                        fontWeight: m.type === "user" ? 800 : 600,
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.15)"
                      }}
                    >
                      {m.text}
                    </motion.div>
                  ))}
                </div>

                {/* Floating Input Pill */}
                <form
                  onSubmit={handleHeroSubmit}
                  style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    background: "rgba(255, 255, 255, 0.92)",
                    border: "1px solid rgba(234, 179, 8, 0.3)",
                    borderRadius: "999px", padding: "8px 12px 8px 22px",
                    backdropFilter: "blur(30px)",
                    boxShadow: "0 15px 40px rgba(0,0,0,0.18)"
                  }}
                >
                  <input
                    type="text"
                    placeholder="Ask Friday anything... (e.g. Draft a quick email)"
                    value={heroInput}
                    onChange={(e) => setHeroInput(e.target.value)}
                    style={{
                      flex: 1, background: "none", border: "none", outline: "none",
                      color: "#0f172a", fontSize: "0.95rem", fontWeight: 600
                    }}
                  />

                  <button
                    type="button"
                    onClick={toggleMic}
                    style={{
                      padding: "10px", borderRadius: "50%",
                      background: isMicActive ? "rgba(234, 179, 8, 0.3)" : "rgba(0,0,0,0.04)",
                      border: "1px solid " + (isMicActive ? "#eab308" : "rgba(0,0,0,0.1)"),
                      color: isMicActive ? "#d97706" : "#64748b",
                      cursor: "pointer"
                    }}
                  >
                    <Mic size={16} />
                  </button>

                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ width: "42px", height: "42px", borderRadius: "50%", padding: 0 }}
                  >
                    <Send size={16} />
                  </button>
                </form>
              </div>
            </motion.div>

            {/* RIGHT STACKED WIDGET CARDS (TOP RIGHT) */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              
              {/* WIDGET CARD 1: DAILY FOCUS TOKENS */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                style={{
                  background: "rgba(255, 255, 255, 0.88)",
                  backdropFilter: "blur(24px)",
                  border: "1px solid rgba(255, 255, 255, 0.7)",
                  borderRadius: "28px",
                  padding: "24px 28px",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justify: "space-between",
                  height: "248px"
                }}
              >
                <div style={{ textAlign: "left" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#64748b", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                    DAILY FOCUS TOKENS
                  </span>
                  <h3 style={{ fontSize: "3.4rem", fontWeight: 900, color: "#0f172a", lineHeight: 1.1, marginTop: "8px", marginBottom: "4px" }}>
                    {focusTokens.toLocaleString()}
                  </h3>
                  <p style={{ fontSize: "0.85rem", color: "#d97706", fontWeight: 800, display: "flex", alignItems: "center", gap: "4px" }}>
                    <TrendingUp size={15} /> Realtime interactions active
                  </p>
                </div>

                {/* 3D Glowing Spherical Orb Visual */}
                <div style={{
                  width: "110px", height: "110px", borderRadius: "50%",
                  background: "radial-gradient(circle at 35% 35%, #fff 0%, #facc15 45%, #d97706 80%, #78350f 100%)",
                  boxShadow: "0 0 35px rgba(250, 204, 21, 0.6)",
                  position: "relative"
                }}>
                  <div style={{ position: "absolute", top: "18%", left: "22%", width: "24px", height: "14px", borderRadius: "50%", background: "rgba(255,255,255,0.7)", filter: "blur(2px)" }} />
                </div>
              </motion.div>

              {/* WIDGET CARD 2: SPARKLINE ANALYTICS CHART */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{
                  background: "rgba(255, 255, 255, 0.88)",
                  backdropFilter: "blur(24px)",
                  border: "1px solid rgba(255, 255, 255, 0.7)",
                  borderRadius: "28px",
                  padding: "24px 28px",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
                  height: "248px",
                  display: "flex",
                  flexDirection: "column",
                  justify: "space-between"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ textAlign: "left" }}>
                    <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#64748b", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                      SYNAPSE METRICS
                    </span>
                    <h4 style={{ fontSize: "1.8rem", fontWeight: 900, color: "#0f172a" }}>
                      {sparklineRange === "today" ? "13 / 37" : "84 / 210"}
                    </h4>
                  </div>
                  <div style={{ display: "flex", gap: "6px", background: "#f1efe7", padding: "4px", borderRadius: "999px" }}>
                    {["today", "week"].map((r) => (
                      <button
                        key={r}
                        onClick={() => setSparklineRange(r)}
                        style={{
                          padding: "4px 14px", borderRadius: "999px", border: "none",
                          fontSize: "0.72rem", fontWeight: 800, cursor: "pointer",
                          background: sparklineRange === r ? "#facc15" : "transparent",
                          color: sparklineRange === r ? "#0f172a" : "#64748b"
                        }}
                      >
                        {r.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Animated Glowing SVG Sparkline Curve Chart */}
                <div style={{ width: "100%", height: "90px", marginTop: "10px" }}>
                  <svg width="100%" height="100%" viewBox="0 0 300 80" fill="none">
                    <defs>
                      <linearGradient id="lightSparkGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#eab308" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#eab308" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d={sparklineRange === "today" 
                        ? "M 0 60 Q 50 10, 100 50 T 200 20 T 300 45 L 300 80 L 0 80 Z"
                        : "M 0 45 Q 60 70, 120 20 T 220 50 T 300 15 L 300 80 L 0 80 Z"
                      }
                      fill="url(#lightSparkGradient)"
                    />
                    <path
                      d={sparklineRange === "today"
                        ? "M 0 60 Q 50 10, 100 50 T 200 20 T 300 45"
                        : "M 0 45 Q 60 70, 120 20 T 220 50 T 300 15"
                      }
                      stroke="#d97706"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <circle cx="200" cy="20" r="5" fill="#facc15" stroke="#d97706" strokeWidth="2" />
                  </svg>
                </div>
              </motion.div>

            </div>
          </div>

          {/* BOTTOM ROW: 4 DASHBOARD CARDS GRID */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: "24px" }}>
            
            {/* CARD 1: DONUT BREAKDOWN */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{
                background: "rgba(255, 255, 255, 0.88)",
                backdropFilter: "blur(24px)",
                border: "1px solid rgba(255, 255, 255, 0.7)",
                borderRadius: "28px",
                padding: "24px",
                boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
                textAlign: "left"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#64748b", letterSpacing: "1px" }}>RESONANCE LOG</span>
                <Activity size={16} color="#d97706" />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                {/* SVG Donut Chart */}
                <div style={{ width: "100px", height: "100px", position: "relative" }}>
                  <svg width="100%" height="100%" viewBox="0 0 42 42">
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f1efe7" strokeWidth="5" />
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#facc15" strokeWidth="5" strokeDasharray="40 60" strokeDashoffset="25" />
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#a855f7" strokeWidth="5" strokeDasharray="30 70" strokeDashoffset="85" />
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="5" strokeDasharray="20 80" strokeDashoffset="55" />
                  </svg>
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", fontWeight: 900, color: "#0f172a" }}>
                    84%
                  </div>
                </div>

                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.78rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#d97706", fontWeight: 800 }}>• Voice Chat</span>
                    <span style={{ color: "#0f172a", fontWeight: 900 }}>40%</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#a855f7", fontWeight: 800 }}>• Creative</span>
                    <span style={{ color: "#0f172a", fontWeight: 900 }}>30%</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#10b981", fontWeight: 800 }}>• Calm Listen</span>
                    <span style={{ color: "#0f172a", fontWeight: 900 }}>20%</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* CARD 2: 3D PLANETS / SPHERES TONE SELECTOR */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              style={{
                background: "rgba(255, 255, 255, 0.88)",
                backdropFilter: "blur(24px)",
                border: "1px solid rgba(255, 255, 255, 0.7)",
                borderRadius: "28px",
                padding: "24px",
                boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
                textAlign: "left"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#64748b", letterSpacing: "1px" }}>NEURAL TONE SPHERES</span>
                <span style={{ fontSize: "0.75rem", color: activeToneObj.color, fontWeight: 900 }}>{activeToneObj.name}</span>
              </div>

              {/* 4 Interactive Spherical Orbs */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
                {tones.map((t) => {
                  const isSelected = activeTone === t.id;
                  return (
                    <motion.div
                      key={t.id}
                      whileHover={{ scale: 1.18, y: -4 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setActiveTone(t.id);
                        speakText(`Tone switched to ${t.name}`);
                      }}
                      style={{
                        width: isSelected ? "48px" : "38px",
                        height: isSelected ? "48px" : "38px",
                        borderRadius: "50%",
                        background: `radial-gradient(circle at 35% 35%, #fff 0%, ${t.color} 50%, #78350f 100%)`,
                        boxShadow: isSelected ? `0 0 25px ${t.shadow}, 0 0 10px ${t.color}` : "0 4px 12px rgba(0,0,0,0.1)",
                        cursor: "pointer",
                        border: isSelected ? "2px solid #0f172a" : "none",
                        transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)"
                      }}
                    />
                  );
                })}
              </div>
              <p style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "16px", lineHeight: 1.4, fontWeight: 600 }}>
                {activeToneObj.desc}
              </p>
            </motion.div>

            {/* CARD 3: AUTUMN VALLEY VISTA CARD (CLICK TO SWITCH HERO IMAGE) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setCurrentHeroImg("/valley.png")}
              style={{
                borderRadius: "28px",
                height: "180px",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
                border: "2px solid " + (currentHeroImg === "/valley.png" ? "#facc15" : "rgba(234, 179, 8, 0.2)"),
                backgroundImage: "url('/valley.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                justify: "space-between",
                padding: "20px"
              }}
            >
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.75) 100%)" }} />
              <div style={{ position: "relative", zIndex: 10, textAlign: "left" }}>
                <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "#facc15", letterSpacing: "1px", textTransform: "uppercase" }}>VISTA 01 • CLICK TO VIEW</span>
                <h4 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#fff" }}>Autumn Valley</h4>
              </div>
              <div style={{ position: "relative", zIndex: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "1.3rem", fontWeight: 900, color: "#fff" }}>37</span>
                <span style={{ fontSize: "1.3rem", fontWeight: 900, color: "#facc15" }}>570</span>
              </div>
            </motion.div>

            {/* CARD 4: SUNSET RIDGE VISTA CARD (CLICK TO SWITCH HERO IMAGE) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setCurrentHeroImg("/ridge.png")}
              style={{
                borderRadius: "28px",
                height: "180px",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
                border: "2px solid " + (currentHeroImg === "/ridge.png" ? "#facc15" : "rgba(234, 179, 8, 0.2)"),
                backgroundImage: "url('/ridge.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                justify: "space-between",
                padding: "20px"
              }}
            >
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.75) 100%)" }} />
              <div style={{ position: "relative", zIndex: 10, textAlign: "left" }}>
                <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "#facc15", letterSpacing: "1px", textTransform: "uppercase" }}>VISTA 02 • CLICK TO VIEW</span>
                <h4 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#fff" }}>Sunset Ridge</h4>
              </div>
              <div style={{ position: "relative", zIndex: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "1.3rem", fontWeight: 900, color: "#fff" }}>20</span>
                <span style={{ fontSize: "1.3rem", fontWeight: 900, color: "#facc15" }}>30</span>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Global Footer */}
        <footer style={{ 
          textAlign: "center", padding: "40px 20px", marginTop: "60px",
          borderTop: "1px solid rgba(255, 255, 255, 0.6)",
          background: "rgba(255, 255, 255, 0.45)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 -10px 30px rgba(0, 0, 0, 0.03)"
        }}>
          <p style={{ fontSize: "0.85rem", color: "#0f172a", fontWeight: 700 }}>
            &copy; 2026 Friday AI. Clean White & Golden Yellow Real-Time Dashboard.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Home;