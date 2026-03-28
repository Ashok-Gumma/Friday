import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, ChevronLeft } from "lucide-react";
import FridayLogo from "./FridayLogo.jsx";
import { useLoading } from "../context/LoadingContext.jsx";

const Login = () => {
  const navigate = useNavigate();
  const { triggerLoading } = useLoading();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogoClick = () => {
    triggerLoading(2000);
    navigate("/");
  };

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
      background: "#000", padding: "40px 20px", position: "relative",
      fontFamily: "'General Sans', sans-serif"
    }}>
      {/* Fullscreen Video Background */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <video autoPlay muted loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.4 }}>
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260217_030345_246c0224-10a4-422c-b324-070b7c0eceda.mp4" type="video/mp4" />
        </video>
        <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0, 0, 0, 0.7)" }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ 
          width: "100%", maxWidth: "440px", padding: "48px", 
          background: "rgba(20, 20, 20, 0.8)",
          borderRadius: "32px",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 40px 100px rgba(0,0,0,0.8)",
          zIndex: 10, position: "relative",
          textAlign: "center"
        }}
      >
        <button 
          onClick={handleLogoClick}
          style={{ 
            position: "absolute", top: "24px", left: "24px", background: "none", border: "none", 
            color: "rgba(255,255,255,0.4)", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px",
            fontSize: "13px", fontWeight: 500
          }}
        >
          <ChevronLeft size={16} /> Back
        </button>

        <div style={{ marginBottom: "40px" }}>
          <div onClick={handleLogoClick} style={{ marginBottom: "30px", cursor: "pointer" }}>
            <FridayLogo size="2rem" />
          </div>

          <h2 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "8px", letterSpacing: "-0.5px", color: "#fff" }}>Welcome Home</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.95rem" }}>Authenticate your identity to continue.</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            style={{ 
              background: "rgba(255, 77, 77, 0.1)", color: "#ff4d4d", 
              padding: "12px", borderRadius: "12px", marginBottom: "24px", fontSize: "0.9rem",
              border: "1px solid rgba(255, 77, 77, 0.2)"
            }}
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ position: "relative" }}>
            <Mail size={18} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)" }} />
            <input
              style={{ 
                width: "100%", padding: "14px 16px 14px 48px", borderRadius: "14px", 
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)",
                color: "#fff", outline: "none", transition: "all 0.2s ease",
                fontSize: "0.95rem"
              }}
              className="auth-input-premium"
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div style={{ position: "relative" }}>
            <Lock size={18} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)" }} />
            <input
              style={{ 
                width: "100%", padding: "14px 16px 14px 48px", borderRadius: "14px", 
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)",
                color: "#fff", outline: "none", transition: "all 0.2s ease",
                fontSize: "0.95rem"
              }}
              className="auth-input-premium"
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
              width: "100%", marginTop: "10px", padding: "14px",
              fontSize: "1rem", fontWeight: 600
            }}
          >
            {isLoading ? "Authenticating..." : "Login to Friday"} <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ margin: "24px 0", display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", fontWeight: 700, letterSpacing: "1px" }}>OR CONTINUE WITH</span>
          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError("Google Login failed")}
            theme="filled_black"
            shape="circle"
          />
        </div>

        <p style={{ marginTop: "32px", fontSize: "14px", color: "rgba(255,255,255,0.4)" }}>
          New here? <Link to="/signup" style={{ color: "#ff4d4d", fontWeight: 600, textDecoration: "none" }}>Create access profile</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;