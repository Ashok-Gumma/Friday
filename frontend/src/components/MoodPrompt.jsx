import React from "react";
import { motion } from "framer-motion";
import { Flame, Smile, Frown, Angry, Coffee, Moon, Target, Heart, Briefcase } from "lucide-react";
import { NotionMoodArt } from "./NotionArt.jsx";

const moods = [
  { label: "Motivated", desc: "Energetic & inspiring", value: "motivated", emoji: "🔥", icon: <Flame size={16} /> },
  { label: "Joyful", desc: "Cheerful & warm", value: "happy", emoji: "😊", icon: <Smile size={16} /> },
  { label: "Sad", desc: "Gentle & empathetic", value: "sad", emoji: "😔", icon: <Frown size={16} /> },
  { label: "Angry", desc: "Calm, non-judgmental", value: "angry", emoji: "😤", icon: <Angry size={16} /> },
  { label: "Relaxed", desc: "Slow-paced & supportive", value: "relaxed", emoji: "☕", icon: <Coffee size={16} /> },
  { label: "Calm", desc: "Mindful & serene", value: "calm", emoji: "🌿", icon: <Moon size={16} /> },
  { label: "Focused", desc: "Direct & goal-driven", value: "focused", emoji: "🎯", icon: <Target size={16} /> },
  { label: "Compassionate", desc: "Validating & warm", value: "romantic", emoji: "💛", icon: <Heart size={16} /> },
  { label: "Professional", desc: "Concise & analytical", value: "professional", emoji: "💼", icon: <Briefcase size={16} /> },
];

const MoodPrompt = ({ onMoodSelect, isModal = false, onClose }) => {
  return (
    <div style={{
      minHeight: isModal ? "auto" : "100vh",
      display: "flex", alignItems: "center", justifyContent: "center",
      background: isModal ? "rgba(0,0,0,0.55)" : "var(--bg-soft)",
      position: isModal ? "fixed" : "relative", inset: isModal ? 0 : "auto",
      zIndex: isModal ? 99999 : 0,
      backdropFilter: isModal ? "blur(8px)" : "none",
      padding: "20px", fontFamily: "'Inter', sans-serif"
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: "100%", maxWidth: "620px",
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "20px",
          padding: "32px 28px",
          boxShadow: "var(--shadow-lg)",
          position: "relative"
        }}
      >
        {/* Close button */}
        {isModal && (
          <button
            onClick={onClose}
            style={{
              position: "absolute", top: "18px", right: "18px",
              width: "30px", height: "30px", borderRadius: "8px",
              background: "var(--bg-soft)", border: "1px solid var(--border)",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--text-muted)", fontSize: "0.85rem", fontWeight: 700
            }}
          >
            ✕
          </button>
        )}

        {/* Header with Notion Mood Artwork */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px", flexWrap: "wrap" }}>
          <div style={{ flexShrink: 0 }}>
            <NotionMoodArt width={70} height={70} />
          </div>
          <div style={{ flex: 1, minWidth: "200px" }}>
            <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.5px", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px" }}>
              Friday AI · Mood Check-In
            </p>
            <h2 style={{ fontSize: "clamp(1.1rem, 3vw, 1.35rem)", fontWeight: 800, letterSpacing: "-0.5px", color: "var(--text)", marginBottom: "4px" }}>
              How are you feeling right now?
            </h2>
            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
              Select a mood to dynamically adjust Friday's tone & empathy model.
            </p>
          </div>
        </div>

        {/* Mood Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 150px), 1fr))", gap: "8px" }}>
          {moods.map((mood) => (
            <motion.button
              key={mood.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onMoodSelect(mood.value)}
              style={{
                padding: "10px 12px", borderRadius: "10px",
                border: "1px solid var(--border)", background: "var(--bg-soft)",
                cursor: "pointer", textAlign: "left",
                display: "flex", flexDirection: "column", gap: "3px",
                transition: "all 0.15s ease"
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--text)"; e.currentTarget.style.background = "var(--bg-hover)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--bg-soft)"; }}
            >
              <span style={{ fontSize: "1.2rem" }}>{mood.emoji}</span>
              <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text)", display: "block" }}>{mood.label}</span>
              <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", display: "block", lineHeight: 1.3 }}>{mood.desc}</span>
            </motion.button>
          ))}
        </div>

        <div style={{ marginTop: "18px", paddingTop: "14px", borderTop: "1px solid var(--border)", textAlign: "center" }}>
          <button
            onClick={() => onMoodSelect("relaxed")}
            style={{
              background: "none", border: "none",
              color: "var(--text-muted)", fontSize: "0.82rem", fontWeight: 500,
              cursor: "pointer", textDecoration: "underline", textUnderlineOffset: "3px"
            }}
          >
            Skip — use default tone
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default MoodPrompt;
