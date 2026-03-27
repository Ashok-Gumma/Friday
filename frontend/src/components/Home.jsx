import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Cpu, Zap, Shield, Sparkles, Globe, Command } from "lucide-react";
import logo from "../assets/red-logo.png";

/**
 * SmoothScroll - A wrapper that intercepts native scroll and animates a content container.
 */
const SmoothScroll = ({ children }) => {
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

  // Get the native scroll position
  const { scrollY } = useScroll();

  // Create a spring-smoothed version of the scroll position
  const smoothY = useSpring(scrollY, {
    damping: 25,
    stiffness: 100,
    mass: 0.5,
    restDelta: 0.001
  });

  // Transform the smooth scroll into a translateY for the content
  const y = useTransform(smoothY, (value) => -value);

  useEffect(() => {
    if (!contentRef.current) return;

    const updateHeight = () => {
      if (contentRef.current) {
        // Use offsetHeight as it's generally more stable for height measurement
        setContentHeight(contentRef.current.offsetHeight);
      }
    };

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(contentRef.current);

    // Initial check
    updateHeight();

    return () => resizeObserver.disconnect();
  }, [children]);

  return (
    <>
      <motion.div
        ref={contentRef}
        style={{
          y,
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          width: "100%",
          willChange: "transform",
          zIndex: 10,
          overflow: "hidden" // Prevent internal scrolling
        }}
      >
        {children}
      </motion.div>
      
      {/* Invisible spacer to enable native scroll height - absolute to avoid horizontal scrollbar */}
      <div style={{ 
        height: contentHeight,
        width: "1px",
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
        opacity: 0
      }} />
    </>
  );
};

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
      {/* Fullscreen Video Background */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none"
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
            willChange: "transform"
          }}
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260217_030345_246c0224-10a4-422c-b324-070b7c0eceda.mp4"
            type="video/mp4"
          />
        </video>
        {/* 50% Black Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        />
      </div>

      <SmoothScroll>
        <div style={{ position: "relative", zIndex: 10 }}>
          {/* Navbar */}
          <header
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "20px 120px",
            }}
            className="navbar-responsive"
          >
            {/* Left Side: Friday Branding */}
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }} 
              onClick={() => navigate("/")}
            >
              <div style={{ background: "rgba(255,255,255,0.05)", padding: "8px", borderRadius: "10px", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <img src={logo} alt="Logo" style={{ width: "24px", height: "24px" }} />
              </div>
              <span style={{ fontSize: "1.2rem", fontWeight: 700, letterSpacing: "1px", color: "#ff4d4d", textShadow: "0 0 10px rgba(255, 77, 77, 0.3)" }}>Friday</span>
            </motion.div>

            {/* Right Side: Auth Links */}
            <div style={{ display: "flex", gap: "12px" }}>
              <Link to="/login" style={{ textDecoration: "none" }}>
                <CustomPill variant="dark">
                  <span style={{ fontSize: "14px", fontWeight: 500, color: "#fff" }}>Login</span>
                </CustomPill>
              </Link>
              <Link to="/signup" style={{ textDecoration: "none" }}>
                <CustomPill variant="light">
                  <span style={{ fontSize: "14px", fontWeight: 500, color: "#000" }}>Sign Up</span>
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
              paddingTop: "280px",
              paddingBottom: "102px",
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
                marginBottom: "40px",
              }}
            >
              <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#ff4d4d", boxShadow: "0 0 10px #ff4d4d" }} />
              <span style={{ fontSize: "13px", fontWeight: 500, color: "rgba(255, 255, 255, 0.6)" }}>
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
                fontSize: "56px",
                fontWeight: 500,
                lineHeight: 1.28,
                maxWidth: "800px",
                marginBottom: "24px",
                background: "linear-gradient(144.5deg, #ffffff 28%, rgba(255, 255, 255, 0.1) 115%)",
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
                fontSize: "15px",
                fontWeight: 400,
                color: "rgba(255, 255, 255, 0.7)",
                maxWidth: "680px",
                lineHeight: 1.6,
                margin: "0 auto 40px",
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
                  <span style={{ fontSize: "14px", fontWeight: 500, color: "#000" }}>Get Started Now</span>
                </CustomPill>
              </Link>
            </motion.div>
          </section>

          {/* Project Features Section */}
          <section style={{ padding: "120px 5%", background: "transparent" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                style={{ textAlign: "center", marginBottom: "80px" }}
              >
                <h2 style={{ fontSize: "3rem", fontWeight: 500, marginBottom: "20px", background: "linear-gradient(to bottom, #fff, rgba(255,255,255,0.4))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AI Command Core</h2>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "1.1rem" }}>Advanced neural infrastructure for high-performance sensory immersion.</p>
              </motion.div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
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
            textAlign: "center", padding: "180px 20px 80px", 
            borderTop: "1px solid rgba(255,255,255,0.05)" 
          }}>
            <div style={{ display: "flex", justifyContent: "center", gap: "40px", marginBottom: "30px", color: "rgba(255,255,255,0.3)" }}>
              <Globe size={20} />
              <Command size={20} />
              <Zap size={20} />
            </div>
            <p style={{ fontSize: "0.8rem", letterSpacing: "2px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>
              &copy; 2026 FRIDAY AI CORE. ALL SYSTEMS OPERATIONAL.
            </p>
          </footer>
        </div>
      </SmoothScroll>

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
            padding: 20px 40px !important;
          }
          .nav-links {
            display: none !important;
          }
          .hero-responsive {
            padding-top: 200px !important;
          }
          .heading-responsive {
            font-size: 36px !important;
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