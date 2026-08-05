import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import FridayLogo from "./FridayLogo";

const statusSteps = [
  "Initializing Friday neural mesh...",
  "Connecting to orbital nodes...",
  "Loading your preferences...",
  "Ready to assist."
];

const PageLoader = () => {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev < statusSteps.length - 1 ? prev + 1 : prev));
    }, 450);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        scale: 0.98,
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } 
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        backgroundColor: "#000000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        overflow: "hidden"
      }}
    >
      {/* Soft Ambient White Glow */}
      <div 
        style={{
          position: "absolute",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none"
        }}
      />

      <div style={{ position: "relative", marginBottom: "28px" }}>
        <FridayLogo size="2.4rem" showBadge={true} color="#ffffff" />
      </div>

      {/* Status Text Animation with Mix of Curly Accent */}
      <motion.div
        key={stepIndex}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25 }}
        style={{
          color: "#e4e4e7",
          fontSize: "0.95rem",
          fontWeight: 600,
          height: "24px",
          textAlign: "center",
          fontFamily: "'Inter', sans-serif"
        }}
      >
        <span className="font-mono" style={{ fontSize: "0.85rem", color: "#a1a1aa" }}>
          {statusSteps[stepIndex]}
        </span>
      </motion.div>

      {/* Sleek Minimalist Progress Bar */}
      <div 
        style={{
          width: "220px",
          height: "3px",
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "999px",
          overflow: "hidden",
          marginTop: "24px",
          position: "relative"
        }}
      >
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "0%" }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
          style={{
            width: "100%",
            height: "100%",
            background: "#ffffff",
            borderRadius: "999px",
            boxShadow: "0 0 12px rgba(255, 255, 255, 0.8)"
          }}
        />
      </div>
    </motion.div>
  );
};

export default PageLoader;
