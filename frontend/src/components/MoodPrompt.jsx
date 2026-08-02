import React from "react";
import { motion } from "framer-motion";
import { Flame, Smile, Target, Coffee, Moon, Heart, ShieldAlert, Activity, ArrowRight, Sparkles } from "lucide-react";
import FridayLogo from "./FridayLogo";

const moods = [
  { label: "Motivated", desc: "Energetic & inspiring coach", value: "motivated", icon: <Flame size={20} />, color: "#e11d48" },
  { label: "Happy", desc: "Upbeat, cheerful & friendly", value: "happy", icon: <Smile size={20} />, color: "#eab308" },
  { label: "Focused", desc: "Direct, clear & goal-driven", value: "focused", icon: <Target size={20} />, color: "#0284c7" },
  { label: "Relaxed", desc: "Calm, chill & supportive", value: "relaxed", icon: <Coffee size={20} />, color: "#10b981" },
  { label: "Calm", desc: "Reassuring & gentle listener", value: "calm", icon: <Moon size={20} />, color: "#3b82f6" },
  { label: "Romantic", desc: "Sweet, warm & charming", value: "romantic", icon: <Heart size={20} />, color: "#ec4899" },
  { label: "Empathetic", desc: "Kind, understanding & helpful", value: "sad", icon: <ShieldAlert size={20} />, color: "#8b5cf6" },
  { label: "Professional", desc: "Polite, concise & clear", value: "professional", icon: <Activity size={20} />, color: "#94a3b8" },
];

const MoodPrompt = ({ onMoodSelect, isModal = false, onClose }) => {
  return (
    <div style={{ 
      minHeight: isModal ? "auto" : "100vh", 
      display: "flex", alignItems: "center", justifyContent: "center",
      background: isModal ? "rgba(15, 23, 42, 0.5)" : "#faf9f5", 
      position: isModal ? "fixed" : "relative", inset: isModal ? 0 : "auto", zIndex: isModal ? 99999 : 0,
      backdropFilter: isModal ? "blur(12px)" : "none",
      padding: "30px 20px", fontFamily: "'Inter', sans-serif"
    }}>
      {/* Ambient background light */}
      {!isModal && (
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
          background: "radial-gradient(circle at 50% 25%, rgba(250, 204, 21, 0.15) 0%, transparent 65%)"
        }} />
      )}

      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        style={{ 
          width: "100%", maxWidth: "620px", padding: "44px 36px", 
          textAlign: "center",
          background: "#ffffff",
          border: "1px solid rgba(234, 179, 8, 0.25)",
          borderRadius: "32px",
          boxShadow: "0 25px 60px rgba(0,0,0,0.06)",
          zIndex: 10,
          position: "relative"
        }}
      >
        {isModal && (
          <button
            onClick={onClose}
            style={{
              position: "absolute", top: "20px", right: "20px",
              background: "#f1efe7", border: "1px solid rgba(0,0,0,0.08)",
              borderRadius: "50%", width: "32px", height: "32px",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#0f172a", cursor: "pointer", fontWeight: 900
            }}
          >
            ✕
          </button>
        )}
        <div style={{ marginBottom: "24px", display: "flex", justifyContent: "center" }}>
          <FridayLogo size="1.4rem" color="#0f172a" />
        </div>

        <div style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          padding: "6px 14px", borderRadius: "999px",
          background: "#fef08a", border: "1px solid rgba(234,179,8,0.4)",
          color: "#78350f", fontSize: "0.78rem", fontWeight: 800,
          marginBottom: "16px"
        }}>
          <Sparkles size={13} /> Daily Conversation Tone
        </div>

        <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 900, marginBottom: "8px", letterSpacing: "-0.5px", color: "#0f172a" }}>
          How are you feeling today?
        </h2>
        <p style={{ color: "#64748b", fontSize: "0.95rem", maxWidth: "440px", margin: "0 auto 36px", lineHeight: 1.5, fontWeight: 500 }}>
          Pick a mood so Friday can adapt its replies to match your energy today.
        </p>

        <div style={{ 
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px",
          textAlign: "left"
        }}>
          {moods.map((mood, index) => (
            <motion.button
              key={mood.value}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.035 }}
              whileHover={{ scale: 1.02, y: -2, borderColor: mood.color, backgroundColor: "#fdfbf7" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onMoodSelect(mood.value)}
              style={{ 
                padding: "16px 20px", borderRadius: "18px", 
                border: "1px solid rgba(0,0,0,0.08)",
                background: "#faf9f5", color: "#0f172a", cursor: "pointer",
                display: "flex", alignItems: "center", gap: "14px",
                transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.02)"
              }}
            >
              <div style={{ 
                width: "42px", height: "42px", borderRadius: "12px", 
                background: `${mood.color}18`, color: mood.color,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, border: `1px solid ${mood.color}30`
              }}>
                {mood.icon}
              </div>
              <div style={{ overflow: "hidden" }}>
                <p style={{ fontSize: "0.95rem", fontWeight: 800, color: "#0f172a", marginBottom: "2px" }}>{mood.label}</p>
                <p style={{ fontSize: "0.78rem", color: "#64748b", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden", fontWeight: 500 }}>
                  {mood.desc}
                </p>
              </div>
            </motion.button>
          ))}
        </div>

        <button
          onClick={() => onMoodSelect("chill")}
          style={{
            marginTop: "32px", background: "none", border: "none",
            color: "#64748b", fontSize: "0.88rem", fontWeight: 600,
            cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px",
            transition: "color 0.2s"
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "#facc15"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
        >
          Skip for now (Use Default Relaxed Tone) <ArrowRight size={14} />
        </button>
      </motion.div>
    </div>
  );
};

export default MoodPrompt;


