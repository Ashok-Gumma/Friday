import React from "react";
import { motion } from "framer-motion";

const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ 
        duration: 0.18, 
        ease: "easeOut" 
      }}
      style={{ 
        width: "100%", 
        minHeight: "100vh",
        background: "var(--bg)"
      }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;

