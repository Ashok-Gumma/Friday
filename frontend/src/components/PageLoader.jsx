import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── All icons relevant to Friday AI emotional companion ── */
const ICONS = [
  { emoji: "😊", label: "Happy" },
  { emoji: "😔", label: "Sad" },
  { emoji: "😤", label: "Angry" },
  { emoji: "🔥", label: "Motivated" },
  { emoji: "🌿", label: "Calm" },
  { emoji: "😰", label: "Anxious" },
  { emoji: "🎯", label: "Focused" },
  { emoji: "💛", label: "Love" },
  { emoji: "💼", label: "Professional" },
  { emoji: "🧠", label: "AI Brain" },
  { emoji: "💬", label: "Chat" },
  { emoji: "🎤", label: "Voice" },
  { emoji: "✨", label: "Magic" },
  { emoji: "❤️", label: "Heart" },
  { emoji: "🌙", label: "Night" },
  { emoji: "⚡", label: "Energy" },
  { emoji: "🌊", label: "Flow" },
  { emoji: "🫂", label: "Support" },
  { emoji: "💡", label: "Insight" },
  { emoji: "☕", label: "Relaxed" },
];

/* 
  Blinkit-style: rapid icon cycling (every 80ms) — feels like a spinning slot.
  After ~2s it slows + locks on the final Friday AI identity icon.
*/
const PageLoader = () => {
  const [iconIndex, setIconIndex] = useState(0);
  const [phase, setPhase] = useState("fast");   // "fast" | "slow" | "done"
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Phase 1 — fast spin (80ms per icon)
    intervalRef.current = setInterval(() => {
      setIconIndex(i => (i + 1) % ICONS.length);
    }, 80);

    // Phase 2 — after 1.3s slow down
    timeoutRef.current = setTimeout(() => {
      clearInterval(intervalRef.current);
      setPhase("slow");

      intervalRef.current = setInterval(() => {
        setIconIndex(i => (i + 1) % ICONS.length);
      }, 220);

      // Phase 3 — after another 0.7s lock onto brain/AI icon
      setTimeout(() => {
        clearInterval(intervalRef.current);
        setIconIndex(ICONS.findIndex(i => i.label === "AI Brain"));
        setPhase("done");
      }, 700);
    }, 1300);

    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(timeoutRef.current);
    };
  }, []);

  const currentIcon = ICONS[iconIndex];

  return (
    <motion.div
      key="page-loader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.45, ease: "easeInOut" } }}
      style={{
        position: "fixed", inset: 0, zIndex: 99999,
        background: "#0d0d0d",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: "0",
        fontFamily: "'Inter', -apple-system, sans-serif"
      }}
    >
      {/* Subtle background glow */}
      <div style={{
        position: "absolute",
        width: "320px", height: "320px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)",
        pointerEvents: "none"
      }} />

      {/* ── Icon Slot ── */}
      <div style={{
        width: "96px", height: "96px",
        borderRadius: "24px",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", overflow: "hidden",
        marginBottom: "20px"
      }}>
        <AnimatePresence mode="popLayout">
          <motion.span
            key={iconIndex}
            initial={{ y: 40, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -40, opacity: 0, scale: 0.8 }}
            transition={{
              duration: phase === "fast" ? 0.06 : phase === "slow" ? 0.18 : 0.3,
              ease: "easeOut"
            }}
            style={{ fontSize: "2.8rem", lineHeight: 1, display: "block", position: "absolute" }}
          >
            {currentIcon.emoji}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* ── Label under icon ── */}
      <div style={{ height: "22px", marginBottom: "28px" }}>
        <AnimatePresence mode="wait">
          {phase === "done" ? (
            <motion.p
              key="final"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ fontSize: "0.82rem", fontWeight: 700, color: "#a78bfa", letterSpacing: "0.5px", textAlign: "center" }}
            >
              Friday AI
            </motion.p>
          ) : (
            <motion.p
              key={iconIndex + "-label"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.08 }}
              style={{ fontSize: "0.75rem", fontWeight: 500, color: "rgba(255,255,255,0.35)", textAlign: "center", letterSpacing: "0.3px" }}
            >
              {currentIcon.label}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* ── Progress bar ── */}
      <div style={{
        width: "180px", height: "2px",
        background: "rgba(255,255,255,0.07)",
        borderRadius: "999px", overflow: "hidden"
      }}>
        <motion.div
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 2.1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            width: "100%", height: "100%",
            background: "linear-gradient(90deg, #a78bfa, #ffffff)",
            borderRadius: "999px",
            boxShadow: "0 0 8px rgba(167,139,250,0.5)"
          }}
        />
      </div>

      {/* ── Brand text at bottom ── */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ delay: 0.6 }}
        style={{
          position: "absolute", bottom: "32px",
          fontSize: "0.72rem", fontWeight: 600, letterSpacing: "2px",
          color: "#fff", textTransform: "uppercase"
        }}
      >
        YOUR EMOTIONAL AI COMPANION
      </motion.p>
    </motion.div>
  );
};

export default PageLoader;
