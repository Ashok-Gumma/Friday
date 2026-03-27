import React from "react";
import { motion } from "framer-motion";

const options = {
  hobbies: [
    "Coding", "Reading", "Gaming", "Sports", "Music", 
    "Travel", "Cooking", "Art", "Photography", "Writing",
  ],
  strengths: [
    "Quick Learner", "Creative", "Disciplined", "Communicative", 
    "Analytical", "Empathetic", "Leadership", "Adaptable", 
    "Detail-Oriented", "Resilient",
  ],
  weaknesses: [
    "Procrastination", "Overthinking", "Impatience", "Perfectionism", 
    "Time Management", "Public Speaking", "Organization", 
    "Distraction", "Decision-Making", "Delegation",
  ],
};

const ProfileSelection = ({ selections, onSelect }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginTop: "20px" }}>
      {Object.keys(options).map((category) => (
        <div key={category}>
          <h3 style={{ 
            fontSize: "0.9rem", color: "var(--text-muted)", 
            marginBottom: "12px", letterSpacing: "1px", textTransform: "uppercase" 
          }}>
            {category}
          </h3>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {options[category].map((item) => {
              const selected = selections[category]?.includes(item);

              return (
                <motion.button
                  key={item}
                  type="button"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelect(category, item)}
                  style={{ 
                    padding: "6px 14px", borderRadius: "8px", fontSize: "0.75rem",
                    border: selected ? "1px solid #fff" : "1px solid rgba(255,255,255,0.06)",
                    background: selected ? "#fff" : "rgba(255,255,255,0.02)",
                    color: selected ? "#000" : "rgba(255,255,255,0.4)",
                    cursor: "pointer", transition: "all 0.2s ease", 
                    fontWeight: selected ? 800 : 500,
                    boxShadow: selected ? "0 4px 15px rgba(255,255,255,0.1)" : "none",
                    backdropFilter: "blur(5px)"
                  }}
                >
                  {item}
                </motion.button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProfileSelection;
