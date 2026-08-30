import React from "react";
import { motion } from "framer-motion";

const FridayLogo = ({ size = "1.3rem", color = "#1f2937", showBadge = true }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        position: "relative",
        userSelect: "none",
        cursor: "pointer",
      }}
    >
      {/* Editorial Terracotta Accent Dot */}
      {showBadge && (
        <span
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "#c25e4c",
            display: "inline-block"
          }}
        />
      )}

      {/* Wordmark in Clean Display Font */}
      <span
        style={{
          fontSize: size,
          lineHeight: 1,
          color: color,
          fontWeight: 700,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          letterSpacing: "0.5px",
          textTransform: "uppercase"
        }}
      >
        FRIDAY <span style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 400, fontSize: "1.25em", color: "#c25e4c", textTransform: "none" }}>ai</span>
      </span>

      {/* Subtle Version Pill */}
      <span
        style={{
          fontSize: `calc(${size} * 0.45)`,
          fontWeight: 600,
          color: "#8c5344",
          padding: "2px 8px",
          borderRadius: "999px",
          background: "#fbf0ee",
          letterSpacing: "0.5px",
          textTransform: "uppercase"
        }}
      >
        Mind v4.2
      </span>
    </motion.div>
  );
};

export default FridayLogo;
