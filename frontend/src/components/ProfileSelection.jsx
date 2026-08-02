import React from "react";
import { motion } from "framer-motion";
import { Compass, Zap, Target, Check } from "lucide-react";

const options = {
  hobbies: {
    label: "Hobbies & Interests",
    icon: <Compass size={16} color="#facc15" />,
    items: [
      "Coding", "AI Research", "Gaming", "Design", "Music Production", 
      "Travel", "Cooking", "Digital Art", "Photography", "Creative Writing",
    ]
  },
  strengths: {
    label: "Your Strengths",
    icon: <Zap size={16} color="#d97706" fill="#facc15" />,
    items: [
      "Rapid Learning", "Problem Solving", "Strategic Thinking", "Deep Focus", 
      "Data Analysis", "Empathy", "Leadership", "Adaptability", 
      "Precision", "Resilience",
    ]
  },
  weaknesses: {
    label: "Areas You Want to Work On",
    icon: <Target size={16} color="#f59e0b" />,
    items: [
      "Procrastination", "Overthinking", "Impatience", "Perfectionism", 
      "Time Management", "Public Speaking", "Organization", 
      "Task Switch Fatigue", "Decision Fatigue", "Delegation",
    ]
  },
};

const ProfileSelection = ({ selections, onSelect }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "26px" }}>
      {Object.keys(options).map((category) => {
        const catObj = options[category];
        const selectedList = selections[category] || [];

        // Include any user-saved items that might not be in the default list
        const displayItems = Array.from(
          new Set([...catObj.items, ...selectedList])
        );

        return (
          <div key={category} style={{ textAlign: "left" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {catObj.icon}
                <h3 style={{ 
                  fontSize: "0.95rem", color: "#0f172a", 
                  fontWeight: 800
                }}>
                  {catObj.label}
                </h3>
              </div>
              <span style={{ 
                fontSize: "0.75rem", 
                padding: "3px 12px", 
                borderRadius: "999px", 
                background: selectedList.length > 0 ? "#fef08a" : "#f1efe7",
                color: selectedList.length > 0 ? "#78350f" : "#64748b",
                fontWeight: 800 
              }}>
                {selectedList.length > 0 ? `${selectedList.length} selected` : "Not selected anything"}
              </span>
            </div>

            {selectedList.length === 0 && (
              <p style={{ fontSize: "0.8rem", color: "#94a3b8", fontStyle: "italic", marginBottom: "10px" }}>
                Not selected anything yet. Click below to add.
              </p>
            )}

            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {displayItems.map((item) => {
                const selected = selectedList.some(
                  (s) => String(s).trim().toLowerCase() === String(item).trim().toLowerCase()
                );

                return (
                  <motion.button
                    key={item}
                    type="button"
                    whileHover={{ scale: 1.03, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onSelect(category, item)}
                    style={{ 
                      padding: "9px 16px", 
                      borderRadius: "14px", 
                      fontSize: "0.85rem",
                      border: selected ? "1.5px solid #d97706" : "1px solid rgba(0,0,0,0.08)",
                      background: selected 
                        ? "linear-gradient(135deg, #facc15 0%, #f59e0b 100%)" 
                        : "#f8fafc",
                      color: selected ? "#0e0a05" : "#334155",
                      cursor: "pointer", 
                      transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)", 
                      fontWeight: selected ? 800 : 600,
                      boxShadow: selected ? "0 4px 15px rgba(250,204,21,0.4)" : "0 2px 6px rgba(0,0,0,0.02)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px"
                    }}
                  >
                    {selected && <Check size={14} color="#0e0a05" />}
                    {item}
                  </motion.button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProfileSelection;


