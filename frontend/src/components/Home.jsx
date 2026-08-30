import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, BrainCircuit, MessageSquare, Zap } from "lucide-react";
import { useTheme } from "../context/ThemeContext.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import { NotionHeroArt } from "./NotionArt.jsx";

/* ── Particle config — dots only, adaptive to theme ── */
const PARTICLE_COUNT = 65;
const PARTICLE_SPEED = 0.28;

const MOODS = [
  { emoji: "😊", label: "Happy" },
  { emoji: "😔", label: "Sad" },
  { emoji: "😤", label: "Angry" },
  { emoji: "🔥", label: "Motivated" },
  { emoji: "🌿", label: "Calm" },
  { emoji: "😰", label: "Anxious" },
];

const FEATURES = [
  { icon: <BrainCircuit size={18} />, title: "Real ML emotion detection", desc: "100k-sample Naive Bayes trained on 7 emotional states" },
  { icon: <MessageSquare size={18} />, title: "Mood-locked responses", desc: "Friday speaks to exactly how you feel right now" },
  { icon: <Zap size={18} />, title: "Voice synthesis", desc: "Hear Friday respond in a warm, calm voice" },
  { icon: <Sparkles size={18} />, title: "9 mood personas", desc: "From anxious to motivated — every state is covered" },
];

/* ── Canvas Particle Network ── */
const ParticleCanvas = () => {
  const { isDark } = useTheme();
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const rafId = useRef(null);
  const isVisible = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    // Init particles
    particles.current = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * PARTICLE_SPEED,
      vy: (Math.random() - 0.5) * PARTICLE_SPEED,
      r: Math.random() * 1.3 + 0.6,
      opacity: Math.random() * 0.35 + 0.15,
    }));

    const draw = () => {
      if (!isVisible.current) {
        rafId.current = requestAnimationFrame(draw);
        return;
      }
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Pure floating dots with theme-adaptive color
      const pts = particles.current;
      const rgb = isDark ? "255,255,255" : "25,25,25";

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb},${p.opacity})`;
        ctx.fill();
      }

      rafId.current = requestAnimationFrame(draw);
    };

    draw();

    const onResize = () => resize();
    const onVisibility = () => { isVisible.current = !document.hidden; };

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", display: "block" }}
    />
  );
};

/* ── Home Page ── */
const Home = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) navigate("/chat", { replace: true });
  }, [token, navigate]);

  return (
    <div style={{
      background: "var(--bg)",
      color: "var(--text)",
      minHeight: "100vh",
      fontFamily: "'Inter', sans-serif",
      overflowX: "hidden",
      transition: "background-color 0.2s ease, color 0.2s ease"
    }}>
      {/* Particle background */}
      <ParticleCanvas />

      {/* ── NAV ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px clamp(20px, 5vw, 80px)",
        background: isDark ? "rgba(15, 15, 15, 0.85)" : "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontWeight: 800, fontSize: "1rem", letterSpacing: "-0.3px", color: "var(--text)" }}>
            Friday AI
          </span>
          <span style={{
            fontSize: "0.7rem", fontWeight: 700, padding: "2px 6px",
            borderRadius: "4px", background: "var(--bg-soft)", border: "1px solid var(--border)",
            color: "var(--text-muted)", textTransform: "uppercase"
          }}>
            Beta
          </span>
        </div>

        <div className="nav-links-desktop" style={{ display: "flex", gap: "4px", alignItems: "center" }}>
          {["Home", "Features", "About"].map(l => (
            <Link key={l} to="/login" style={{
              padding: "6px 12px", borderRadius: "6px",
              color: "var(--text-muted)", textDecoration: "none",
              fontSize: "0.875rem", fontWeight: 500, transition: "all 0.15s"
            }}
              onMouseEnter={e => { e.target.style.color = "var(--text)"; e.target.style.background = "var(--bg-hover)"; }}
              onMouseLeave={e => { e.target.style.color = "var(--text-muted)"; e.target.style.background = "transparent"; }}
            >{l}</Link>
          ))}
        </div>

        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {/* Theme Toggle Button */}
          <ThemeToggle size="sm" />

          <button
            onClick={() => navigate("/login")}
            style={{
              padding: "6px 12px", borderRadius: "8px",
              background: "transparent", color: "var(--text)",
              border: "1px solid var(--border)",
              fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", fontWeight: 500, cursor: "pointer",
              transition: "all 0.15s"
            }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--bg-soft)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            Log in
          </button>
          <button
            onClick={() => navigate("/signup")}
            style={{
              padding: "6px 14px", borderRadius: "8px",
              background: "var(--accent)", color: "var(--bg)",
              border: "none", fontFamily: "'Inter', sans-serif",
              fontSize: "0.85rem", fontWeight: 700, cursor: "pointer",
              transition: "transform 0.15s"
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          >
            Get started
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        position: "relative", zIndex: 1,
        maxWidth: "1100px", margin: "0 auto",
        padding: "clamp(40px, 8vw, 80px) clamp(16px, 5vw, 80px) 60px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
        gap: "40px", alignItems: "center"
      }}>
        {/* Left */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            padding: "4px 12px", borderRadius: "6px",
            background: isDark ? "rgba(167,139,250,0.12)" : "rgba(124,58,237,0.08)",
            border: `1px solid ${isDark ? "rgba(167,139,250,0.3)" : "rgba(124,58,237,0.2)"}`,
            fontSize: "0.78rem", fontWeight: 600, color: "var(--accent-purple)",
            marginBottom: "24px"
          }}>
            <Sparkles size={12} /> Emotional AI Companion
          </div>

          <h1 style={{
            fontSize: "clamp(2.8rem, 5.5vw, 4.6rem)",
            fontWeight: 800, letterSpacing: "-2.5px",
            lineHeight: 1.05, marginBottom: "20px", color: "var(--text)"
          }}>
            Your feelings<br />deserve to be<br />
            <span style={{ color: "var(--text-muted)", fontStyle: "italic", fontWeight: 600 }}>heard.</span>
          </h1>

          <p style={{ fontSize: "1rem", color: "var(--text-muted)", lineHeight: 1.7, maxWidth: "460px", marginBottom: "32px" }}>
            Tell Friday how you feel. Real Machine Learning reads your mood and responds with exactly the right emotional tone — comforting, energizing, grounding, or calm.
          </p>

          {/* Mood chips */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "36px" }}>
            {MOODS.map((m, i) => (
              <span key={i} style={{
                display: "inline-flex", alignItems: "center", gap: "5px",
                padding: "5px 13px", borderRadius: "8px",
                background: "var(--bg-soft)",
                border: "1px solid var(--border)",
                fontSize: "0.82rem", fontWeight: 500, color: "var(--text)"
              }}>
                {m.emoji} {m.label}
              </span>
            ))}
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/signup")}
              style={{
                padding: "12px 26px", borderRadius: "8px",
                background: "var(--accent)", color: "var(--bg)",
                border: "none", fontWeight: 700, fontSize: "0.9rem",
                cursor: "pointer", fontFamily: "'Inter', sans-serif",
                display: "flex", alignItems: "center", gap: "8px"
              }}
            >
              Start free <ArrowRight size={16} />
            </motion.button>
            <button
              onClick={() => navigate("/login")}
              style={{
                background: "none", border: "none",
                color: "var(--text-muted)", fontSize: "0.875rem",
                cursor: "pointer", fontFamily: "'Inter', sans-serif", fontWeight: 500,
                transition: "color 0.15s"
              }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--text)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
            >
              Already signed up? →
            </button>
          </div>
        </motion.div>

        {/* Right — Notion cartoon illustration card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "var(--shadow-md)",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            minHeight: "380px"
          }}
        >
          {/* Notion Hero Vector Artwork */}
          <div style={{ width: "100%", display: "flex", justifyContent: "center", padding: "10px 0" }}>
            <NotionHeroArt width={280} height={280} />
          </div>

          {/* Stats row */}
          <div style={{
            marginTop: "16px", display: "flex", gap: "20px",
            borderTop: "1px solid var(--border)", paddingTop: "18px", width: "100%"
          }}>
            {[["100K+", "ML Samples"], ["9", "Moods"], ["24/7", "Available"]].map(([n, l]) => (
              <div key={l} style={{ textAlign: "center", flex: 1 }}>
                <p style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text)" }}>{n}</p>
                <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 500, marginTop: "2px" }}>{l}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── DIVIDER ── */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", borderTop: "1px solid var(--border)" }} />

      {/* ── FEATURES ── */}
      <section style={{ position: "relative", zIndex: 1, maxWidth: "1100px", margin: "0 auto", padding: "64px clamp(20px, 5vw, 80px)" }}>
        <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "1px", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "32px" }}>
          Why Friday works
        </p>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "16px"
        }}>
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              style={{
                padding: "26px 22px",
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                boxShadow: "var(--shadow-sm)",
                transition: "all 0.2s"
              }}
              whileHover={{ y: -2, boxShadow: "var(--shadow-md)" }}
            >
              <div style={{
                width: "38px", height: "38px", borderRadius: "8px",
                background: "var(--bg-soft)", border: "1px solid var(--border)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: i === 0 ? "var(--accent-purple)" : "var(--text)", marginBottom: "16px"
              }}>
                {f.icon}
              </div>
              <h3 style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text)", marginBottom: "8px" }}>{f.title}</h3>
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.6 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ position: "relative", zIndex: 1, maxWidth: "1100px", margin: "0 auto", padding: "0 clamp(20px, 5vw, 80px) 80px" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "16px", padding: "50px 32px", textAlign: "center",
            boxShadow: "var(--shadow-md)"
          }}
        >
          <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 800, letterSpacing: "-1px", color: "var(--text)", marginBottom: "12px" }}>
            Ready to feel understood?
          </h2>
          <p style={{ color: "var(--text-muted)", maxWidth: "420px", margin: "0 auto 28px", fontSize: "0.92rem", lineHeight: 1.65 }}>
            Pick your mood. Start talking. Friday listens and adapts in real-time.
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/signup")}
            style={{
              background: "var(--accent)", color: "var(--bg)",
              border: "none", padding: "12px 28px", borderRadius: "8px",
              fontWeight: 700, fontSize: "0.92rem", cursor: "pointer",
              display: "inline-flex", alignItems: "center", gap: "8px",
              fontFamily: "'Inter', sans-serif"
            }}
          >
            Get started free <ArrowRight size={16} />
          </motion.button>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        position: "relative", zIndex: 1,
        borderTop: "1px solid var(--border)",
        padding: "24px clamp(20px, 5vw, 80px)",
        background: "var(--bg)"
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text)" }}>Friday AI</span>
            <ThemeToggle size="sm" />
          </div>
          <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>© 2025 Friday — Your Emotional AI Companion</p>
          <div style={{ display: "flex", gap: "20px" }}>
            {["Privacy", "Terms", "Contact"].map(l => (
              <Link key={l} to="/login" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.78rem", fontWeight: 500 }}>{l}</Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;