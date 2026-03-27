import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight } from "lucide-react";
import WordScroller from "./WordScroller";
import logo from "../assets/red-logo.png";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const loginWords = ["AUTHENTICATE", "AUTHORIZE", "ENCRYPT", "SYNCHRONIZE", "neural", "terminal"];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post("/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userProfile", JSON.stringify(res.data.profile));
      navigate("/chat");
    } catch {
      setError("Invalid email or password");
    } finally {
      setIsLoading(false);
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
      setError("Google Login failed");
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "var(--bg-deep)", padding: "20px", position: "relative", overflow: "hidden"
    }}>
      {/* Background Elements */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <WordScroller words={loginWords} duration={40} top="10%" opacity={0.05} />
        <WordScroller words={loginWords} duration={60} top="60%" opacity={0.03} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="glass"
        style={{ 
          width: "100%", maxWidth: "450px", padding: "48px", 
          textAlign: "center", boxShadow: "0 40px 100px rgba(0,0,0,0.8)",
          zIndex: 10, position: "relative"
        }}
      >
        <div style={{ marginBottom: "40px", cursor: "pointer" }} onClick={() => navigate("/")}>
          <motion.img 
            whileHover={{ scale: 1.1, rotate: 5 }}
            src={logo} alt="Logo" style={{ width: "56px", marginBottom: "20px" }} 
          />
          <h2 style={{ fontSize: "2rem", fontWeight: 900, marginBottom: "8px", letterSpacing: "-1px" }}>Welcome Back</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "1rem" }}>Login to your Friday command center</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            style={{ 
              background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", 
              padding: "16px", borderRadius: "12px", marginBottom: "24px", fontSize: "0.95rem",
              border: "1px solid rgba(239, 68, 68, 0.2)"
            }}
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ position: "relative" }}>
            <Mail size={20} style={{ position: "absolute", left: "18px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input
              style={{ 
                width: "100%", padding: "16px 18px 16px 54px", borderRadius: "14px", 
                background: "rgba(255,255,255,0.02)", border: "1px solid var(--glass-border)",
                color: "#fff", outline: "none", transition: "var(--transition-fast)",
                fontSize: "1rem"
              }}
              className="auth-input-premium"
              name="email"
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div style={{ position: "relative" }}>
            <Lock size={20} style={{ position: "absolute", left: "18px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input
              style={{ 
                width: "100%", padding: "16px 18px 16px 54px", borderRadius: "14px", 
                background: "rgba(255,255,255,0.02)", border: "1px solid var(--glass-border)",
                color: "#fff", outline: "none", transition: "var(--transition-fast)",
                fontSize: "1rem"
              }}
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={isLoading}
            style={{ 
              width: "100%", marginTop: "12px", padding: "16px",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
              fontSize: "1.1rem", fontWeight: 700
            }}
          >
            {isLoading ? "Logging in..." : "Login"} <ArrowRight size={20} />
          </button>
        </form>

        <div style={{ margin: "32px 0", display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ flex: 1, height: "1px", background: "var(--glass-border)" }} />
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, letterSpacing: "1px" }}>SECURE ACCESS</span>
          <div style={{ flex: 1, height: "1px", background: "var(--glass-border)" }} />
        </div>

        <div style={{ display: "flex", justifyContent: "center", filter: "grayscale(1) brightness(1.2)" }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError("Google Login failed")}
            theme="filled_black"
            shape="pill"
          />
        </div>

        <p style={{ marginTop: "40px", fontSize: "1rem", color: "var(--text-secondary)" }}>
          New to the mission? <Link to="/signup" style={{ color: "var(--accent)", fontWeight: 700, textDecoration: "none" }}>Create Account</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;