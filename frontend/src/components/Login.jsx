import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ChevronLeft, Sparkles } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import FridayLogo from "./FridayLogo.jsx";
import SatelliteCanvas from "./SatelliteCanvas.jsx";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await axios.post("/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userProfile", JSON.stringify(res.data.profile || {}));
      navigate("/chat");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    setError("");
    try {
      const res = await axios.post("/api/auth/google", {
        token: credentialResponse.credential,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userProfile", JSON.stringify(res.data.profile || {}));
      navigate("/chat");
    } catch (err) {
      setError("Google Sign-In failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{ 
        minHeight: "100vh",
        background: "#000000",
        color: "#ffffff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        fontFamily: "'Inter', sans-serif"
      }}
    >
      {/* CONTINUOUS MOVING SATELLITE CANVAS BACKGROUND */}
      <SatelliteCanvas density={60} connectionDistance={130} interactive={true} />

      {/* AMBIENT SOFT LIGHT GLOW */}
      <div
        style={{
          position: "fixed",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "700px",
          height: "400px",
          background: "radial-gradient(circle, rgba(255, 255, 255, 0.12) 0%, rgba(0,0,0,0) 70%)",
          opacity: 0.15,
          pointerEvents: "none",
          zIndex: 1
        }}
      />

      <div style={{ position: "relative", zIndex: 10, flex: 1, display: "flex", flexDirection: "column" }}>
        
        {/* HEADER NAVIGATION BAR WITH FAR END CORNER ACTIONS */}
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            background: "rgba(9, 9, 11, 0.8)",
            backdropFilter: "blur(24px)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            width: "100%",
            padding: "14px clamp(24px, 3.5vw, 56px)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          {/* Far Left Corner: Friday Logo */}
          <div 
            onClick={() => navigate("/")} 
            style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
          >
            <FridayLogo size="1.3rem" color="#ffffff" showBadge={true} />
          </div>

          {/* Far Right Corner: Auth Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Link to="/signup" style={{ textDecoration: "none" }}>
              <button className="btn-minimal-primary" style={{ padding: "8px 22px", fontSize: "0.82rem" }}>
                Get Started Free <ArrowRight size={14} />
              </button>
            </Link>
          </div>
        </header>

        {/* CENTERED LOGIN FORM CONTAINER */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="minimal-card"
            style={{ 
              width: "100%",
              maxWidth: "420px",
              padding: "40px 32px", 
              textAlign: "center",
              boxShadow: "0 25px 60px rgba(0,0,0,0.8)"
            }}
          >
            {/* Header branding */}
            <div style={{ marginBottom: "28px" }}>
              <div onClick={() => navigate("/")} style={{ marginBottom: "16px", display: "inline-block", cursor: "pointer" }}>
                <FridayLogo size="1.6rem" color="#ffffff" />
              </div>

              <h2 style={{ fontSize: "1.9rem", fontWeight: 800, marginBottom: "6px", color: "#ffffff" }}>
                Welcome <span className="font-curly" style={{ fontSize: "1.25em" }}>back</span>.
              </h2>
              <p style={{ color: "#a1a1aa", fontSize: "0.9rem", fontWeight: 400 }}>
                Sign in to resume conversation with <span className="font-serif-italic">Friday</span>.
              </p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ 
                  background: "rgba(255, 255, 255, 0.08)",
                  color: "#ffffff", 
                  padding: "12px 16px",
                  borderRadius: "14px",
                  marginBottom: "20px",
                  fontSize: "0.85rem",
                  border: "1px solid rgba(255, 255, 255, 0.25)",
                  fontWeight: 600,
                  textAlign: "left"
                }}
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ position: "relative" }}>
                <Mail size={18} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#71717a" }} />
                <input
                  style={{ 
                    width: "100%",
                    padding: "14px 16px 14px 48px",
                    borderRadius: "14px", 
                    background: "#000000",
                    border: "1px solid rgba(255, 255, 255, 0.18)",
                    color: "#ffffff",
                    outline: "none",
                    fontSize: "0.92rem",
                    fontWeight: 500,
                    transition: "all 0.2s ease"
                  }}
                  name="email"
                  type="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div style={{ position: "relative" }}>
                <Lock size={18} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#71717a" }} />
                <input
                  style={{ 
                    width: "100%",
                    padding: "14px 48px 14px 48px",
                    borderRadius: "14px", 
                    background: "#000000",
                    border: "1px solid rgba(255, 255, 255, 0.18)",
                    color: "#ffffff",
                    outline: "none",
                    fontSize: "0.92rem",
                    fontWeight: 500,
                    transition: "all 0.2s ease"
                  }}
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", color: "#71717a", cursor: "pointer"
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button 
                type="submit" 
                className="btn-minimal-primary" 
                disabled={isLoading}
                style={{ 
                  width: "100%",
                  marginTop: "6px",
                  padding: "14px",
                  fontSize: "0.95rem",
                  borderRadius: "14px"
                }}
              >
                {isLoading ? "Signing in..." : "Sign In"} <ArrowRight size={17} />
              </button>
            </form>

            <div style={{ margin: "22px 0", display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ flex: 1, height: "1px", background: "rgba(255, 255, 255, 0.1)" }} />
              <span style={{ fontSize: "11px", color: "#71717a", fontWeight: 700 }} className="font-mono">OR</span>
              <div style={{ flex: 1, height: "1px", background: "rgba(255, 255, 255, 0.1)" }} />
            </div>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <SafeGoogleButton 
                onSuccess={handleGoogleSuccess} 
                onError={(msg) => setError(msg)} 
              />
            </div>

            <p style={{ marginTop: "24px", fontSize: "0.88rem", color: "#a1a1aa", fontWeight: 500 }}>
              Don't have an account? <Link to="/signup" style={{ color: "#ffffff", fontWeight: 700, textDecoration: "none" }}>Sign up free</Link>
            </p>
          </motion.div>
        </div>

        {/* MINIMAL FOOTER */}
        <footer
          style={{
            textAlign: "center",
            padding: "24px 20px",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            background: "rgba(9, 9, 11, 0.9)"
          }}
        >
          <p style={{ fontSize: "0.78rem", color: "#71717a", margin: 0 }}>
            &copy; 2026 Friday AI. All rights reserved.
          </p>
        </footer>

      </div>
    </div>
  );
};

const SafeGoogleButton = ({ onSuccess, onError }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <button
        type="button"
        onClick={() => onError("Google Sign-In origin check failed.")}
        style={{
          display: "inline-flex", alignItems: "center", gap: "10px",
          padding: "10px 20px", borderRadius: "999px",
          background: "rgba(255, 255, 255, 0.08)", border: "1px solid rgba(255, 255, 255, 0.2)",
          color: "#ffffff", fontSize: "0.85rem", fontWeight: 700,
          cursor: "pointer"
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
        Sign in with Google
      </button>
    );
  }

  return (
    <GoogleLogin
      onSuccess={onSuccess}
      onError={() => {
        setHasError(true);
        onError("Google Sign-In origin error.");
      }}
      theme="outline"
      shape="circle"
    />
  );
};

export default Login;