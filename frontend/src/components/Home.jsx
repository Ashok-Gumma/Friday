import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Cpu, Zap, Shield, Sparkles, Globe, Command } from "lucide-react";
import logo from "../assets/red-logo.png";
import FridayLogo from "./FridayLogo.jsx";


/**
 * SmoothScroll - A wrapper that intercepts native scroll and animates a content container.
 */


/**
 * CustomPill - A reusable pill container with layered construction and glow effect.
 */
const CustomPill = ({ children, variant = "dark", className = "", ...props }) => {
  const isDark = variant === "dark";
  
  return (
    <div
      style={{
        position: "relative",
        padding: "0.6px",
        borderRadius: "9999px",
        background: "rgba(255, 255, 255, 1)",
        display: "inline-block",
        boxShadow: isDark ? "0 4px 15px rgba(0,0,0,0.5)" : "0 4px 20px rgba(255,255,255,0.2)",
      }}
      className={className}
      {...props}
    >
      <div
        style={{
          background: isDark ? "#000" : "#fff",
          borderRadius: "9999px",
          padding: "11px 29px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glow Streak Effect */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "80%",
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)",
            filter: "blur(1px)",
          }}
        />
        {children}
      </div>
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) navigate("/chat");
  }, [token, navigate]);

  return (
    <div
      style={{
        backgroundColor: "#000000",
        minHeight: "100vh",
        color: "#ffffff",
        fontFamily: "'General Sans', sans-serif",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {/* Cinematic Background Layer */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          backgroundColor: "#000",
        }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "contrast(1.05) brightness(0.8) saturate(1.1)",
            willChange: "transform",
            opacity: 0.9
          }}
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260217_030345_246c0224-10a4-422c-b324-070b7c0eceda.mp4"
            type="video/mp4"
          />
        </video>

        {/* Natural Lens Falloff (Vignette) */}
        <div style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          background: "radial-gradient(circle at center, transparent 20%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.6) 100%)",
          pointerEvents: "none"
        }} />

        {/* Global Darkening for Readability */}
        <div style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          pointerEvents: "none"
        }} />

        {/* Atmospheric Light Leaks */}
        <motion.div
          animate={{
            background: [
              "radial-gradient(circle at 10% 20%, rgba(255, 255, 255, 0.03) 0%, transparent 60%)",
              "radial-gradient(circle at 90% 80%, rgba(255, 255, 255, 0.03) 0%, transparent 60%)",
              "radial-gradient(circle at 10% 20%, rgba(255, 255, 255, 0.03) 0%, transparent 60%)",
            ]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 3,
            pointerEvents: "none"
          }}
        />

        {/* Subtle Shifting Light Stream */}
        <motion.div
          animate={{
            x: ["-100%", "100%"]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.01), transparent)",
            zIndex: 4,
            pointerEvents: "none"
          }}
        />
      </div>



        <div style={{ position: "relative", zIndex: 10 }}>
          {/* Navbar */}
          <header
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "clamp(20px, 4vw, 32px) clamp(20px, 8vw, 120px)",
              width: "100%",
            }}
            className="navbar-responsive"
          >
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", flexShrink: 0 }} 
              onClick={() => navigate("/")}
            >
              <FridayLogo size="clamp(1.1rem, 3vw, 1.3rem)" />
            </motion.div>


            {/* Right Side: Auth Links */}
            <div style={{ display: "flex", gap: "clamp(8px, 2vw, 12px)", flexShrink: 0 }}>
              <Link to="/login" style={{ textDecoration: "none" }}>
                <CustomPill variant="dark" style={{ padding: "0.4px" }}>
                  <span style={{ fontSize: "clamp(12px, 2vw, 14px)", fontWeight: 500, color: "#fff", padding: "8px 20px" }}>Login</span>
                </CustomPill>
              </Link>
              <Link to="/signup" style={{ textDecoration: "none" }}>
                <CustomPill variant="light" style={{ padding: "0.4px" }}>
                  <span style={{ fontSize: "clamp(12px, 2vw, 14px)", fontWeight: 500, color: "#000", padding: "8px 20px" }}>Sign Up</span>
                </CustomPill>
              </Link>
            </div>
          </header>

          {/* Hero Content */}
          <section
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              paddingTop: "clamp(160px, 25vh, 280px)",
              paddingBottom: "clamp(60px, 10vh, 102px)",
              paddingLeft: "20px",
              paddingRight: "20px",
            }}
            className="hero-responsive"
          >
            {/* Badge/Pill */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                borderRadius: "20px",
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                marginBottom: "clamp(24px, 5vh, 40px)",
              }}
            >
              <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#ff4d4d", boxShadow: "0 0 10px #ff4d4d" }} />
              <span style={{ fontSize: "clamp(11px, 2vw, 13px)", fontWeight: 500, color: "rgba(255, 255, 255, 0.6)" }}>
                Neural Synchronization
                <span style={{ color: "#fff" }}> v1.0 Private Beta</span>
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{
                fontSize: "clamp(32px, 8vw, 56px)",
                fontWeight: 500,
                lineHeight: 1.2,
                maxWidth: "800px",
                marginBottom: "24px",
                background: "linear-gradient(144.5deg, #ffffff 28%, rgba(255, 255, 255, 0.4) 115%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
              className="heading-responsive"
            >
              Your Personalized AI Command Center
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                fontSize: "clamp(14px, 2.5vw, 15px)",
                fontWeight: 400,
                color: "rgba(255, 255, 255, 0.7)",
                maxWidth: "680px",
                lineHeight: 1.6,
                margin: "0 auto clamp(24px, 5vh, 40px)",
              }}
            >
              Experience the future of human-AI collaboration. Friday adapts to your unique workflow, 
              providing seamless neural synchronization and high-performance mission control with 
              absolute data sovereignty.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Link to="/signup" style={{ textDecoration: "none" }}>
                <CustomPill variant="light">
                  <span style={{ fontSize: "clamp(13px, 2vw, 14px)", fontWeight: 600, color: "#000" }}>Get Started Now</span>
                </CustomPill>
              </Link>
            </motion.div>
          </section>

          {/* Project Features Section */}
          <section style={{ padding: "clamp(60px, 15vh, 120px) 5%", background: "transparent" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                style={{ textAlign: "center", marginBottom: "clamp(40px, 10vh, 80px)" }}
              >
                <h2 style={{ fontSize: "clamp(2rem, 6vw, 3rem)", fontWeight: 500, marginBottom: "20px", background: "linear-gradient(to bottom, #fff, rgba(255,255,255,0.4))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AI Command Core</h2>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "clamp(0.9rem, 2vw, 1.1rem)" }}>Advanced neural infrastructure for high-performance sensory immersion.</p>
              </motion.div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "clamp(16px, 3vw, 24px)" }}>
                <FeatureCard 
                  delay={0}
                  icon={<Cpu size={24} />} 
                  title="Neural Synchronization" 
                  desc="Friday adapts to your unique cognitive load by analyzing session mood and past interactions."
                />
                <FeatureCard 
                  delay={1}
                  icon={<Zap size={24} />} 
                  title="Zero-Latency Backbone" 
                  desc="Seamless transition between high-speed text and atmospheric voice commands with absolute temporal accuracy."
                />
                <FeatureCard 
                  delay={2}
                  icon={<Shield size={24} />} 
                  title="Sovereign Data Isolation" 
                  desc="A dedicated neural sandbox for every session, ensuring sensitive mission data remains physically isolated."
                />
                <FeatureCard 
                  delay={3}
                  icon={<Sparkles size={24} />} 
                  title="Contextual Intelligence" 
                  desc="Beyond simple queries. Maintains a deep understanding of your professional strengths and weaknesses."
                />
              </div>
            </div>
          </section>

          {/* Global Footer */}
          <footer style={{ 
            textAlign: "center", padding: "clamp(80px, 20vh, 180px) 20px 80px", 
            borderTop: "1px solid rgba(255,255,255,0.05)" 
          }}>
            <div style={{ display: "flex", justifyContent: "center", gap: "clamp(24px, 6vw, 40px)", marginBottom: "30px", color: "rgba(255,255,255,0.3)" }}>
              <Globe size={20} />
              <Command size={20} />
              <Zap size={20} />
            </div>
            <p style={{ fontSize: "0.8rem", letterSpacing: "2px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>
              &copy; 2026 FRIDAY AI CORE. ALL SYSTEMS OPERATIONAL.
            </p>
          </footer>
        </div>


      <style>{`
        * {
          box-sizing: border-box;
        }
        html, body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
          background: #000;
        }
        @media (max-width: 768px) {
          .navbar-responsive {
            justify-content: center !important;
            flex-direction: column;
            gap: 16px;
          }
          .hero-responsive {
            padding-top: 140px !important;
          }
        }
      `}</style>
    </div>
  );
};

/**
 * FeatureCard - Optimized for performance with smooth scroll entrance and subtle floating.
 */
const FeatureCard = ({ icon, title, desc, delay = 0 }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ 
      duration: 0.8, 
      delay: delay * 0.1,
      ease: [0.21, 1, 0.36, 1] 
    }}
    style={{ willChange: "transform, opacity" }}
  >
    <motion.div
      animate={{ 
        y: [0, -8, 0],
      }}
      transition={{ 
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay * 0.5
      }}
      whileHover={{ y: -5, borderColor: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.06)" }}
      style={{ 
        padding: "40px", 
        background: "rgba(20, 20, 20, 0.8)", // Solid dark glass-like background without blur
        border: "1px solid rgba(255, 255, 255, 0.1)", 
        borderRadius: "24px",
        textAlign: "left",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
        position: "relative",
        transition: "border 0.3s ease, background 0.3s ease, transform 0.3s ease",
        willChange: "transform"
      }}
    >
      <div style={{ 
        width: "52px", height: "52px", borderRadius: "14px", 
        background: "rgba(255, 77, 77, 0.15)", color: "#ff4d4d",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: "24px",
      }}>
        {icon}
      </div>
      <h3 style={{ fontSize: "1.4rem", fontWeight: 600, color: "#fff", marginBottom: "12px" }}>{title}</h3>
      <p style={{ color: "rgba(255, 255, 255, 0.5)", lineHeight: 1.6, fontSize: "0.95rem" }}>{desc}</p>
      
      <div style={{
        position: "absolute",
        top: 0,
        left: "15%",
        width: "70%",
        height: "1px",
        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
      }} />
    </motion.div>
  </motion.div>
);

export default Home;