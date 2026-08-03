import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, Mic, Sparkles, Shield, ArrowRight, Heart, Smile, 
  Sun, Moon, Cloud, Thermometer, Compass, Activity, ChevronRight,
  TrendingUp, BarChart2, Cpu, Zap, Lock, Volume2, VolumeX, RefreshCw,
  Layers, Monitor, Sliders, CheckCircle2, Star, Users, Award, Play, Check, Eye
} from "lucide-react";
import FridayLogo from "./FridayLogo.jsx";

// Realistic Unsplash Photographic Assets
const REALISTIC_ENVIRONMENTS = [
  {
    id: "alpine",
    name: "Alpine Mirror Lake",
    subtitle: "Crisp mountain serenity & crystal waters",
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=85",
    accent: "#38bdf8",
    tag: "NATURE 01"
  },
  {
    id: "autumn",
    name: "Autumn Valley Road",
    subtitle: "Golden hour foliage & deep reflection",
    img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1600&q=80",
    accent: "#f59e0b",
    tag: "NATURE 02"
  },
  {
    id: "ridge",
    name: "Sunset Mountain Ridge",
    subtitle: "Panoramic twilight peaks & warm horizon",
    img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80",
    accent: "#facc15",
    tag: "NATURE 03"
  },
  {
    id: "architect",
    name: "Modern Studio Loft",
    subtitle: "Minimalist concrete, warm glass & desk space",
    img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80",
    accent: "#10b981",
    tag: "INTERIOR 01"
  },
  {
    id: "nordic",
    name: "Nordic Mist Canopy",
    subtitle: "Quiet morning fog through evergreen pines",
    img: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1600&q=80",
    accent: "#a855f7",
    tag: "FOREST 01"
  },
  {
    id: "coastal",
    name: "Pacific Horizon Dusk",
    subtitle: "Calming ocean waves & pastel sunset glow",
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
    accent: "#ec4899",
    tag: "COASTAL 01"
  }
];

const USE_CASES = [
  {
    title: "Voice-Driven Command & Micro-Actions",
    desc: "Speak naturally in your local environment. Friday parses high-level speech into structured task executions, live context switching, and automated notes instantly.",
    img: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=80",
    badge: "Voice Synthesizer",
    stat: "12ms Response"
  },
  {
    title: "Deep Work & Daily Focus Flow",
    desc: "Maintain unbroken concentration with AI-orchestrated environment atmospheric presets, quiet focus tokens, and intelligent task prioritization.",
    img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    badge: "Focus Engine",
    stat: "+3.4 hrs Saved"
  },
  {
    title: "Creative Synthesis & Design Thinking",
    desc: "Brainstorm complex software architectures, visual concepts, or editorial copy with neural tone spheres tailored for high-speed creative output.",
    img: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=1200&q=80",
    badge: "Neural Studio",
    stat: "Multi-Modal"
  },
  {
    title: "Seamless Context & Device Sync",
    desc: "Your preferences, atmospheric themes, and ongoing assistant memories stay synced in real time across mobile, laptop, and studio setups.",
    img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80",
    badge: "Unified Cloud",
    stat: "99.9% Uptime"
  }
];

const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    role: "Principal Product Architect @ Solana Labs",
    quote: "Friday's real-time voice response and natural atmospheric customization completely changed my daily workflow. It feels like stepping into a modern, serene workspace.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    rating: 5
  },
  {
    name: "Marcus Vance",
    role: "Creative Director @ Studio Monochrome",
    quote: "The realistic photographic environment backgrounds paired with neural speech tones create an unmatched ambiance. It makes AI feel deeply human and calming.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    rating: 5
  },
  {
    name: "Elena Rostova",
    role: "Lead Machine Learning Engineer",
    quote: "Unlike generic AI dashboards with synthetic art, Friday uses authentic real-world photography and fluid UI state transitions. Unbelievably crisp performance.",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
    rating: 5
  }
];

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

  // Hero Background Image Switcher State (Default: Alpine Lake Photo)
  const [currentEnvObj, setCurrentEnvObj] = useState(REALISTIC_ENVIRONMENTS[0]);

  // Background Image Visibility Mode: "vivid" (ultra clear) or "soft" (frosted glass)
  const [bgVisibilityMode, setBgVisibilityMode] = useState("vivid");

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
    { type: "ai", text: "Hello! Friday AI is online in Alpine Lake mode. How can I assist your workflow today?" }
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
      const aiReply = `Acknowledged. Processing "${userMsg}" in ${activeToneObj.name} mode. Sync complete!`;
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

  // Dynamic Background Overlay Styles depending on bgVisibilityMode
  const backgroundOverlayGradient = bgVisibilityMode === "vivid"
    ? `linear-gradient(180deg, rgba(15, 23, 42, 0.12) 0%, rgba(15, 23, 42, 0.28) 100%), url('${currentEnvObj.img}')`
    : `linear-gradient(180deg, rgba(250, 249, 245, 0.48) 0%, rgba(250, 249, 245, 0.65) 100%), url('${currentEnvObj.img}')`;

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
        justify: "space-between",
        backgroundImage: backgroundOverlayGradient,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)"
      }}
    >
      {/* Ambient Radial Glow */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          background: `radial-gradient(circle at 50% 15%, ${currentEnvObj.accent}30 0%, transparent 75%)`
        }}
      />

      <div style={{ position: "relative", zIndex: 10 }}>
        {/* Header Navigation */}
        <header
          style={{
            display: "flex",
            justify: "space-between",
            alignItems: "center",
            padding: "18px clamp(20px, 4vw, 60px)",
            backdropFilter: "blur(24px)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.4)",
            position: "sticky",
            top: 0,
            zIndex: 100,
            background: bgVisibilityMode === "vivid" ? "rgba(255, 255, 255, 0.82)" : "rgba(255, 255, 255, 0.92)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.06)"
          }}
        >
          <div onClick={() => navigate("/")} data-cursor="FRIDAY" style={{ cursor: "pointer" }}>
            <FridayLogo size="1.4rem" color="#0f172a" />
          </div>

          {/* Controls: Environment Active Indicator + Background Image Visibility Switcher */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            {/* Background Visibility Toggle */}
            <button
              onClick={() => setBgVisibilityMode(prev => prev === "vivid" ? "soft" : "vivid")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: bgVisibilityMode === "vivid" ? "linear-gradient(135deg, #facc15 0%, #f59e0b 100%)" : "rgba(255,255,255,0.9)",
                border: "1px solid rgba(0,0,0,0.1)",
                color: "#0f172a",
                padding: "6px 16px",
                borderRadius: "999px",
                fontSize: "0.8rem",
                fontWeight: 800,
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                transition: "all 0.25s ease"
              }}
            >
              <Eye size={14} />
              Wallpaper: {bgVisibilityMode === "vivid" ? "Vivid Clear" : "Soft Focus"}
            </button>

            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "8px", 
              background: "rgba(255, 255, 255, 0.92)", 
              padding: "6px 16px", 
              borderRadius: "999px", 
              border: `1px solid ${currentEnvObj.accent}50`,
              boxShadow: "0 4px 14px rgba(0,0,0,0.05)"
            }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: currentEnvObj.accent, boxShadow: `0 0 10px ${currentEnvObj.accent}` }} />
              <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "#0f172a" }}>{currentEnvObj.name}</span>
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
              <button className="btn-primary" data-cursor="START" style={{ padding: "9px 24px", fontSize: "0.88rem", display: "flex", alignItems: "center", gap: "6px" }}>
                Get Started <ArrowRight size={15} />
              </button>
            </Link>
          </div>
        </header>

        {/* MAIN DASHBOARD CONTAINER */}
        <div style={{ maxWidth: "1400px", margin: "32px auto 0", padding: "0 clamp(16px, 3vw, 40px)" }}>
          
          {/* TOP ROW: REALISTIC HERO LANDSCAPE WINDOW + TOP-RIGHT STACKED CARDS */}
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 2.3fr) minmax(0, 1fr)", gap: "24px", marginBottom: "36px" }}>
            
            {/* MAIN LANDSCAPE HERO WINDOW WITH ULTRA VIVID REAL PHOTOGRAPHY */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              style={{
                borderRadius: "32px",
                height: "520px",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 30px 70px rgba(0,0,0,0.18)",
                border: "2px solid rgba(255, 255, 255, 0.9)",
                backgroundImage: `url('${currentEnvObj.img}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                transition: "background-image 0.6s cubic-bezier(0.16, 1, 0.3, 1)"
              }}
            >
              {/* Subtle overlay gradient for high readability while keeping image fully visible */}
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.2) 50%, rgba(15,23,42,0.8) 100%)"
              }} />

              {/* TOP-LEFT REAL PHOTO ENVIRONMENT BADGE OVERLAY */}
              <div style={{
                position: "absolute", top: "20px", left: "20px",
                background: "rgba(15, 23, 42, 0.72)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                borderRadius: "999px",
                padding: "8px 18px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                color: "#fff"
              }}>
                <Sparkles size={14} color={currentEnvObj.accent} />
                <span style={{ fontSize: "0.78rem", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase" }}>
                  {currentEnvObj.tag} • REAL PHOTOGRAPHY
                </span>
              </div>

              {/* TOP-RIGHT FLOATING GLASS WEATHER & REALTIME CLOCK WIDGET OVERLAY */}
              <div style={{
                position: "absolute", top: "20px", right: "20px",
                background: "rgba(255, 255, 255, 0.94)",
                backdropFilter: "blur(24px)",
                border: "1px solid rgba(234, 179, 8, 0.35)",
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
                    <p style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: 800, textTransform: "uppercase" }}>ATMOSPHERIC PRESET</p>
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
                <div style={{ marginBottom: "12px", display: "flex", flexDirection: "column", gap: "8px", maxWidth: "540px" }}>
                  {heroMessages.slice(-2).map((m, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        alignSelf: m.type === "user" ? "flex-end" : "flex-start",
                        background: m.type === "user" ? "linear-gradient(135deg, #facc15 0%, #f59e0b 100%)" : "rgba(255, 255, 255, 0.95)",
                        color: "#0f172a",
                        padding: "12px 20px",
                        borderRadius: m.type === "user" ? "18px 18px 2px 18px" : "18px 18px 18px 2px",
                        fontSize: "0.9rem",
                        fontWeight: m.type === "user" ? 800 : 600,
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(255, 255, 255, 0.4)",
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
                    background: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid rgba(234, 179, 8, 0.35)",
                    borderRadius: "999px", padding: "8px 12px 8px 22px",
                    backdropFilter: "blur(30px)",
                    boxShadow: "0 15px 40px rgba(0,0,0,0.18)"
                  }}
                >
                  <input
                    type="text"
                    placeholder="Ask Friday anything... (e.g. Set up a deep focus block)"
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
                  background: bgVisibilityMode === "vivid" ? "rgba(255, 255, 255, 0.82)" : "rgba(255, 255, 255, 0.92)",
                  backdropFilter: "blur(24px)",
                  border: "1px solid rgba(255, 255, 255, 0.85)",
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
                  background: bgVisibilityMode === "vivid" ? "rgba(255, 255, 255, 0.82)" : "rgba(255, 255, 255, 0.92)",
                  backdropFilter: "blur(24px)",
                  border: "1px solid rgba(255, 255, 255, 0.85)",
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

                {/* SVG Sparkline Curve Chart */}
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

          {/* SECTION 1: REALISTIC ATMOSPHERIC PHOTO GALLERIES (DYNAMIC WALLPAPER SWITCHER) */}
          <section style={{ marginBottom: "50px", textAlign: "left" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "20px" }}>
              <div>
                <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#d97706", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                  CURATED REAL-WORLD ENVIRONMENTS
                </span>
                <h2 style={{ fontSize: "1.8rem", fontWeight: 900, color: bgVisibilityMode === "vivid" ? "#ffffff" : "#0f172a", marginTop: "4px", textShadow: bgVisibilityMode === "vivid" ? "0 2px 10px rgba(0,0,0,0.5)" : "none" }}>
                  Select an Atmospheric Wallpaper
                </h2>
              </div>
              <p style={{ fontSize: "0.88rem", color: bgVisibilityMode === "vivid" ? "rgba(255,255,255,0.9)" : "#64748b", fontWeight: 600, maxWidth: "420px", margin: 0, textShadow: bgVisibilityMode === "vivid" ? "0 1px 6px rgba(0,0,0,0.4)" : "none" }}>
                Click any realistic photograph below to dynamically transform the active homepage theme and memory backdrop.
              </p>
            </div>

            {/* 6 REAL PHOTO CARDS GRID WITH HIGH IMAGE VISIBILITY */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
              {REALISTIC_ENVIRONMENTS.map((env) => {
                const isActive = currentEnvObj.id === env.id;
                return (
                  <motion.div
                    key={env.id}
                    whileHover={{ scale: 1.04, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCurrentEnvObj(env)}
                    style={{
                      borderRadius: "22px",
                      height: "175px",
                      position: "relative",
                      overflow: "hidden",
                      boxShadow: isActive ? `0 12px 30px ${env.accent}60` : "0 8px 24px rgba(0,0,0,0.12)",
                      border: isActive ? `3px solid ${env.accent}` : "1.5px solid rgba(255,255,255,0.9)",
                      backgroundImage: `url('${env.img}')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      justify: "space-between",
                      padding: "16px",
                      transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
                    }}
                  >
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%)" }} />
                    
                    <div style={{ position: "relative", zIndex: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.65rem", fontWeight: 900, color: "#fff", background: "rgba(0,0,0,0.5)", padding: "3px 9px", borderRadius: "999px", letterSpacing: "1px" }}>
                        {env.tag}
                      </span>
                      {isActive && (
                        <div style={{ background: env.accent, width: "22px", height: "22px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Check size={13} color="#0f172a" strokeWidth={3} />
                        </div>
                      )}
                    </div>

                    <div style={{ position: "relative", zIndex: 10, textAlign: "left" }}>
                      <h4 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#fff", margin: 0 }}>{env.name}</h4>
                      <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.85)", margin: "4px 0 0 0", lineHeight: 1.2 }}>{env.subtitle}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* SECTION 2: "AI IN REAL LIFE" USE CASES & WORKSPACES */}
          <section style={{ marginBottom: "60px", textAlign: "left" }}>
            <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto 40px" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#d97706", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                REAL-WORLD PRODUCTIVITY
              </span>
              <h2 style={{ fontSize: "2.2rem", fontWeight: 900, color: bgVisibilityMode === "vivid" ? "#ffffff" : "#0f172a", marginTop: "6px", textShadow: bgVisibilityMode === "vivid" ? "0 2px 10px rgba(0,0,0,0.5)" : "none" }}>
                Designed for Authentic Human Workflows
              </h2>
              <p style={{ fontSize: "0.95rem", color: bgVisibilityMode === "vivid" ? "rgba(255,255,255,0.9)" : "#64748b", marginTop: "10px", lineHeight: 1.6, textShadow: bgVisibilityMode === "vivid" ? "0 1px 6px rgba(0,0,0,0.4)" : "none" }}>
                Experience an AI voice companion built for real desks, studio setups, and deep focus sessions—not synthetic abstract concepts.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
              {USE_CASES.map((uc, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -6 }}
                  style={{
                    background: bgVisibilityMode === "vivid" ? "rgba(255, 255, 255, 0.85)" : "rgba(255, 255, 255, 0.94)",
                    backdropFilter: "blur(24px)",
                    borderRadius: "28px",
                    overflow: "hidden",
                    border: "1px solid rgba(255, 255, 255, 0.9)",
                    boxShadow: "0 20px 45px rgba(0,0,0,0.1)",
                    display: "flex",
                    flexDirection: "column"
                  }}
                >
                  {/* REAL PHOTOGRAPHY HEADER IMAGE - ULTRA HIGH VISIBILITY */}
                  <div style={{
                    height: "200px",
                    backgroundImage: `url('${uc.img}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    position: "relative"
                  }}>
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.55) 100%)" }} />
                    <div style={{
                      position: "absolute", bottom: "14px", left: "16px", right: "16px",
                      display: "flex", justifyContent: "space-between", alignItems: "center"
                    }}>
                      <span style={{ background: "rgba(255,255,255,0.95)", color: "#0f172a", fontSize: "0.72rem", fontWeight: 800, padding: "4px 12px", borderRadius: "999px" }}>
                        {uc.badge}
                      </span>
                      <span style={{ background: "#facc15", color: "#0f172a", fontSize: "0.72rem", fontWeight: 900, padding: "4px 12px", borderRadius: "999px" }}>
                        {uc.stat}
                      </span>
                    </div>
                  </div>

                  <div style={{ padding: "24px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", marginBottom: "8px" }}>
                        {uc.title}
                      </h3>
                      <p style={{ fontSize: "0.85rem", color: "#475569", lineHeight: 1.55, margin: 0 }}>
                        {uc.desc}
                      </p>
                    </div>
                    <div style={{ marginTop: "20px", paddingTop: "14px", borderTop: "1px solid rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: "6px", color: "#d97706", fontSize: "0.82rem", fontWeight: 800, cursor: "pointer" }}>
                      Explore Capability <ChevronRight size={14} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* BOTTOM ROW: 4 ORIGINAL DASHBOARD CARDS GRID */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: "24px", marginBottom: "60px" }}>
            
            {/* CARD 1: DONUT BREAKDOWN */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{
                background: bgVisibilityMode === "vivid" ? "rgba(255, 255, 255, 0.85)" : "rgba(255, 255, 255, 0.92)",
                backdropFilter: "blur(24px)",
                border: "1px solid rgba(255, 255, 255, 0.85)",
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
                background: bgVisibilityMode === "vivid" ? "rgba(255, 255, 255, 0.85)" : "rgba(255, 255, 255, 0.92)",
                backdropFilter: "blur(24px)",
                border: "1px solid rgba(255, 255, 255, 0.85)",
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

            {/* CARD 3: REAL PHOTO VISTA CARD 1 (AUTUMN VALLEY) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setCurrentEnvObj(REALISTIC_ENVIRONMENTS[1])}
              style={{
                borderRadius: "28px",
                height: "180px",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 15px 40px rgba(0,0,0,0.12)",
                border: "2px solid " + (currentEnvObj.id === "autumn" ? "#facc15" : "rgba(255,255,255,0.9)"),
                backgroundImage: `url('${REALISTIC_ENVIRONMENTS[1].img}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                justify: "space-between",
                padding: "20px"
              }}
            >
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.7) 100%)" }} />
              <div style={{ position: "relative", zIndex: 10, textAlign: "left" }}>
                <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "#facc15", letterSpacing: "1px", textTransform: "uppercase" }}>REAL VISTA • CLICK TO ACTIVATE</span>
                <h4 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#fff" }}>Autumn Valley</h4>
              </div>
              <div style={{ position: "relative", zIndex: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "1.2rem", fontWeight: 900, color: "#fff" }}>37 Active</span>
                <span style={{ fontSize: "1.2rem", fontWeight: 900, color: "#facc15" }}>570 Tokens</span>
              </div>
            </motion.div>

            {/* CARD 4: REAL PHOTO VISTA CARD 2 (SUNSET RIDGE) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setCurrentEnvObj(REALISTIC_ENVIRONMENTS[2])}
              style={{
                borderRadius: "28px",
                height: "180px",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 15px 40px rgba(0,0,0,0.12)",
                border: "2px solid " + (currentEnvObj.id === "ridge" ? "#facc15" : "rgba(255,255,255,0.9)"),
                backgroundImage: `url('${REALISTIC_ENVIRONMENTS[2].img}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                justify: "space-between",
                padding: "20px"
              }}
            >
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.7) 100%)" }} />
              <div style={{ position: "relative", zIndex: 10, textAlign: "left" }}>
                <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "#facc15", letterSpacing: "1px", textTransform: "uppercase" }}>REAL VISTA • CLICK TO ACTIVATE</span>
                <h4 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#fff" }}>Sunset Ridge</h4>
              </div>
              <div style={{ position: "relative", zIndex: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "1.2rem", fontWeight: 900, color: "#fff" }}>20 Active</span>
                <span style={{ fontSize: "1.2rem", fontWeight: 900, color: "#facc15" }}>300 Tokens</span>
              </div>
            </motion.div>

          </div>

          {/* SECTION 3: TESTIMONIALS & REAL USER SHOWCASE */}
          <section style={{ marginBottom: "70px", textAlign: "left" }}>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#d97706", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                COMMUNITY & BUILDERS
              </span>
              <h2 style={{ fontSize: "2rem", fontWeight: 900, color: bgVisibilityMode === "vivid" ? "#ffffff" : "#0f172a", marginTop: "6px", textShadow: bgVisibilityMode === "vivid" ? "0 2px 10px rgba(0,0,0,0.5)" : "none" }}>
                Loved by Creators, Engineers & Founders
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
              {TESTIMONIALS.map((t, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  style={{
                    background: bgVisibilityMode === "vivid" ? "rgba(255, 255, 255, 0.88)" : "rgba(255, 255, 255, 0.94)",
                    backdropFilter: "blur(24px)",
                    borderRadius: "24px",
                    padding: "28px",
                    border: "1px solid rgba(255, 255, 255, 0.85)",
                    boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
                    display: "flex",
                    flexDirection: "column",
                    justify: "space-between"
                  }}
                >
                  <div>
                    <div style={{ display: "flex", gap: "4px", marginBottom: "14px" }}>
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} size={15} fill="#facc15" color="#facc15" />
                      ))}
                    </div>
                    <p style={{ fontSize: "0.92rem", color: "#334155", lineHeight: 1.6, fontStyle: "italic", margin: 0 }}>
                      "{t.quote}"
                    </p>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "14px", marginTop: "24px", paddingTop: "18px", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                    <img
                      src={t.avatar}
                      alt={t.name}
                      style={{ width: "46px", height: "46px", borderRadius: "50%", objectFit: "cover", border: "2px solid #facc15" }}
                    />
                    <div>
                      <h4 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>{t.name}</h4>
                      <p style={{ fontSize: "0.75rem", color: "#64748b", margin: 0, fontWeight: 600 }}>{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* SECTION 4: HIGH-IMPACT GLASSMORPHIC CALL TO ACTION */}
          <motion.section
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            style={{
              borderRadius: "32px",
              padding: "60px 40px",
              position: "relative",
              overflow: "hidden",
              backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1800&q=80')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              marginBottom: "40px",
              boxShadow: "0 25px 60px rgba(0,0,0,0.18)",
              color: "#fff",
              textAlign: "center"
            }}
          >
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(15,23,42,0.88) 0%, rgba(30,41,59,0.78) 100%)" }} />

            <div style={{ position: "relative", zIndex: 10, maxWidth: "640px", margin: "0 auto" }}>
              <span style={{ fontSize: "0.78rem", fontWeight: 900, color: "#facc15", letterSpacing: "2px", textTransform: "uppercase" }}>
                READY FOR FRIDAY AI?
              </span>
              <h2 style={{ fontSize: "2.6rem", fontWeight: 900, marginTop: "8px", marginBottom: "16px", color: "#fff", lineHeight: 1.2 }}>
                Elevate Your Workspace with Realistic AI Intelligence
              </h2>
              <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.85)", marginBottom: "32px", lineHeight: 1.6 }}>
                Join thousands of creators using Friday's real-time voice, atmospheric background themes, and intelligent task synthesis.
              </p>

              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                <Link to="/signup" style={{ textDecoration: "none" }}>
                  <button className="btn-primary" style={{ padding: "14px 36px", fontSize: "1rem", borderRadius: "999px", display: "flex", alignItems: "center", gap: "8px" }}>
                    Get Started Free <ArrowRight size={18} />
                  </button>
                </Link>
                <button
                  onClick={toggleMic}
                  style={{
                    padding: "14px 28px",
                    borderRadius: "999px",
                    background: "rgba(255,255,255,0.18)",
                    border: "1px solid rgba(255,255,255,0.35)",
                    color: "#fff",
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    backdropFilter: "blur(20px)",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                >
                  <Mic size={18} color="#facc15" /> Try Voice Mic
                </button>
              </div>

              <div style={{ display: "flex", justifyContent: "center", gap: "24px", marginTop: "32px", fontSize: "0.8rem", color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><CheckCircle2 size={14} color="#10b981" /> No Credit Card Required</span>
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><CheckCircle2 size={14} color="#10b981" /> Real-time Speech Sync</span>
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><CheckCircle2 size={14} color="#10b981" /> Curated Photo Wallpapers</span>
              </div>
            </div>
          </motion.section>

        </div>

        {/* Global Footer */}
        <footer style={{ 
          textAlign: "center", padding: "40px 20px", marginTop: "40px",
          borderTop: "1px solid rgba(255, 255, 255, 0.4)",
          background: "rgba(255, 255, 255, 0.65)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 -10px 30px rgba(0, 0, 0, 0.03)"
        }}>
          <p style={{ fontSize: "0.85rem", color: "#0f172a", fontWeight: 700 }}>
            &copy; 2026 Friday AI. Clean White & Golden Yellow Real-Time Dashboard. Realistic Photographic Themes.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Home;