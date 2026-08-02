import React from "react";
import { motion } from "framer-motion";


const FridayLogo = ({ size = "1.4rem", color = "#0f172a", showBadge = true }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
        fontFamily: "'Georgia', 'Playfair Display', 'Inter', serif",
        position: "relative",
        userSelect: "none",
        cursor: "pointer",
      }}
    >
      {/* Retro Vintage Stamp Emblem (No Glow) */}
      {showBadge && (
        <div
          style={{
            width: `calc(${size} * 1.4)`,
            height: `calc(${size} * 1.4)`,
            borderRadius: "50%",
            background: "#fef3c7",
            border: "2px solid #b45309",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#78350f",
            flexShrink: 0,
            boxShadow: "0 2px 5px rgba(0,0,0,0.06)",
            fontWeight: 900,
            fontSize: `calc(${size} * 0.7)`
          }}
        >
          ★
        </div>
      )}

      {/* Retro Wordmark */}
      <span
        style={{
          fontSize: size,
          lineHeight: 1,
          color: color,
          fontWeight: 800,
          fontFamily: "'Georgia', 'Times New Roman', serif",
          letterSpacing: "-0.3px"
        }}
      >
        Friday
      </span>

      {/* Retro Stamp Tag */}
      <span
        style={{
          fontSize: `calc(${size} * 0.42)`,
          fontWeight: 900,
          color: "#78350f",
          padding: "2px 8px",
          borderRadius: "6px",
          background: "#fef08a",
          border: "1.5px solid #d97706",
          letterSpacing: "1px",
          fontFamily: "'Inter', sans-serif",
          textTransform: "uppercase"
        }}
      >
        AI
      </span>
    </motion.div>
  );
};

export default FridayLogo;



