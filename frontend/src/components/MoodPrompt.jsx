import React from "react";
import { motion } from "framer-motion";
import chatBg from "../assets/chat-bg.png";

const moods = [
  { label: "Motivated 💪", value: "motivated", color: "#ef4444" },
  { label: "Tired 😴", value: "tired", color: "#a1a1aa" },
  { label: "Happy 😊", value: "happy", color: "#eab308" },
  { label: "Stressed 😰", value: "stressed", color: "#ec4899" },
  { label: "Focused 🎯", value: "focused", color: "#6366f1" },
  { label: "Relaxed 😌", value: "relaxed", color: "#22c55e" },
  { label: "Anxious 😟", value: "anxious", color: "#8b5cf6" },
  { label: "Bored 🥱", value: "bored", color: "#3b82f6" },
];

const MoodPrompt = ({ onMoodSelect }) => {
  return (
    <div style={{ 
      height: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "#000", position: "relative", overflow: "hidden"
    }}>
      <div style={{ 
        position: "fixed", inset: 0, zIndex: 0, 
        backgroundImage: `url(${chatBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: "brightness(0.7)"
      }} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass"
        style={{ 
          width: "90%", maxWidth: "500px", padding: "40px", 
          textAlign: "center", boxShadow: "var(--shadow-lg)",
          zIndex: 1000 // Ensure the modal content is above the background
        }}
      >
        <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "8px" }}>Hey friend! 👋</h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "32px" }}>How are you feeling today?</p>

        <div style={{ 
          display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" 
        }}>
          {moods.map((mood, index) => (
            <motion.button
              key={mood.value}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.05)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onMoodSelect(mood.value)}
              style={{ 
                padding: "16px", borderRadius: "12px", border: "1px solid var(--glass-border)",
                background: "rgba(255,255,255,0.02)", color: "#fff", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                fontSize: "1rem", fontWeight: 500
              }}
            >
              <span style={{ color: mood.color }}>●</span> {mood.label}
            </motion.button>
          ))}
        </div>

        <p style={{ marginTop: "32px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
          Your selection helps synchronize the AI's neural profile.
        </p>
      </motion.div>
    </div>
  );
};

export default MoodPrompt;
