import React from "react";
import { motion } from "framer-motion";

const PageLoader = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        y: "-100%",
        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 1.2 } 
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "#000000", // Changed from Orange to Black
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        overflow: "hidden"
      }}
    >
      <div style={{ position: "relative", display: "flex", alignItems: "flex-start" }}>
        <motion.h1
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.21, 1, 0.36, 1], delay: 0.2 }}
          style={{
            fontSize: "clamp(1.5rem, 6vw, 4rem)", // Reduced size again
            fontWeight: 400, // Bebas Neue is bold by default
            color: "#ff4d4d",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            margin: 0,
            lineHeight: 1,
            fontFamily: "'Bebas Neue', sans-serif",
          }}

        >
          FRIDAY
        </motion.h1>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{
            fontSize: "clamp(0.6rem, 2vw, 1.5rem)", // Reduced size proportionally
            fontWeight: 400,
            color: "#ff4d4d", // Changed from Black to Red
            marginLeft: "6px",
            marginTop: "6px"
          }}
        >
          ®
        </motion.span>

      </div>
      
      {/* Subtle progress indicator or accent */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, ease: "easeInOut", delay: 0.2 }}
        style={{
          position: "absolute",
          bottom: "10%",
          left: "10%",
          right: "10%",
          height: "2px",
          background: "rgba(0,0,0,0.1)",
          originX: 0
        }}
      />
    </motion.div>
  );
};

export default PageLoader;
