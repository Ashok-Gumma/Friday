import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import FridayLogo from "./FridayLogo";

const statusSteps = [
  "Starting Friday...",
  "Setting up your workspace...",
  "Loading your preferences...",
  "Ready to help!"
];

const PageLoader = () => {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev < statusSteps.length - 1 ? prev + 1 : prev));
    }, 400);
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
        backgroundColor: "#faf9f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        overflow: "hidden"
      }}
    >
      {/* Background Glow */}
      <div 
        style={{
          position: "absolute",
          width: "350px",
          height: "350px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(250,204,21,0.25) 0%, transparent 70%)",
          filter: "blur(50px)",
          pointerEvents: "none"
        }}
      />

      <div style={{ position: "relative", marginBottom: "28px" }}>
        <FridayLogo size="2.2rem" showDot={true} color="#0f172a" />
      </div>

      {/* Status Text Animation */}
      <motion.p
        key={stepIndex}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25 }}
        style={{
          color: "#0f172a",
          fontSize: "0.95rem",
          fontWeight: 800,
          height: "20px",
          textAlign: "center",
          fontFamily: "'Inter', sans-serif"
        }}
      >
        {statusSteps[stepIndex]}
      </motion.p>

      {/* Progress Bar Container */}
      <div 
        style={{
          width: "200px",
          height: "4px",
          background: "rgba(0, 0, 0, 0.08)",
          borderRadius: "999px",
          overflow: "hidden",
          marginTop: "20px",
          position: "relative"
        }}
      >
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "0%" }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(90deg, #facc15, #f59e0b)",
            borderRadius: "999px"
          }}
        />
      </div>
    </motion.div>
  );
};

export default PageLoader;


