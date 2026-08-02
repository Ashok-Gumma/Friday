import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Save, User as UserIcon, Shield, Sparkles, Activity, Check } from "lucide-react";
import ProfileSelection from "../components/ProfileSelection";
import FridayLogo from "../components/FridayLogo.jsx";

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

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
      setMessage("Profile saved successfully!");
      setTimeout(() => setMessage(""), 3500);
    } catch (err) {
      setMessage("Failed to save profile. Please retry.");
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
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#faf9f5", color: "#d97706" }}>
      <p style={{ letterSpacing: "1px", fontWeight: 800, fontFamily: "'Inter', sans-serif" }}>Loading your profile...</p>
    </div>
  );

  return (
    <div style={{ 
      minHeight: "100vh", background: "#faf9f5", color: "#0f172a", 
      display: "flex", flexDirection: "column", position: "relative", overflow: "hidden",
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Background Glow */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(circle at 50% 10%, rgba(250, 204, 21, 0.15) 0%, transparent 60%)"
      }} />

      {/* Header */}
      <header style={{ 
        padding: "24px clamp(20px, 6vw, 60px)", display: "flex", justifyContent: "space-between", alignItems: "center",
        position: "relative", zIndex: 100, borderBottom: "1px solid rgba(234, 179, 8, 0.2)",
        background: "rgba(255, 255, 255, 0.85)", backdropFilter: "blur(20px)"
      }}>
        <div onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          <FridayLogo size="1.3rem" color="#0f172a" />
        </div>

        <button 
          onClick={() => navigate("/chat")}
          style={{ 
            display: "flex", alignItems: "center", gap: "8px", 
            background: "#ffffff", color: "#0f172a", 
            padding: "10px 22px", borderRadius: "999px", 
            border: "1px solid rgba(0, 0, 0, 0.12)", fontWeight: 700,
            fontSize: "0.88rem", transition: "all 0.2s", cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.04)"
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#f1efe7"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#ffffff"; }}
        >
          <ArrowLeft size={16} /> Back to Chat
        </button>
      </header>

      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px", position: "relative", zIndex: 10 }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          style={{ 
            width: "100%", maxWidth: "800px", padding: "44px 36px",
            background: "#ffffff", border: "1px solid rgba(234, 179, 8, 0.25)",
            borderRadius: "32px",
            boxShadow: "0 25px 60px rgba(0,0,0,0.06)"
          }}
        >
          {/* Profile Identity Card */}
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <div style={{ 
              width: "72px", height: "72px", borderRadius: "50%", 
              background: "linear-gradient(135deg, #facc15 0%, #f59e0b 100%)", color: "#0e0a05",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px", boxShadow: "0 8px 24px rgba(250, 204, 21, 0.4)"
            }}>
              <UserIcon size={32} />
            </div>
            <h2 style={{ fontSize: "2rem", fontWeight: 900, letterSpacing: "-0.5px", marginBottom: "4px", color: "#0f172a" }}>
              {profile?.name || "User"}
            </h2>
            <p style={{ color: "#64748b", fontSize: "0.92rem", fontWeight: 600 }}>{profile?.email}</p>
          </div>

          {/* Quick Metrics Bar */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px", marginBottom: "36px" }}>
            <StatCard icon={<Sparkles size={18} />} label="Strengths Selected" value={profile?.strengths?.length || 0} />
            <StatCard icon={<Shield size={18} />} label="Growth Areas" value={profile?.weaknesses?.length || 0} />
            <StatCard icon={<Activity size={18} />} label="Hobbies Added" value={profile?.hobbies?.length || 0} />
          </div>

          {/* Preferences Selection */}
          <div style={{ marginBottom: "36px" }}>
            <div style={{ padding: "24px", background: "#faf9f5", borderRadius: "24px", border: "1px solid rgba(234, 179, 8, 0.2)" }}>
              <ProfileSelection selections={profile || { hobbies: [], strengths: [], weaknesses: [] }} onSelect={handleSelect} />
            </div>
          </div>

          {/* Save Action */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
            <button 
              onClick={handleSave} 
              disabled={saving}
              className="btn-primary"
              style={{ 
                padding: "15px 44px", fontSize: "0.98rem"
              }}
            >
              <Save size={18} />
              {saving ? "Saving..." : "Save Preferences"}
            </button>

            {message && (
              <motion.div 
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                style={{ 
                  color: "#047857", fontWeight: 800, fontSize: "0.9rem",
                  display: "flex", alignItems: "center", gap: "6px",
                  padding: "8px 18px", borderRadius: "12px", background: "#d1fae5",
                  border: "1px solid #6ee7b7"
                }}
              >
                <Check size={16} /> {message}
              </motion.div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

const StatCard = ({ icon, label, value }) => (
  <div style={{ 
    padding: "18px 20px", display: "flex", alignItems: "center", gap: "14px", 
    background: "#faf9f5", border: "1px solid rgba(234, 179, 8, 0.2)",
    borderRadius: "18px"
  }}>
    <div style={{ 
      background: "#fef08a", color: "#78350f", 
      padding: "10px", borderRadius: "12px", border: "1px solid rgba(234, 179, 8, 0.3)"
    }}>
      {icon}
    </div>
    <div style={{ textAlign: "left" }}>
      <p style={{ fontSize: "0.78rem", color: "#64748b", fontWeight: 700 }}>{label}</p>
      <p style={{ fontSize: "1.3rem", fontWeight: 900, color: "#0f172a", marginTop: "2px" }}>{value}</p>
    </div>
  </div>
);

export default Profile;


