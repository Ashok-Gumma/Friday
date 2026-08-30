import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Heart,
  Wind,
  Feather,
  ShieldCheck,
  Volume2,
  Lock,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Share2,
  Plus,
  PanelLeft,
  RefreshCw,
  Sun
} from "lucide-react";
import { useTheme } from "../context/ThemeContext.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import FridayLogo from "./FridayLogo.jsx";

/* ── Interactive Moods & Ambient Responses ── */
const MOOD_STATES = [
  {
    id: "calm",
    emoji: "🌿",
    label: "Calm & Grounded",
    color: "var(--natural-sage)",
    tone: "Centering & Gentle",
    userPrompt: "Just taking a quiet moment to breathe and reflect.",
    aiResponse: "I'm right here with you. Take all the time you need — there's no rush to be anything other than present.",
    tag: "Equilibrium"
  },
  {
    id: "overwhelmed",
    emoji: "🌧️",
    label: "Overwhelmed",
    color: "var(--natural-terracotta)",
    tone: "Grounding & Soothing",
    userPrompt: "Everything feels like it's piling up at once.",
    aiResponse: "Let's set the heavy weight down for a second. You don't have to solve everything right now. Let's take it one single breath at a time.",
    tag: "Decompression"
  },
  {
    id: "hopeful",
    emoji: "✨",
    label: "Hopeful & Inspired",
    color: "#d97706",
    tone: "Uplifting & Clear",
    userPrompt: "I have this new spark of an idea and feel ready for what's next.",
    aiResponse: "That energy is beautiful. Tell me more about what ignited this — let's nurture that clarity and turn it into something real.",
    tag: "Creative Flow"
  },
  {
    id: "reflective",
    emoji: "💭",
    label: "Deep in Thought",
    color: "#4f46e5",
    tone: "Mindful & Inquisitive",
    userPrompt: "Trying to understand why a certain situation is lingering in my head.",
    aiResponse: "Our minds hold onto what matters. What part of it feels most unresolved when you sit with it in quiet?",
    tag: "Inner Clarity"
  },
  {
    id: "tired",
    emoji: "🌙",
    label: "Exhausted",
    color: "#6b7280",
    tone: "Soft & Restful",
    userPrompt: "I'm drained from the day and just need a safe space.",
    aiResponse: "Rest is productive, too. You did enough today. Let go of the need to do or explain anything right now.",
    tag: "Restoration"
  }
];

const PILLARS = [
  {
    icon: <Feather size={20} />,
    title: "Zero Judgment, Pure Sanctuary",
    desc: "Speak your uncensored thoughts freely. Friday offers unconditional positive regard and a calm, patient listening ear."
  },
  {
    icon: <Wind size={20} />,
    title: "Nuanced Emotional Intelligence",
    desc: "Trained on over 100,000 emotional data points to detect subtle shifts in sentiment, fatigue, hope, and anxiety."
  },
  {
    icon: <Volume2 size={20} />,
    title: "Grounding Acoustic Presence",
    desc: "Experience natural voice synthesis tuned with soothing cadence to lower stress and invite mental stillness."
  },
  {
    icon: <ShieldCheck size={20} />,
    title: "Sacred Personal Privacy",
    desc: "Your inner emotional world is completely private and secure. No ads, no data selling, no algorithmic pressure."
  }
];

const DAILY_REFLECTIONS = [
  "“Peace is not the absence of trouble, but the presence of stillness within.”",
  "“You don't need to have all the answers today. Just breathing is enough.”",
  "“Allow yourself the same grace and gentleness you so freely give to others.”",
  "“Notice the quiet spaces between your thoughts — that is where clarity lives.”"
];

/* ── Serene Ambient Particle Canvas ── */
const SereneCanvas = () => {
  const { isDark } = useTheme();
  const canvasRef = useRef(null);
  const rafId = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particleCount = Math.min(35, Math.floor(window.innerWidth / 35));
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      radius: Math.random() * 2.2 + 0.8,
      opacity: Math.random() * 0.25 + 0.08,
      pulse: Math.random() * Math.PI,
      pulseSpeed: 0.015 + Math.random() * 0.01
    }));

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const rgb = isDark ? "160, 195, 175" : "90, 120, 105";

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += p.pulseSpeed;

        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        const currentOpacity = p.opacity + Math.sin(p.pulse) * 0.06;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb}, ${Math.max(0.02, currentOpacity)})`;
        ctx.fill();
      }

      rafId.current = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        display: "block"
      }}
    />
  );
};

/* ── Interactive Mindful Breathing Widget ── */
const BreathingOrb = () => {
  const [phase, setPhase] = useState("Breathe in");

  useEffect(() => {
    const phases = [
      { text: "Breathe in", duration: 4 },
      { text: "Hold gently", duration: 4 },
      { text: "Release & relax", duration: 4 }
    ];
    let currentIdx = 0;

    const interval = setInterval(() => {
      currentIdx = (currentIdx + 1) % phases.length;
      setPhase(phases[currentIdx].text);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px 16px",
      textAlign: "center"
    }}>
      <div style={{ position: "relative", width: "110px", height: "110px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <motion.div
          animate={{
            scale: phase.startsWith("Breathe in") ? [1, 1.3] : phase.startsWith("Hold") ? 1.3 : [1.3, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: "radial-gradient(circle, var(--natural-sage) 0%, transparent 70%)",
            filter: "blur(10px)",
            pointerEvents: "none"
          }}
        />

        <motion.div
          animate={{
            scale: phase.startsWith("Breathe in") ? [1, 1.2] : phase.startsWith("Hold") ? 1.2 : [1.2, 1]
          }}
          transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
          style={{
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            background: "var(--bg-soft)",
            border: "1px solid var(--natural-sage)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "var(--shadow-sm)",
            zIndex: 1
          }}
        >
          <Wind size={22} style={{ color: "var(--natural-sage)" }} />
        </motion.div>
      </div>

      <motion.p
        key={phase}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        style={{
          marginTop: "12px",
          fontSize: "0.88rem",
          fontWeight: 600,
          color: "var(--text)",
          fontFamily: "'Plus Jakarta Sans', sans-serif"
        }}
      >
        {phase}
      </motion.p>
      <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "2px" }}>
        Synchronized emotional grounding
      </span>
    </div>
  );
};

/* ── Main Home Component ── */
const Home = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const token = localStorage.getItem("token");

  const [activeMood, setActiveMood] = useState(MOOD_STATES[0]);
  const [reflectionIdx, setReflectionIdx] = useState(0);

  useEffect(() => {
    if (token) navigate("/chat", { replace: true });
  }, [token, navigate]);

  const cycleReflection = () => {
    setReflectionIdx((prev) => (prev + 1) % DAILY_REFLECTIONS.length);
  };

  return (
    <div style={{
      background: "var(--bg)",
      color: "var(--text)",
      minHeight: "100vh",
      fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
      overflowX: "hidden",
      position: "relative",
      transition: "background-color 0.3s ease, color 0.3s ease"
    }}>
      {/* Background Serene Particle Canvas */}
      <SereneCanvas />

      {/* Subtle Ambient Glow Orbs */}
      <div
        className="natural-glow-sphere"
        style={{
          top: "-10%",
          left: "20%",
          width: "500px",
          height: "500px",
          background: isDark
            ? "radial-gradient(circle, rgba(74, 107, 93, 0.15) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(91, 112, 101, 0.08) 0%, transparent 70%)"
        }}
      />
      <div
        className="natural-glow-sphere"
        style={{
          top: "30%",
          right: "5%",
          width: "450px",
          height: "450px",
          background: isDark
            ? "radial-gradient(circle, rgba(184, 90, 71, 0.1) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(194, 94, 76, 0.06) 0%, transparent 70%)"
        }}
      />

      {/* ── SERENE NAVIGATION BAR ── */}
      <header style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        padding: "16px clamp(20px, 6vw, 90px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: isDark ? "rgba(15, 15, 15, 0.75)" : "rgba(255, 255, 255, 0.75)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <FridayLogo size="1.25rem" color="var(--text)" showBadge={true} />
        </div>

        <nav className="nav-links-desktop" style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          <a
            href="#reflection"
            style={{
              color: "var(--text-muted)",
              textDecoration: "none",
              fontSize: "0.88rem",
              fontWeight: 500,
              transition: "color 0.2s"
            }}
            onMouseEnter={(e) => (e.target.style.color = "var(--text)")}
            onMouseLeave={(e) => (e.target.style.color = "var(--text-muted)")}
          >
            Daily Stillness
          </a>
          <a
            href="#mood-resonance"
            style={{
              color: "var(--text-muted)",
              textDecoration: "none",
              fontSize: "0.88rem",
              fontWeight: 500,
              transition: "color 0.2s"
            }}
            onMouseEnter={(e) => (e.target.style.color = "var(--text)")}
            onMouseLeave={(e) => (e.target.style.color = "var(--text-muted)")}
          >
            Resonance
          </a>
          <a
            href="#sanctuary"
            style={{
              color: "var(--text-muted)",
              textDecoration: "none",
              fontSize: "0.88rem",
              fontWeight: 500,
              transition: "color 0.2s"
            }}
            onMouseEnter={(e) => (e.target.style.color = "var(--text)")}
            onMouseLeave={(e) => (e.target.style.color = "var(--text-muted)")}
          >
            Philosophy
          </a>
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <ThemeToggle size="sm" />

          <button
            onClick={() => navigate("/login")}
            style={{
              background: "transparent",
              border: "1px solid var(--border)",
              color: "var(--text)",
              padding: "7px 16px",
              borderRadius: "999px",
              fontSize: "0.85rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--bg-soft)";
              e.currentTarget.style.borderColor = "var(--text-muted)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "var(--border)";
            }}
          >
            Sign in
          </button>

          <button
            onClick={() => navigate("/signup")}
            style={{
              background: "var(--text)",
              color: "var(--bg)",
              border: "none",
              padding: "8px 20px",
              borderRadius: "999px",
              fontSize: "0.85rem",
              fontWeight: 700,
              cursor: "pointer",
              transition: "transform 0.2s ease, opacity 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.opacity = "0.92";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.opacity = "1";
            }}
          >
            Begin
          </button>
        </div>
      </header>

      {/* ── 1. FIRST SECTION: DAILY MINDFUL REFLECTION (PROMINENT AT TOP) ── */}
      <section id="reflection" style={{
        position: "relative",
        zIndex: 1,
        maxWidth: "960px",
        margin: "0 auto",
        padding: "clamp(32px, 5vw, 48px) clamp(20px, 6vw, 60px) 20px"
      }}>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "24px",
            padding: "36px clamp(24px, 5vw, 52px)",
            textAlign: "center",
            boxShadow: isDark ? "0 10px 30px rgba(0,0,0,0.4)" : "0 8px 24px rgba(0,0,0,0.04)",
            position: "relative"
          }}
        >
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            color: "var(--natural-sage)",
            fontSize: "0.78rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "1.2px",
            marginBottom: "16px"
          }}>
            <Sun size={15} /> Daily Mindful Reflection
          </div>

          <AnimatePresence mode="wait">
            <motion.p
              key={reflectionIdx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="font-serif"
              style={{
                fontSize: "clamp(1.3rem, 2.9vw, 1.85rem)",
                fontStyle: "italic",
                color: "var(--text)",
                lineHeight: 1.48,
                margin: "0 auto 22px",
                maxWidth: "720px"
              }}
            >
              {DAILY_REFLECTIONS[reflectionIdx]}
            </motion.p>
          </AnimatePresence>

          <button
            onClick={cycleReflection}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 18px",
              borderRadius: "999px",
              background: "var(--bg-soft)",
              border: "1px solid var(--border)",
              color: "var(--text-muted)",
              fontSize: "0.82rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--text)";
              e.currentTarget.style.borderColor = "var(--text-muted)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--text-muted)";
              e.currentTarget.style.borderColor = "var(--border)";
            }}
          >
            <RefreshCw size={13} />
            <span>Another thought</span>
          </button>
        </motion.div>
      </section>

      {/* ── 2. HERO SECTION: NATURAL MINIMAL SANCTUARY ── */}
      <section style={{
        position: "relative",
        zIndex: 1,
        maxWidth: "1160px",
        margin: "0 auto",
        padding: "32px clamp(20px, 6vw, 60px) 64px"
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 480px), 1fr))",
          gap: "48px",
          alignItems: "center"
        }}>
          {/* Left Column: Quiet, Powerful Editorial Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              borderRadius: "999px",
              background: "var(--natural-sage-light)",
              border: "1px solid var(--border)",
              fontSize: "0.8rem",
              fontWeight: 600,
              color: "var(--natural-sage)",
              marginBottom: "20px"
            }}>
              <Sparkles size={14} /> Mindful Emotional Companion
            </div>

            <h1 style={{
              fontSize: "clamp(2.6rem, 5.2vw, 4.4rem)",
              fontWeight: 700,
              letterSpacing: "-1.5px",
              lineHeight: 1.12,
              marginBottom: "20px",
              color: "var(--text)"
            }}>
              A quiet sanctuary for your{" "}
              <span className="font-serif" style={{ fontStyle: "italic", fontWeight: 400, color: "var(--natural-terracotta)" }}>
                thoughts
              </span>{" "}
              and{" "}
              <span className="font-serif" style={{ fontStyle: "italic", fontWeight: 400, color: "var(--natural-sage)" }}>
                feelings.
              </span>
            </h1>

            <p style={{
              fontSize: "1.05rem",
              color: "var(--text-muted)",
              lineHeight: 1.75,
              maxWidth: "500px",
              marginBottom: "32px",
              fontWeight: 400
            }}>
              Speak openly without fear of judgment. Friday detects emotional resonance through real machine learning and meets you with genuine warmth, clarity, and stillness.
            </p>

            {/* Interactive Mood Calibration Chips */}
            <div id="mood-resonance" style={{ marginBottom: "32px" }}>
              <p style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "1px",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                marginBottom: "12px"
              }}>
                How does your mind feel right now?
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {MOOD_STATES.map((m) => {
                  const isSelected = activeMood.id === m.id;
                  return (
                    <motion.button
                      key={m.id}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setActiveMood(m)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "7px 14px",
                        borderRadius: "999px",
                        background: isSelected ? "var(--text)" : "var(--bg-soft)",
                        color: isSelected ? "var(--bg)" : "var(--text)",
                        border: `1px solid ${isSelected ? "var(--text)" : "var(--border)"}`,
                        fontSize: "0.84rem",
                        fontWeight: isSelected ? 700 : 500,
                        cursor: "pointer",
                        transition: "all 0.2s ease"
                      }}
                    >
                      <span>{m.emoji}</span>
                      <span>{m.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div style={{ display: "flex", gap: "14px", alignItems: "center", flexWrap: "wrap" }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/signup")}
                style={{
                  padding: "14px 28px",
                  borderRadius: "999px",
                  background: "var(--text)",
                  color: "var(--bg)",
                  border: "none",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  boxShadow: "var(--shadow-md)"
                }}
              >
                <span>Enter Sanctuary</span>
                <ArrowRight size={17} />
              </motion.button>

              <button
                onClick={() => navigate("/login")}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--text-muted)",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  padding: "8px 12px",
                  transition: "color 0.2s ease"
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
              >
                Returning member? Sign in →
              </button>
            </div>
          </motion.div>

          {/* Right Column: Apple Safari Browser Window Design */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background: isDark ? "rgba(22, 22, 24, 0.88)" : "rgba(255, 255, 255, 0.92)",
              backdropFilter: "blur(28px)",
              WebkitBackdropFilter: "blur(28px)",
              border: isDark ? "1px solid rgba(255, 255, 255, 0.12)" : "1px solid rgba(0, 0, 0, 0.1)",
              borderRadius: "18px",
              boxShadow: isDark
                ? "0 30px 70px -15px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(255, 255, 255, 0.08)"
                : "0 25px 60px -12px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.04)",
              overflow: "hidden",
              position: "relative"
            }}
          >
            {/* macOS Safari Header Toolbar */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "11px 16px",
              background: isDark ? "rgba(30, 30, 34, 0.75)" : "rgba(244, 244, 247, 0.85)",
              borderBottom: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(0, 0, 0, 0.08)",
              gap: "12px",
              userSelect: "none"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                  <span style={{ width: "11px", height: "11px", borderRadius: "50%", background: "#ff5f56", display: "inline-block", boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.12)" }} />
                  <span style={{ width: "11px", height: "11px", borderRadius: "50%", background: "#ffbd2e", display: "inline-block", boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.12)" }} />
                  <span style={{ width: "11px", height: "11px", borderRadius: "50%", background: "#27c93f", display: "inline-block", boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.12)" }} />
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-muted)", opacity: 0.7 }}>
                  <PanelLeft size={13} style={{ cursor: "default" }} />
                  <ChevronLeft size={14} style={{ cursor: "default", marginLeft: "4px" }} />
                  <ChevronRight size={14} style={{ cursor: "default" }} />
                </div>
              </div>

              <div style={{
                flex: 1,
                maxWidth: "260px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                padding: "5px 12px",
                borderRadius: "8px",
                background: isDark ? "rgba(0, 0, 0, 0.35)" : "rgba(255, 255, 255, 0.9)",
                border: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(0, 0, 0, 0.08)",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03)"
              }}>
                <Lock size={11} style={{ color: "var(--natural-sage)", flexShrink: 0 }} />
                <span style={{
                  fontSize: "0.76rem",
                  fontWeight: 500,
                  color: "var(--text)",
                  letterSpacing: "-0.2px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap"
                }}>
                  {typeof window !== "undefined" && window.location.hostname !== "localhost" ? window.location.hostname : "friday.ai"}<span style={{ color: "var(--text-muted)" }}>/sanctuary</span>
                </span>
                <RotateCw size={10} style={{ color: "var(--text-muted)", opacity: 0.6, marginLeft: "auto", flexShrink: 0 }} />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--text-muted)", opacity: 0.7 }}>
                <Share2 size={13} style={{ cursor: "pointer" }} />
                <Plus size={13} style={{ cursor: "pointer" }} />
              </div>
            </div>

            {/* Browser Inner Content */}
            <div style={{ padding: "26px 24px" }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid var(--border)",
                paddingBottom: "14px",
                marginBottom: "20px"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{
                    width: "9px",
                    height: "9px",
                    borderRadius: "50%",
                    background: "var(--natural-sage)",
                    boxShadow: "0 0 8px var(--natural-sage)"
                  }} />
                  <div>
                    <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text)", lineHeight: 1.2 }}>
                      Friday Sanctuary
                    </p>
                    <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                      Tone Resonance: <strong style={{ color: "var(--natural-sage)" }}>{activeMood.tone}</strong>
                    </p>
                  </div>
                </div>

                <span style={{
                  fontSize: "0.72rem",
                  padding: "3px 10px",
                  borderRadius: "999px",
                  background: "var(--bg-soft)",
                  border: "1px solid var(--border)",
                  color: "var(--text-muted)",
                  fontWeight: 600
                }}>
                  {activeMood.tag}
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "22px" }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`user-${activeMood.id}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      alignSelf: "flex-end",
                      maxWidth: "85%",
                      padding: "11px 16px",
                      borderRadius: "16px 16px 4px 16px",
                      background: "var(--bg-soft)",
                      border: "1px solid var(--border)",
                      color: "var(--text)",
                      fontSize: "0.86rem",
                      lineHeight: 1.5
                    }}
                  >
                    <p>{activeMood.userPrompt}</p>
                  </motion.div>
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`ai-${activeMood.id}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    style={{
                      alignSelf: "flex-start",
                      maxWidth: "90%",
                      padding: "13px 18px",
                      borderRadius: "16px 16px 16px 4px",
                      background: isDark ? "rgba(74, 107, 93, 0.15)" : "rgba(237, 244, 240, 0.9)",
                      border: "1px solid var(--border)",
                      color: "var(--text)",
                      fontSize: "0.88rem",
                      lineHeight: 1.55
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "5px" }}>
                      <Heart size={12} style={{ color: "var(--natural-terracotta)" }} />
                      <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                        Friday Listening
                      </span>
                    </div>
                    <p>{activeMood.aiResponse}</p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div style={{
                background: "var(--bg-soft)",
                border: "1px solid var(--border)",
                borderRadius: "14px",
                overflow: "hidden"
              }}>
                <BreathingOrb />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 3. CORE PILLARS OF SANCTUARY ── */}
      <section id="sanctuary" style={{
        position: "relative",
        zIndex: 1,
        maxWidth: "1160px",
        margin: "0 auto",
        padding: "48px clamp(20px, 6vw, 60px) 64px"
      }}>
        <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 48px" }}>
          <span style={{
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "1.2px",
            textTransform: "uppercase",
            color: "var(--natural-sage)",
            marginBottom: "8px",
            display: "inline-block"
          }}>
            Intentional Design
          </span>
          <h2 style={{
            fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
            fontWeight: 700,
            letterSpacing: "-0.8px",
            color: "var(--text)",
            marginBottom: "14px"
          }}>
            Crafted for mental stillness.
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.7 }}>
            Unlike noisy chat feeds designed for endless stimulation, Friday is built like a tranquil retreat — purposeful, respectful, and mindful.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "24px"
        }}>
          {PILLARS.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ y: -4 }}
              style={{
                padding: "30px 24px",
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "20px",
                boxShadow: "var(--shadow-sm)",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                transition: "box-shadow 0.2s ease, border-color 0.2s ease"
              }}
            >
              <div style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: "var(--bg-soft)",
                border: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: i % 2 === 0 ? "var(--natural-sage)" : "var(--natural-terracotta)"
              }}>
                {p.icon}
              </div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text)" }}>
                {p.title}
              </h3>
              <p style={{ fontSize: "0.86rem", color: "var(--text-muted)", lineHeight: 1.65 }}>
                {p.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 4. GENTLE INVITATION CTA ── */}
      <section style={{
        position: "relative",
        zIndex: 1,
        maxWidth: "1160px",
        margin: "0 auto",
        padding: "0 clamp(20px, 6vw, 60px) 96px"
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          style={{
            background: isDark
              ? "linear-gradient(145deg, #141f19 0%, #171717 100%)"
              : "linear-gradient(145deg, #f2f7f4 0%, #ffffff 100%)",
            border: "1px solid var(--border)",
            borderRadius: "28px",
            padding: "clamp(48px, 7vw, 72px) clamp(24px, 5vw, 60px)",
            textAlign: "center",
            boxShadow: "var(--shadow-lg)"
          }}
        >
          <span style={{
            fontSize: "0.75rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "1.2px",
            color: "var(--natural-sage)",
            marginBottom: "12px",
            display: "inline-block"
          }}>
            Begin Your Quiet Chapter
          </span>

          <h2 style={{
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 700,
            letterSpacing: "-1px",
            color: "var(--text)",
            marginBottom: "16px"
          }}>
            You don't have to carry it alone.
          </h2>

          <p style={{
            color: "var(--text-muted)",
            fontSize: "1rem",
            lineHeight: 1.7,
            maxWidth: "460px",
            margin: "0 auto 36px"
          }}>
            Whenever you need a calm listening presence, Friday is here. Free, private, and always available.
          </p>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/signup")}
            style={{
              padding: "16px 36px",
              borderRadius: "999px",
              background: "var(--text)",
              color: "var(--bg)",
              border: "none",
              fontWeight: 700,
              fontSize: "1rem",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              boxShadow: "var(--shadow-md)"
            }}
          >
            <span>Start Your Free Sanctuary</span>
            <ArrowRight size={18} />
          </motion.button>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        position: "relative",
        zIndex: 1,
        borderTop: "1px solid var(--border)",
        padding: "32px clamp(20px, 6vw, 90px)",
        background: "var(--bg)"
      }}>
        <div style={{
          maxWidth: "1160px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <FridayLogo size="1.1rem" color="var(--text)" showBadge={false} />
            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
              © {new Date().getFullYear()} Friday AI · Emotional Sanctuary
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <Link
              to="/login"
              style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.82rem", fontWeight: 500 }}
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.82rem", fontWeight: 500 }}
            >
              Join
            </Link>
            <ThemeToggle size="sm" />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;