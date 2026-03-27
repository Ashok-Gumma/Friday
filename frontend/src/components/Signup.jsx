import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { motion } from "framer-motion";
import { User, Mail, Lock, ArrowRight } from "lucide-react";
import ProfileSelection from "./ProfileSelection";
import WordScroller from "./WordScroller";
import logo from "../assets/red-logo.png";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    hobbies: [],
    strengths: [],
    weaknesses: [],
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const signupWords = ["INITIALIZE", "SYNCHRONIZE", "PROTOCOL", "NEURAL", "biometric", "uplink"];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSelect = (category, value) => {
    setForm((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((v) => v !== value)
        : [...prev[category], value],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!form.hobbies.length || !form.strengths.length || !form.weaknesses.length) {
      setError("Please select at least one hobby, strength, and weakness.");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/api/auth/signup", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post("/api/auth/google", {
        token: credentialResponse.credential,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userProfile", JSON.stringify(res.data.profile));
      navigate("/chat");
    } catch (err) {
      setError("Google Signup failed");
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "var(--bg-deep)", padding: "60px 20px", position: "relative", overflow: "hidden"
    }}>
      {/* Background Elements */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <WordScroller words={signupWords} duration={50} top="15%" opacity={0.04} />
        <WordScroller words={signupWords} duration={70} top="70%" opacity={0.03} />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass"
        style={{ 
          width: "100%", maxWidth: "700px", padding: "56px", 
          boxShadow: "0 40px 100px rgba(0,0,0,0.8)",
          zIndex: 10, position: "relative"
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "48px", cursor: "pointer" }} onClick={() => navigate("/")}>
          <motion.img 
            whileHover={{ scale: 1.1, rotate: -5 }}
            src={logo} alt="Logo" style={{ width: "48px", marginBottom: "20px" }} 
          />
          <h2 style={{ fontSize: "2.5rem", fontWeight: 900, marginBottom: "8px", letterSpacing: "-1.5px" }}>Sign Up</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>Initialize your Friday mission profile</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            style={{ 
              background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", 
              padding: "16px", borderRadius: "14px", marginBottom: "32px", fontSize: "0.95rem", textAlign: "center",
              border: "1px solid rgba(239, 68, 68, 0.2)"
            }}
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            <div style={{ position: "relative" }}>
              <User size={20} style={{ position: "absolute", left: "18px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                className="auth-input-premium"
                style={{ 
                  width: "100%", padding: "16px 18px 16px 54px", borderRadius: "14px", 
                  background: "rgba(255,255,255,0.02)", border: "1px solid var(--glass-border)",
                  color: "#fff", outline: "none", transition: "var(--transition-fast)",
                  fontSize: "1rem"
                }}
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div style={{ position: "relative" }}>
              <Mail size={20} style={{ position: "absolute", left: "18px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                className="auth-input-premium"
                style={{ 
                  width: "100%", padding: "16px 18px 16px 54px", borderRadius: "14px", 
                  background: "rgba(255,255,255,0.02)", border: "1px solid var(--glass-border)",
                  color: "#fff", outline: "none", transition: "var(--transition-fast)",
                  fontSize: "1rem"
                }}
                name="email"
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div style={{ position: "relative" }}>
            <Lock size={20} style={{ position: "absolute", left: "18px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input
              className="auth-input-premium"
              style={{ 
                width: "100%", padding: "16px 18px 16px 54px", borderRadius: "14px", 
                background: "rgba(255,255,255,0.02)", border: "1px solid var(--glass-border)",
                color: "#fff", outline: "none", transition: "var(--transition-fast)",
                fontSize: "1rem"
              }}
              name="password"
              type="password"
              placeholder="Secure Password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          <div className="glass" style={{ padding: "32px", marginTop: "12px", background: "rgba(255,255,255,0.01)" }}>
            <h4 style={{ fontSize: "1rem", fontWeight: 800, marginBottom: "24px", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ color: "var(--accent)", background: "var(--accent-subtle)", padding: "4px 10px", borderRadius: "8px" }}>01</span> 
              NEURAL CALIBRATION
            </h4>
            <ProfileSelection selections={form} onSelect={handleSelect} />
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading}
            style={{ 
              width: "100%", marginTop: "24px", padding: "18px",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "12px",
              fontSize: "1.1rem", fontWeight: 800
            }}
          >
            {loading ? "Signing up..." : "Sign Up"} <ArrowRight size={22} />
          </button>
        </form>

        <div style={{ margin: "32px 0", display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ flex: 1, height: "1px", background: "var(--glass-border)" }} />
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, letterSpacing: "1px" }}>SECURE SIGNUP</span>
          <div style={{ flex: 1, height: "1px", background: "var(--glass-border)" }} />
        </div>

        <div style={{ display: "flex", justifyContent: "center", filter: "grayscale(1) brightness(1.2)" }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError("Google Signup failed")}
            theme="filled_black"
            shape="pill"
          />
        </div>

        <p style={{ marginTop: "40px", textAlign: "center", fontSize: "1rem", color: "var(--text-secondary)" }}>
          Already integrated? <Link to="/login" style={{ color: "var(--accent)", fontWeight: 700, textDecoration: "none" }}>Sync Identity</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;