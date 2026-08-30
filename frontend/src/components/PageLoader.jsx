import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Feather,
  Heart,
  Wind,
  Moon,
  Sun,
  Smile,
  Compass,
  MessageCircle,
  Brain,
  Coffee,
  Shield,
  Leaf
} from "lucide-react";

/* ── Notion-style minimal icons relevant to Friday AI Emotional Sanctuary ── */
const NOTION_ICONS = [
  { icon: Feather, label: "Stillness" },
  { icon: Heart, label: "Compassion" },
  { icon: Wind, label: "Breath" },
  { icon: Sparkles, label: "Clarity" },
  { icon: Moon, label: "Rest" },
  { icon: Sun, label: "Warmth" },
  { icon: Smile, label: "Joy" },
  { icon: Compass, label: "Guidance" },
  { icon: MessageCircle, label: "Sanctuary" },
  { icon: Leaf, label: "Grounding" },
  { icon: Coffee, label: "Presence" },
  { icon: Shield, label: "Safety" },
  { icon: Brain, label: "Emotional EQ" },
];

const PageLoader = () => {
  const [iconIndex, setIconIndex] = useState(0);
  const [phase, setPhase] = useState("fast"); // "fast" | "slow" | "done"
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Phase 1 — rapid cycling (90ms)
    intervalRef.current = setInterval(() => {
      setIconIndex((i) => (i + 1) % NOTION_ICONS.length);
    }, 90);

    // Phase 2 — after 1.2s decelerate smoothly
    timeoutRef.current = setTimeout(() => {
      clearInterval(intervalRef.current);
      setPhase("slow");

      intervalRef.current = setInterval(() => {
        setIconIndex((i) => (i + 1) % NOTION_ICONS.length);
      }, 200);

      // Phase 3 — lock on final Friday AI identity
      setTimeout(() => {
        clearInterval(intervalRef.current);
        const finalIdx = NOTION_ICONS.findIndex((i) => i.label === "Sanctuary");
        setIconIndex(finalIdx !== -1 ? finalIdx : 0);
        setPhase("done");
      }, 650);
    }, 1200);

    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(timeoutRef.current);
    };
  }, []);

  const CurrentIcon = NOTION_ICONS[iconIndex].icon;
  const currentLabel = NOTION_ICONS[iconIndex].label;

  return (
    <motion.div
      key="page-loader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.4, ease: "easeInOut" } }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "#0f0f11",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif",
        userSelect: "none"
      }}
    >
      {/* ── Minimal Floating Notion Icon (No Box) ── */}
      <div style={{
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        marginBottom: "16px"
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={iconIndex}
            initial={{ opacity: 0, scale: 0.85, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: -6 }}
            transition={{
              duration: phase === "fast" ? 0.08 : phase === "slow" ? 0.16 : 0.25,
              ease: "easeOut"
            }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: phase === "done" ? "#f4f4f5" : "rgba(244, 244, 245, 0.85)"
            }}
          >
            <CurrentIcon size={38} strokeWidth={1.6} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Notion Minimal Label ── */}
      <div style={{ height: "20px", marginBottom: "28px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <AnimatePresence mode="wait">
          {phase === "done" ? (
            <motion.p
              key="final-label"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "#f4f4f5",
                letterSpacing: "0.8px",
                textTransform: "uppercase"
              }}
            >
              Friday Sanctuary
            </motion.p>
          ) : (
            <motion.p
              key={currentLabel}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.45 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.08 }}
              style={{
                fontSize: "0.78rem",
                fontWeight: 500,
                color: "rgba(244, 244, 245, 0.6)",
                letterSpacing: "0.4px"
              }}
            >
              {currentLabel}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* ── Minimal Hairline Progress Bar ── */}
      <div style={{
        width: "140px",
        height: "1.5px",
        background: "rgba(255, 255, 255, 0.08)",
        borderRadius: "999px",
        overflow: "hidden"
      }}>
        <motion.div
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 2.1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            width: "100%",
            height: "100%",
            background: "rgba(255, 255, 255, 0.85)",
            borderRadius: "999px"
          }}
        />
      </div>
    </motion.div>
  );
};

export default PageLoader;
