import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext.jsx";
import { motion } from "framer-motion";

const ThemeToggle = ({ size = "sm", className = "", style = {} }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      title={isDark ? "Switch to Light theme" : "Switch to Dark theme"}
      aria-label="Toggle theme"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size === "sm" ? "32px" : "38px",
        height: size === "sm" ? "32px" : "38px",
        borderRadius: "8px",
        border: "1px solid var(--border)",
        background: "var(--bg-soft)",
        color: "var(--text)",
        cursor: "pointer",
        transition: "all 0.2s ease",
        ...style
      }}
      className={className}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, opacity: 0, scale: 0.7 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        exit={{ rotate: 90, opacity: 0, scale: 0.7 }}
        transition={{ duration: 0.2 }}
        style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        {isDark ? <Sun size={size === "sm" ? 15 : 18} /> : <Moon size={size === "sm" ? 15 : 18} />}
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
