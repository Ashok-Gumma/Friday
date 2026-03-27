import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Save, User as UserIcon, Mail, Shield, Zap, Sparkles } from "lucide-react";
import ProfileSelection from "../components/ProfileSelection";
import WordScroller from "../components/WordScroller";
import logo from "../assets/red-logo.png";
import chatBg from "../assets/chat-bg.png";

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const profileWords = ["ANALYTICS", "COMMAND", "NEURAL", "MISSION", "biometric", "protocol"];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data.profile);
    } catch (err) {
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      const res = await axios.put(
        "/api/auth/profile",
        {
          strengths: profile.strengths,
          weaknesses: profile.weaknesses,
          hobbies: profile.hobbies,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProfile(res.data.profile);
      localStorage.setItem("userProfile", JSON.stringify(res.data.profile));
      setMessage("Profile synchronized successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Synchronization failed");
    } finally {
      setSaving(false);
    }
  };

  const handleSelect = (category, value) => {
    setProfile((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((v) => v !== value)
        : [...prev[category], value],
    }));
  };

  if (loading) return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-deep)" }}>
      <p style={{ letterSpacing: "4px", color: "var(--accent)", animation: "pulse-glow 1s infinite" }}>INITIALIZING...</p>
    </div>
  );

  return (
    <div style={{ 
      minHeight: "100vh", background: "#000", color: "#fff", 
      display: "flex", flexDirection: "column", position: "relative", overflow: "hidden",
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Exact Reference Background */}
      <div style={{ 
        position: "fixed", inset: 0, zIndex: 0, 
        backgroundImage: `url(${chatBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: "brightness(0.7)"
      }} />

      {/* Transparent Minimalist Header */}
      <header style={{ 
        padding: "24px 40px", display: "flex", justifyContent: "space-between", alignItems: "center",
        position: "relative", zIndex: 100
      }}>
        <div 
          onClick={() => navigate("/")} 
          style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", opacity: 0.8 }}
        >
          <img src={logo} alt="Logo" style={{ width: "20px" }} />
          <h2 style={{ fontSize: "0.85rem", fontWeight: 800, letterSpacing: "2px", color: "#ff4d4d", textShadow: "0 0 10px rgba(255, 77, 77, 0.3)" }}>FRIDAY</h2>
        </div>
        <button 
          onClick={() => navigate("/chat")}
          style={{ 
            display: "flex", alignItems: "center", gap: "10px", 
            background: "rgba(255, 255, 255, 0.05)", color: "rgba(255,255,255,0.6)", 
            padding: "10px 20px", borderRadius: "12px", 
            border: "1px solid rgba(255, 255, 255, 0.1)", fontWeight: 700,
            fontSize: "0.8rem", transition: "0.3s", cursor: "pointer",
            backdropFilter: "blur(10px)"
          }}
          className="header-action-btn"
        >
          <ArrowLeft size={16} /> BACK TO TERMINAL
        </button>
      </header>

      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", position: "relative", zIndex: 10 }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ 
            width: "100%", maxWidth: "800px", padding: "64px",
            background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "40px", backdropFilter: "blur(50px)",
            boxShadow: "0 50px 100px rgba(0,0,0,0.5)"
          }}
        >
          {/* Minimalist Profile Header */}
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <motion.div 
               style={{ 
                width: "64px", height: "64px", borderRadius: "50%", 
                background: "rgba(255,255,255,0.05)", color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 20px", border: "1px solid rgba(255, 255, 255, 0.1)"
              }}
            >
              <UserIcon size={24} />
            </motion.div>
            <h2 style={{ fontSize: "2rem", fontWeight: 900, letterSpacing: "-1px", marginBottom: "4px" }}>{profile?.name || "Operator"}</h2>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.9rem", letterSpacing: "0.5px" }}>{profile?.email}</p>
          </div>

          {/* Clean Selection Section */}
          <div style={{ marginBottom: "56px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px", opacity: 0.4 }}>
              <Zap size={14} color="#fff" />
              <span style={{ fontSize: "0.7rem", fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase" }}>Neural Settings</span>
            </div>
            <ProfileSelection selections={profile || { hobbies: [], strengths: [], weaknesses: [] }} onSelect={handleSelect} />
          </div>

          {/* Action Area */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "24px" }}>
             <button 
               onClick={handleSave} 
               disabled={saving}
               style={{ 
                 padding: "14px 44px", borderRadius: "14px",
                 fontSize: "0.95rem", fontWeight: 800, background: "#fff", color: "#000",
                 border: "none", cursor: "pointer", transition: "0.3s",
                 boxShadow: "0 10px 30px rgba(255,255,255,0.15)"
               }}
               onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; }}
               onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
             >
               {saving ? "SYNCING..." : "COMMIT CHANGES"}
             </button>
          </div>

          {message && (
             <motion.p 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }}
               style={{ textAlign: "center", marginTop: "24px", color: "#10b981", fontWeight: 700, fontSize: "0.9rem" }}
             >
               {message}
             </motion.p>
          )}
        </motion.div>
      </main>

      <footer style={{ padding: "40px", textAlign: "center", opacity: 0.3, fontSize: "0.7rem", letterSpacing: "1px" }}>
        NEURAL INTERFACE v2.0 • FRIDAY CORE
      </footer>

      <style>{`
        .header-action-btn:hover {
          background: rgba(255, 77, 77, 0.2) !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(255, 77, 77, 0.3) !important;
        }
      `}</style>
    </div>
  );
};

const StatCard = ({ icon, label, value, sub }) => (
  <motion.div 
    whileHover={{ y: -8 }}
    style={{ 
      padding: "28px", display: "flex", alignItems: "center", gap: "20px", 
      background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: "24px", backdropFilter: "blur(20px)",
      transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
    }}
  >
    <div style={{ 
      background: "rgba(255, 77, 77, 0.1)", color: "#ff4d4d", 
      padding: "14px", borderRadius: "14px", boxShadow: "0 0 15px rgba(255, 77, 77, 0.1)"
    }}>
      {icon}
    </div>
    <div>
      <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 800, letterSpacing: "1px" }}>{label}</p>
      <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginTop: "4px" }}>
        <p style={{ fontSize: "1.3rem", fontWeight: 900, letterSpacing: "-0.5px" }}>{value}</p>
        <span style={{ fontSize: "0.75rem", color: "#ff4d4d", fontWeight: 800 }}>{sub}</span>
      </div>
    </div>
  </motion.div>
);

export default Profile;
