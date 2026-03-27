import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Shield, Cpu, ArrowRight, Zap, Globe, Command } from "lucide-react";
import WordScroller from "./WordScroller";
import logo from "../assets/red-logo.png";

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) navigate("/chat");
  }, [token, navigate]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const featureWords = [
    "NEURAL ADAPTABILITY", "ZERO LATENCY", "ABSOLUTE PRIVACY", 
    "QUANTUM SPEED", "TOTAL CONTROL", "IMMERSIVE EXPERIENCE"
  ];

  return (
    <div className="home-root" style={{ 
      backgroundColor: "var(--bg-deep)", 
      minHeight: "100vh", 
      color: "var(--text-primary)",
      overflowX: "hidden"
    }}>
      
      {/* Dynamic Background */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <div style={{ 
          position: "absolute", top: "10%", left: "5%", width: "40vw", height: "40vw", 
          background: "radial-gradient(circle, var(--accent-subtle) 0%, transparent 70%)", 
          filter: "blur(60px)", opacity: 0.4 
        }} />
        <div style={{ 
          position: "absolute", bottom: "10%", right: "5%", width: "35vw", height: "35vw", 
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)", 
          filter: "blur(60px)", opacity: 0.3 
        }} />
        
        {/* Global Background Scrolling Words */}
        <WordScroller words={featureWords} duration={40} top="15%" opacity={0.15} />
        <WordScroller words={featureWords} duration={60} top="45%" opacity={0.1} />
        <WordScroller words={featureWords} duration={50} top="75%" opacity={0.12} />
      </div>

      <div style={{ position: "relative", zIndex: 10 }}>
        {/* Navbar */}
        <header style={{ 
          display: "flex", justifyContent: "space-between", alignItems: "center", 
          padding: "20px 40px", backdropFilter: "blur(20px)", 
          borderBottom: "1px solid var(--glass-border)",
          position: "sticky", top: 0, zIndex: 100
        }}>
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }} 
            onClick={() => navigate("/")}
          >
            <div className="glass" style={{ padding: "8px", borderRadius: "10px" }}>
              <img src={logo} alt="Logo" style={{ width: "24px", height: "24px" }} />
            </div>
            <span style={{ fontSize: "1.1rem", fontWeight: 700, letterSpacing: "1px", color: "#ff4d4d", textShadow: "0 0 10px rgba(255, 77, 77, 0.3)" }}>Friday</span>
          </motion.div>
          
          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} style={{ display: "flex", gap: "12px" }}>
            {!token ? (
              <>
                <Link to="/login" className="glass" style={{ 
                  padding: "10px 24px", borderRadius: "12px", fontSize: "0.85rem", fontWeight: 700,
                  textDecoration: "none", color: "#fff", border: "1px solid rgba(255,255,255,0.05)",
                  transition: "var(--transition-fast)"
                }}>
                  <motion.div whileHover={{ scale: 1.05, color: "#ff4d4d" }}>Login</motion.div>
                </Link>
                <Link to="/signup" className="btn-primary" style={{ padding: "10px 24px", borderRadius: "12px", fontSize: "0.85rem" }}>
                  <motion.div whileHover={{ scale: 1.05 }}>Sign Up</motion.div>
                </Link>
              </>
            ) : (
              <Link to="/chat" className="btn-primary" style={{ padding: "10px 24px", borderRadius: "12px", fontSize: "0.85rem" }}>
                Return to Mission
              </Link>
            )}
          </motion.div>
        </header>

        {/* Hero Section */}
        <main style={{ padding: "100px 5% 60px" }}>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ textAlign: "center", maxWidth: "1000px", margin: "0 auto" }}
          >
            <motion.div variants={itemVariants} style={{ marginBottom: "20px" }}>
              <span style={{ 
                padding: "8px 16px", background: "var(--accent-subtle)", 
                color: "var(--accent)", borderRadius: "30px", fontSize: "0.8rem", 
                fontWeight: 600, letterSpacing: "2px", border: "1px solid var(--accent-glow)"
              }}>
                NEXT-GEN AI INTERFACE
              </span>
            </motion.div>

            <motion.h1 variants={itemVariants} style={{ 
              fontSize: "clamp(3rem, 8vw, 5rem)", fontWeight: 900, 
              lineHeight: 1.1, marginBottom: "30px", letterSpacing: "-2px"
            }}>
              Absolute <span className="text-gradient">Precision</span>. <br /> 
              Total <span className="text-gradient">Clarity</span>.
            </motion.h1>

            <motion.p variants={itemVariants} style={{ 
              color: "var(--text-secondary)", fontSize: "1.2rem", 
              maxWidth: "700px", margin: "0 auto 40px", lineHeight: 1.6 
            }}>
              A distraction-free, ultra-integrated AI command center built for high-performance workflows and sensory immersion.
            </motion.p>

            {/* Features Grid */}
            <div 
              style={{ 
                display: "flex", 
                flexDirection: "column",
                alignItems: "center",
                gap: "100px", 
                marginTop: "120px",
                maxWidth: "1000px",
                margin: "120px auto 0"
              }}
            >
              <FeatureCard 
                icon={<Cpu size={24} />} 
                title="Neural Synchronization" 
                desc="As You Wish adapts to your unique cognitive load. By analyzing your session mood and past interactions, the AI synchronizes its internal logic to match your required precision level."
                delay={0.1}
              />
              <FeatureCard 
                icon={<Zap size={24} />} 
                title="Multimodal Command Center" 
                desc="Seamlessly transition between high-speed text input and atmospheric voice commands. Our zero-latency backbone ensures that your directives are processed with absolute temporal accuracy."
                delay={0.2}
              />
              <FeatureCard 
                icon={<Shield size={24} />} 
                title="Sovereign Data Isolation" 
                desc="Encryption is just the beginning. As You Wish creates a dedicated neural sandbox for every session, ensuring your sensitive mission data remains physically isolated from global training sets."
                delay={0.3}
              />
              <FeatureCard 
                icon={<Sparkles size={24} />} 
                title="Contextual Intelligence" 
                desc="Beyond simple queries. The system maintains a deep understanding of your professional strengths, weaknesses, and hobbies to provide advice that is perfectly tailored to your personal growth."
                delay={0.4}
              />
            </div>
          </motion.div>
        </main>

        <footer style={{ 
          textAlign: "center", padding: "60px 20px", 
          borderTop: "1px solid var(--glass-border)", marginTop: "100px" 
        }}>
          <div style={{ display: "flex", justifyContent: "center", gap: "40px", marginBottom: "30px", color: "var(--text-muted)" }}>
            <Globe size={20} />
            <Command size={20} />
            <Zap size={20} />
          </div>
          <p style={{ fontSize: "0.8rem", letterSpacing: "2px", color: "var(--text-muted)", textTransform: "uppercase" }}>
            &copy; 2026 FRIDAY AI CORE. ALL SYSTEMS OPERATIONAL.
          </p>
        </footer>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc, delay }) => (
  <motion.div 
    initial={{ y: 100, opacity: 0, scale: 0.9, filter: "blur(10px)" }}
    whileInView={{ y: 0, opacity: 1, scale: 1, filter: "blur(0px)" }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ 
      duration: 1.8, 
      delay: delay,
      ease: [0.16, 1, 0.3, 1] 
    }}
    whileHover={{ y: -20, borderColor: "var(--accent-glow)", scale: 1.04 }}
    className="glass" 
    style={{ 
      padding: "80px 60px", textAlign: "left", transition: "var(--transition-smooth)",
      display: "flex", flexDirection: "column", gap: "32px",
      boxShadow: "0 30px 60px -15px rgba(0, 0, 0, 0.9)",
      width: "100%", maxWidth: "900px"
    }}
  >
    <motion.div 
      animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      style={{ 
        background: "var(--accent-subtle)", color: "var(--accent)", 
        width: "fit-content", padding: "20px", borderRadius: "20px" 
      }}
    >
      {React.cloneElement(icon, { size: 40 })}
    </motion.div>
    <h3 style={{ fontSize: "2.5rem", fontWeight: 900, color: "#fff", letterSpacing: "-1px" }}>{title}</h3>
    <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, fontSize: "1.3rem" }}>{desc}</p>
  </motion.div>
);

export default Home;