import React from "react";
import { motion } from "framer-motion";

const FridayLogo = ({ size = "1.4rem", color = "#ffffff", showBadge = true }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
        position: "relative",
        userSelect: "none",
        cursor: "pointer",
      }}
    >
      {/* Sleek Minimal Emblem */}
      {showBadge && (
        <div
          style={{
            width: `calc(${size} * 1.3)`,
            height: `calc(${size} * 1.3)`,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.08)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            flexShrink: 0,
            boxShadow: "0 0 15px rgba(255, 255, 255, 0.15)",
            fontWeight: 800,
            fontSize: `calc(${size} * 0.65)`
          }}
        >
          ✦
        </div>
      )}

      {/* Wordmark with curly & clean typography blend */}
      <span
        style={{
          fontSize: size,
          lineHeight: 1,
          color: color,
          fontWeight: 800,
          fontFamily: "'Inter', sans-serif",
          letterSpacing: "-0.5px"
        }}
      >
        Friday <span style={{ fontFamily: "'Caveat', cursive", fontWeight: 600, fontSize: "1.15em", color: "#e4e4e7" }}>ai</span>
      </span>

      {/* Sleek Tag */}
      <span
        style={{
          fontSize: `calc(${size} * 0.38)`,
          fontWeight: 800,
          color: "#000000",
          padding: "2px 7px",
          borderRadius: "999px",
          background: "#ffffff",
          letterSpacing: "1px",
          fontFamily: "'JetBrains Mono', monospace",
          textTransform: "uppercase"
        }}
      >
        v4.2
      </span>
    </motion.div>
  );
};

export default FridayLogo;
