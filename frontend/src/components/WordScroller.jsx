import React from "react";
import { motion } from "framer-motion";

const WordScroller = ({ words, duration = 20, top = "20%", opacity = 0.4 }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      style={{ 
        overflow: "hidden", 
        whiteSpace: "nowrap", 
        width: "100vw",
        position: "absolute",
        top: top,
        left: 0,
        zIndex: 1,
        pointerEvents: "none"
      }}
    >
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: duration,
            ease: "linear",
          },
        }}
        style={{ display: "inline-flex", gap: "100px" }}
      >
        {/* Render words twice for seamless looping */}
        {[...words, ...words].map((word, index) => (
          <span
            key={index}
            style={{
              fontSize: "clamp(4rem, 20vw, 15rem)",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "20px",
              color: "#ff0000",
              opacity: opacity,
              textShadow: "0 0 30px rgba(255, 0, 0, 0.3)",
              whiteSpace: "nowrap",
              fontFamily: "'Outfit', sans-serif"
            }}
          >
            {word}
          </span>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default WordScroller;
