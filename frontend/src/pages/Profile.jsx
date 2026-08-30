import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Shield, Zap, Activity, Check } from "lucide-react";
import ProfileSelection from "../components/ProfileSelection";
import ThemeToggle from "../components/ThemeToggle.jsx";
import { NotionProfileArt } from "../components/NotionArt.jsx";

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
    } catch {
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
    } catch {
      setMessage("Failed to save profile. Please retry.");
    } finally {
      setSaving(false);
    }
  };

  const handleSelect = (category, value) => {
    setProfile((prev) => {
      const list = prev[category] || [];
      const exists = list.some(
        (v) => String(v).trim().toLowerCase() === String(value).trim().toLowerCase()
      );
      return {
        ...prev,
        [category]: exists
          ? list.filter((v) => String(v).trim().toLowerCase() !== String(value).trim().toLowerCase())
          : [...list, value],
      };
    });
  };

  if (loading) return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", color: "var(--text)" }}>
      <p style={{ letterSpacing: "1px", fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>Loading your profile...</p>
    </div>
  );

  return (
    <div style={{
      minHeight: "100vh", background: "var(--bg-soft)", color: "var(--text)",
      display: "flex", flexDirection: "column", position: "relative",
      fontFamily: "'Inter', sans-serif", transition: "background 0.2s ease, color 0.2s ease"
    }}>

      {/* Header */}
      <header style={{
        padding: "16px clamp(20px, 6vw, 60px)", display: "flex", justifyContent: "space-between", alignItems: "center",
        borderBottom: "1px solid var(--border)",
        background: "var(--bg)", backdropFilter: "blur(20px)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={() => navigate("/chat")}
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              background: "var(--bg-soft)", color: "var(--text)",
              padding: "7px 16px", borderRadius: "8px",
              border: "1px solid var(--border)", fontWeight: 600,
              fontSize: "0.85rem", transition: "all 0.15s", cursor: "pointer"
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--text)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
          >
            <ArrowLeft size={15} /> Back to Chat
          </button>
          <span style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--text)" }}>Friday Profile</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <ThemeToggle size="sm" />
        </div>
      </header>

      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          style={{
            width: "100%", maxWidth: "800px", padding: "36px 32px",
            background: "var(--bg-card)", border: "1px solid var(--border)",
            borderRadius: "20px",
            boxShadow: "var(--shadow-md)"
          }}
        >
          {/* Profile Identity Card with Notion Profile Artwork */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: "32px" }}>
            <div style={{ marginBottom: "12px" }}>
              <NotionProfileArt width={120} height={120} />
            </div>
            <h2 style={{ fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: "4px", color: "var(--text)" }}>
              {profile?.name || "User"}
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", fontWeight: 500 }}>{profile?.email}</p>
          </div>

          {/* Quick Metrics Bar */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", marginBottom: "32px" }}>
            <StatCard icon={<Zap size={16} />} label="Strengths Selected" value={profile?.strengths?.length || 0} />
            <StatCard icon={<Shield size={16} />} label="Growth Areas" value={profile?.weaknesses?.length || 0} />
            <StatCard icon={<Activity size={16} />} label="Hobbies Added" value={profile?.hobbies?.length || 0} />
          </div>

          {/* Preferences Selection */}
          <div style={{ marginBottom: "32px" }}>
            <div style={{ padding: "20px", background: "var(--bg-soft)", borderRadius: "14px", border: "1px solid var(--border)" }}>
              <ProfileSelection selections={profile || { hobbies: [], strengths: [], weaknesses: [] }} onSelect={handleSelect} />
            </div>
          </div>

          {/* Save Action */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}>
            <button
              onClick={handleSave}
              disabled={saving}
              className="n-btn n-btn-primary"
              style={{
                padding: "12px 36px", fontSize: "0.92rem", fontWeight: 700, borderRadius: "8px"
              }}
            >
              <Save size={16} />
              {saving ? "Saving..." : "Save Preferences"}
            </button>

            {message && (
              <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                style={{
                  color: "#10b981", fontWeight: 700, fontSize: "0.85rem",
                  display: "flex", alignItems: "center", gap: "6px",
                  padding: "6px 16px", borderRadius: "8px",
                  background: "rgba(16, 185, 129, 0.1)",
                  border: "1px solid rgba(16, 185, 129, 0.25)"
                }}
              >
                <Check size={15} /> {message}
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
    padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px",
    background: "var(--bg-soft)", border: "1px solid var(--border)",
    borderRadius: "12px"
  }}>
    <div style={{
      background: "var(--bg-card)", color: "var(--accent-purple)",
      padding: "8px", borderRadius: "8px", border: "1px solid var(--border)",
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      {icon}
    </div>
    <div style={{ textAlign: "left" }}>
      <p style={{ fontSize: "0.74rem", color: "var(--text-muted)", fontWeight: 600 }}>{label}</p>
      <p style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text)", marginTop: "2px" }}>{value}</p>
    </div>
  </div>
);

export default Profile;
