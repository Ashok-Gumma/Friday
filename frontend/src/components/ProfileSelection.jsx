import React from "react";
import { motion } from "framer-motion";
import { Compass, Zap, Target, Check } from "lucide-react";

const options = {
  hobbies: {
    label: "Hobbies & Interests",
    icon: <Compass size={16} />,
    items: [
      "Coding", "AI Research", "Gaming", "Design", "Music Production", 
      "Travel", "Cooking", "Digital Art", "Photography", "Creative Writing",
    ]
  },
  strengths: {
    label: "Your Strengths",
    icon: <Zap size={16} />,
    items: [
      "Rapid Learning", "Problem Solving", "Strategic Thinking", "Deep Focus", 
      "Data Analysis", "Empathy", "Leadership", "Adaptability", 
      "Precision", "Resilience",
    ]
  },
  weaknesses: {
    label: "Areas You Want to Work On",
    icon: <Target size={16} />,
    items: [
      "Procrastination", "Overthinking", "Impatience", "Perfectionism", 
      "Time Management", "Public Speaking", "Organization", 
      "Task Switch Fatigue", "Decision Fatigue", "Delegation",
    ]
  },
};

const ProfileSelection = ({ selections, onSelect }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {Object.keys(options).map((category) => {
        const catObj = options[category];
        const selectedList = selections[category] || [];

        // Include any user-saved items that might not be in the default list
        const displayItems = Array.from(
          new Set([...catObj.items, ...selectedList])
        );

        return (
          <div key={category} style={{ textAlign: "left" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text)" }}>
                {catObj.icon}
                <h3 style={{ 
                  fontSize: "0.92rem", color: "var(--text)", 
                  fontWeight: 700
                }}>
                  {catObj.label}
                </h3>
              </div>
              <span style={{ 
                fontSize: "0.72rem", 
                padding: "2px 10px", 
                borderRadius: "6px", 
                background: selectedList.length > 0 ? "var(--accent)" : "var(--bg-card)",
                color: selectedList.length > 0 ? "var(--bg)" : "var(--text-muted)",
                border: "1px solid var(--border)",
                fontWeight: 600 
              }}>
                {selectedList.length > 0 ? `${selectedList.length} selected` : "None"}
              </span>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {displayItems.map((item) => {
                const selected = selectedList.some(
                  (s) => String(s).trim().toLowerCase() === String(item).trim().toLowerCase()
                );

                return (
                  <motion.button
                    key={item}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelect(category, item)}
                    style={{ 
                      padding: "6px 13px", 
                      borderRadius: "8px", 
                      fontSize: "0.82rem",
                      border: selected ? "1px solid var(--text)" : "1px solid var(--border)",
                      background: selected ? "var(--text)" : "var(--bg-card)",
                      color: selected ? "var(--bg)" : "var(--text)",
                      cursor: "pointer", 
                      transition: "all 0.15s ease", 
                      fontWeight: selected ? 600 : 500,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px"
                    }}
                  >
                    {selected && <Check size={13} />}
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
