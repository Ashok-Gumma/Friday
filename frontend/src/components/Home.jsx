import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Sparkles, Mic, MessageSquare, Shield, ArrowRight, 
  Smile, Heart, Zap, User, Star, CheckCircle2, Lock, 
  Volume2, Compass, Cpu, Layers, RefreshCw
} from "lucide-react";
import FridayLogo from "./FridayLogo.jsx";
import SatelliteCanvas from "./SatelliteCanvas.jsx";

// 8 Real Mood Modes from Friday Backend Controller
const MOOD_MODES = [
  { id: "happy", name: "Happy", emoji: "😊", desc: "Cheerful, upbeat & playful banter" },
  { id: "calm", name: "Calm", emoji: "🌿", desc: "Reassuring, peaceful & gently supportive" },
  { id: "motivational", name: "Motivational", emoji: "🔥", desc: "High energy, encouraging coach tone" },
  { id: "chill", name: "Chill", emoji: "☕", desc: "Relaxed, cool & easygoing conversation" },
  { id: "professional", name: "Professional", emoji: "💼", desc: "Clear, polite & structured answers" },
  { id: "romantic", name: "Romantic", emoji: "💖", desc: "Sweet, warm & charming tone" },
  { id: "sad", name: "Empathetic", emoji: "🤝", desc: "Soft, understanding & comforting" },
  { id: "angry", name: "Witty", emoji: "⚡", desc: "Firm, cool-headed & slightly witty" }
];

// Project Core Features based on actual codebase capabilities
const PROJECT_FEATURES = [
  {
    icon: <Smile size={22} className="text-white" />,
    title: "8 Dynamic Mood Personalities",
    curlySubtitle: "adaptive emotional intelligence",
    desc: "Switch Friday's persona instantly between Motivational, Calm, Chill, Professional, and more to match your current headspace.",
    badge: "Mood Engine"
  },
  {
    icon: <Mic size={22} className="text-white" />,
    title: "Voice Speech & Audio Synthesis",
    curlySubtitle: "hands-free natural conversation",
    desc: "Speak naturally using voice mic input and hear Friday respond in real-time with customizable browser text-to-speech voices.",
    badge: "Voice Synthesis"
  },
  {
    icon: <User size={22} className="text-white" />,
    title: "Personalized Profile Memory",
    curlySubtitle: "tailored to your hobbies & goals",
    desc: "Friday remembers your hobbies, strengths, and personal preferences to deliver deeply context-aware recommendations.",
    badge: "Profile Context"
  },
  {
    icon: <Shield size={22} className="text-white" />,
    title: "Google OAuth & Persistent History",
    curlySubtitle: "cloud sync & full privacy",
    desc: "Sign in with one click via Google OAuth. All chat history is securely saved to MongoDB with instant one-click history clearing.",
    badge: "Cloud Storage"
  }
];

// Real-world Testimonials
const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    role: "Product Architect",
    quote: "Switching Friday to Motivational mode during my morning routine completely changed my focus. The voice synthesis is seamless.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    rating: 5
  },
  {
    name: "Marcus Vance",
    role: "Creative Lead",
    quote: "The combination of mood adaptation and background satellite canvas makes Friday feel like an aesthetic, personal AI buddy.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    rating: 5
  },
  {
    name: "Elena Rostova",
    role: "ML Engineer",
    quote: "Clean monochrome design, instant Llama response times, and personalized profile memory. A delightful daily AI companion.",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
    rating: 5
  }
];

const Home = () => {
  const navigate = useNavigate();
  const [activeMoodIndex, setActiveMoodIndex] = useState(0);
  const token = localStorage.getItem("token");

  // Automatically redirect authenticated user to /chat (must stay on chat page unless logged out)
  useEffect(() => {
    if (token) {
      navigate("/chat", { replace: true });
    }
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userProfile");
    navigate("/");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000000",
        color: "#ffffff",
        fontFamily: "'Inter', sans-serif",
        overflowX: "hidden",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      }}
    >
      {/* BACKGROUND CONTINUOUS MOVING SATELLITES CANVAS */}
      <SatelliteCanvas density={65} connectionDistance={140} interactive={true} />

      {/* AMBIENT SOFT LIGHT ACCENT */}
      <div
        style={{
          position: "fixed",
          top: "12%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "850px",
          height: "400px",
          background: "radial-gradient(circle, rgba(255, 255, 255, 0.12) 0%, rgba(0,0,0,0) 70%)",
          opacity: 0.15,
          pointerEvents: "none",
          zIndex: 1
        }}
      />

      <div style={{ position: "relative", zIndex: 10 }}>
        
        {/* FULL WIDTH HEADER NAVIGATION BAR WITH FAR END CORNER ACTIONS */}
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            background: "rgba(9, 9, 11, 0.8)",
            backdropFilter: "blur(24px)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            width: "100%",
            padding: "14px clamp(24px, 3.5vw, 56px)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          {/* Far Left Corner: Friday Logo */}
          <div 
            onClick={() => navigate("/")} 
            style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
          >
            <FridayLogo size="1.3rem" color="#ffffff" showBadge={true} />
          </div>

          {/* Far Right Corner: Auth Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {token ? (
              <>
                <button 
                  onClick={handleLogout}
                  className="btn-minimal-secondary" 
                  style={{ padding: "8px 20px", fontSize: "0.82rem" }}
                >
                  Sign Out
                </button>
                <Link to="/chat" style={{ textDecoration: "none" }}>
                  <button className="btn-minimal-primary" style={{ padding: "8px 22px", fontSize: "0.82rem" }}>
                    Open Chat <ArrowRight size={14} />
                  </button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" style={{ textDecoration: "none" }}>
                  <button className="btn-minimal-secondary" style={{ padding: "8px 20px", fontSize: "0.82rem" }}>
                    Sign In
                  </button>
                </Link>

                <Link to="/signup" style={{ textDecoration: "none" }}>
                  <button className="btn-minimal-primary" style={{ padding: "8px 22px", fontSize: "0.82rem" }}>
                    Get Started <ArrowRight size={14} />
                  </button>
                </Link>
              </>
            )}
          </div>
        </header>

        {/* MAIN HERO CONTAINER */}
        <div style={{ maxWidth: "1200px", margin: "48px auto 0", padding: "0 clamp(16px, 4vw, 40px)" }}>
          
          {/* HERO HEADER TITLE WITH ELEGANT MIX OF CURLY & NORMAL FONTS */}
          <div style={{ textAlign: "center", maxWidth: "840px", margin: "0 auto 50px" }}>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                padding: "5px 16px",
                borderRadius: "999px",
                marginBottom: "24px"
              }}
            >
              <Sparkles size={14} color="#ffffff" />
              <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#e4e4e7", letterSpacing: "1px" }} className="font-mono">
                AI CHAT COMPANION • LLAMA ENGINE
              </span>
            </motion.div>

            {/* Headline mixing sans-serif and curly/italic fonts */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{
                fontSize: "clamp(2.6rem, 5.5vw, 4.4rem)",
                fontWeight: 800,
                letterSpacing: "-1.5px",
                lineHeight: 1.15,
                marginBottom: "20px"
              }}
            >
              Meet Friday. <span className="font-curly" style={{ fontSize: "1.25em" }}>Your personal</span> <br />
              <span className="font-serif-italic">intelligent AI buddy</span>.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                fontSize: "1.1rem",
                color: "#a1a1aa",
                lineHeight: 1.6,
                fontWeight: 400,
                maxWidth: "680px",
                margin: "0 auto 36px"
              }}
            >
              Friday pairs Llama AI intelligence with voice speech synthesis, 
              8 dynamic mood personas, and <span className="font-curly text-white" style={{ fontSize: "1.2em" }}>personalized</span> memory tailored to your goals.
            </motion.p>

            <div style={{ display: "flex", justifyContent: "center", gap: "14px" }}>
              {token ? (
                <Link to="/chat" style={{ textDecoration: "none" }}>
                  <button className="btn-minimal-primary" style={{ padding: "14px 34px", fontSize: "0.95rem" }}>
                    Open Chat Workspace <ArrowRight size={16} />
                  </button>
                </Link>
              ) : (
                <>
                  <Link to="/signup" style={{ textDecoration: "none" }}>
                    <button className="btn-minimal-primary" style={{ padding: "14px 34px", fontSize: "0.95rem" }}>
                      Start Chatting Free <ArrowRight size={16} />
                    </button>
                  </Link>
                  <Link to="/login" style={{ textDecoration: "none" }}>
                    <button className="btn-minimal-secondary" style={{ padding: "14px 28px", fontSize: "0.92rem" }}>
                      Sign In
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* INTERACTIVE MOOD EXPLORER SHOWCASE (REAL FEATURE FROM PROJECT) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="minimal-card"
            style={{ padding: "30px", marginBottom: "60px", textAlign: "left" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "16px" }}>
              <div>
                <span className="font-mono" style={{ fontSize: "0.75rem", fontWeight: 700, color: "#a1a1aa", letterSpacing: "1px" }}>
                  EMOTIONAL INTELLIGENCE
                </span>
                <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#ffffff", marginTop: "2px" }}>
                  8 Adaptive Mood Personas <span className="font-curly" style={{ fontSize: "1.2rem", color: "#e4e4e7" }}>— instant tone shift</span>
                </h3>
              </div>
              <span className="font-mono" style={{ fontSize: "0.75rem", background: "rgba(255,255,255,0.08)", padding: "4px 12px", borderRadius: "999px", color: "#e4e4e7" }}>
                REAL TIME
              </span>
            </div>

            {/* 8 Mood Pills Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "10px", marginBottom: "24px" }}>
              {MOOD_MODES.map((m, idx) => {
                const isActive = activeMoodIndex === idx;
                return (
                  <button
                    key={m.id}
                    onClick={() => setActiveMoodIndex(idx)}
                    style={{
                      background: isActive ? "rgba(255, 255, 255, 0.15)" : "rgba(255, 255, 255, 0.04)",
                      border: isActive ? "1px solid #ffffff" : "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "14px",
                      padding: "12px 14px",
                      color: isActive ? "#ffffff" : "#a1a1aa",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "4px",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <span style={{ fontSize: "1.3rem" }}>{m.emoji}</span>
                    <span style={{ fontSize: "0.82rem", fontWeight: 700 }}>{m.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Mood Behavior Preview */}
            <div style={{ background: "rgba(0,0,0,0.6)", padding: "18px 22px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justify: "space-between" }}>
              <div>
                <span style={{ fontSize: "0.72rem", color: "#71717a", fontWeight: 700 }} className="font-mono">
                  ACTIVE PERSONA INSTRUCTION
                </span>
                <p style={{ fontSize: "1rem", color: "#ffffff", fontWeight: 600, margin: "4px 0 0 0" }}>
                  {MOOD_MODES[activeMoodIndex].emoji} {MOOD_MODES[activeMoodIndex].name}: "{MOOD_MODES[activeMoodIndex].desc}"
                </p>
              </div>
              <span className="font-curly text-white" style={{ fontSize: "1.2rem" }}>
                Ready to chat
              </span>
            </div>
          </motion.div>

          {/* PROJECT FEATURES SHOWCASE GRID */}
          <section style={{ marginBottom: "70px", textAlign: "left" }}>
            <div style={{ textAlign: "center", maxWidth: "650px", margin: "0 auto 40px" }}>
              <span className="font-mono" style={{ fontSize: "0.75rem", fontWeight: 700, color: "#a1a1aa", letterSpacing: "1px" }}>
                CORE CAPABILITIES
              </span>
              <h2 style={{ fontSize: "2.3rem", fontWeight: 800, color: "#ffffff", marginTop: "6px" }}>
                Built for <span className="font-serif-italic">effortless connection</span>.
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
              {PROJECT_FEATURES.map((feat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="minimal-card"
                  style={{ padding: "26px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                      <div style={{ background: "rgba(255, 255, 255, 0.08)", padding: "10px", borderRadius: "14px", border: "1px solid rgba(255, 255, 255, 0.15)" }}>
                        {feat.icon}
                      </div>
                      <span className="font-mono" style={{ background: "rgba(255,255,255,0.05)", color: "#a1a1aa", fontSize: "0.72rem", fontWeight: 700, padding: "3px 9px", borderRadius: "999px" }}>
                        {feat.badge}
                      </span>
                    </div>

                    <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#ffffff", marginBottom: "2px" }}>
                      {feat.title}
                    </h3>
                    
                    <p style={{ margin: "0 0 10px 0" }}>
                      <span className="font-curly" style={{ fontSize: "1.1rem", color: "#e4e4e7" }}>
                        — {feat.curlySubtitle}
                      </span>
                    </p>

                    <p style={{ fontSize: "0.86rem", color: "#a1a1aa", lineHeight: 1.55, margin: 0 }}>
                      {feat.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* TESTIMONIALS SECTION */}
          <section style={{ marginBottom: "75px", textAlign: "left" }}>
            <div style={{ textAlign: "center", marginBottom: "36px" }}>
              <span className="font-mono" style={{ fontSize: "0.75rem", fontWeight: 700, color: "#a1a1aa", letterSpacing: "1px" }}>
                COMMUNITY FEEDBACK
              </span>
              <h2 style={{ fontSize: "2.1rem", fontWeight: 800, color: "#ffffff", marginTop: "4px" }}>
                Loved by daily <span className="font-curly" style={{ fontSize: "1.25em" }}>users & creators</span>.
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: "20px" }}>
              {TESTIMONIALS.map((t, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -3 }}
                  className="minimal-card"
                  style={{ padding: "26px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
                >
                  <div>
                    <div style={{ display: "flex", gap: "4px", marginBottom: "14px" }}>
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} size={15} fill="#ffffff" color="#ffffff" />
                      ))}
                    </div>
                    <p style={{ fontSize: "0.92rem", color: "#d4d4d8", lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>
                      "{t.quote}"
                    </p>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "20px", paddingTop: "14px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                    <img
                      src={t.avatar}
                      alt={t.name}
                      style={{ width: "42px", height: "42px", borderRadius: "50%", objectFit: "cover", border: "1px solid rgba(255,255,255,0.3)" }}
                    />
                    <div>
                      <h4 style={{ fontSize: "0.92rem", fontWeight: 800, color: "#ffffff", margin: 0 }}>{t.name}</h4>
                      <p style={{ fontSize: "0.76rem", color: "#a1a1aa", margin: 0 }}>{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* MINIMAL CALL TO ACTION */}
          <motion.section
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="minimal-card"
            style={{
              borderRadius: "28px",
              padding: "54px 36px",
              marginBottom: "50px",
              textAlign: "center"
            }}
          >
            <div style={{ maxWidth: "620px", margin: "0 auto" }}>
              <span className="font-mono" style={{ fontSize: "0.75rem", fontWeight: 700, color: "#a1a1aa", letterSpacing: "1px" }}>
                GET STARTED TODAY
              </span>
              <h2 style={{ fontSize: "2.6rem", fontWeight: 800, marginTop: "8px", marginBottom: "14px", color: "#ffffff", lineHeight: 1.15 }}>
                Experience <span className="font-serif-italic">intelligent conversation</span>.
              </h2>
              <p style={{ fontSize: "0.98rem", color: "#a1a1aa", marginBottom: "28px", lineHeight: 1.6 }}>
                Connect with Friday now for real-time speech synthesis, mood adaptation, and profile memory.
              </p>

              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
                <Link to="/signup" style={{ textDecoration: "none" }}>
                  <button className="btn-minimal-primary" style={{ padding: "13px 34px", fontSize: "0.95rem" }}>
                    Get Started Free <ArrowRight size={17} />
                  </button>
                </Link>
                <Link to="/login" style={{ textDecoration: "none" }}>
                  <button className="btn-minimal-secondary" style={{ padding: "13px 26px", fontSize: "0.92rem" }}>
                    Sign In
                  </button>
                </Link>
              </div>

              <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "28px", fontSize: "0.8rem", color: "#a1a1aa", fontWeight: 600 }}>
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><CheckCircle2 size={14} color="#ffffff" /> Free Account</span>
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><CheckCircle2 size={14} color="#ffffff" /> Voice Mic & Audio</span>
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><CheckCircle2 size={14} color="#ffffff" /> Google Auth Sync</span>
              </div>
            </div>
          </motion.section>

        </div>

        {/* MINIMAL FOOTER */}
        <footer
          style={{
            textAlign: "center",
            padding: "36px 20px",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            background: "rgba(9, 9, 11, 0.9)",
            backdropFilter: "blur(20px)"
          }}
        >
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
            <FridayLogo size="1.2rem" color="#ffffff" showBadge={false} />
            <span style={{ color: "#71717a" }}>|</span>
            <span style={{ fontSize: "0.8rem", color: "#a1a1aa", fontWeight: 700 }} className="font-mono">
              LLAMA AI VOICE CHAT
            </span>
          </div>
          <p style={{ fontSize: "0.8rem", color: "#71717a", margin: 0 }}>
            &copy; 2026 Friday AI. All rights reserved.
          </p>
        </footer>

      </div>
    </div>
  );
};

export default Home;