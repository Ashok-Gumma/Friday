import React, { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

const CustomCursor = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [hoverText, setHoverText] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Mouse position motion values
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for cursor follower
  const springConfig = { damping: 28, stiffness: 350, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Check touch screen
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
      setIsTouchDevice(true);
      return;
    }

    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      // Check hover target
      const target = e.target;
      const interactiveEl = target.closest("button, a, input, select, textarea, [data-cursor], .clickable");
      
      if (interactiveEl) {
        setIsHovered(true);
        const customText = interactiveEl.getAttribute("data-cursor");
        setHoverText(customText || "");
      } else {
        setIsHovered(false);
        setHoverText("");
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [mouseX, mouseY, isVisible]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <>
      {/* Small Precise Center Dot */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          x: mouseX,
          y: mouseY,
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: "#f59e0b",
          boxShadow: "0 0 10px #f59e0b",
          pointerEvents: "none",
          zIndex: 999999,
          transform: "translate(-50%, -50%)",
        }}
        animate={{
          scale: isHovered ? 0 : 1,
          opacity: isHovered ? 0 : 1,
        }}
        transition={{ duration: 0.15 }}
      />

      {/* Outer Smooth Trailing Magnetic Ring */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          x: cursorX,
          y: cursorY,
          width: isHovered ? 48 : 28,
          height: isHovered ? 48 : 28,
          borderRadius: "50%",
          border: isHovered ? "1.5px solid rgba(245, 158, 11, 0.8)" : "1.5px solid rgba(245, 158, 11, 0.4)",
          backgroundColor: isHovered ? "rgba(245, 158, 11, 0.12)" : "rgba(245, 158, 11, 0.03)",
          backdropFilter: isHovered ? "blur(4px)" : "none",
          boxShadow: isHovered ? "0 0 20px rgba(245, 158, 11, 0.35)" : "none",
          pointerEvents: "none",
          zIndex: 999998,
          transform: "translate(-50%, -50%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        animate={{
          scale: isHovered ? 1.2 : 1,
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {hoverText && (
          <span style={{ fontSize: "9px", fontWeight: 800, color: "#f59e0b", letterSpacing: "1px", textTransform: "uppercase" }}>
            {hoverText}
          </span>
        )}
      </motion.div>
    </>
  );
};

export default CustomCursor;
