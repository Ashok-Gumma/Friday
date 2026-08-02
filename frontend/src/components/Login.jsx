import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ChevronLeft } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import FridayLogo from "./FridayLogo.jsx";

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

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <div style={{ 
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "#faf9f5", padding: "40px 20px", position: "relative",
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Ambient background glow */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(circle at 50% 25%, rgba(250, 204, 21, 0.15) 0%, transparent 65%)"
      }} />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        style={{ 
          width: "100%", maxWidth: "440px", padding: "44px 36px", 
          background: "#ffffff",
          borderRadius: "32px",
          border: "1px solid rgba(234, 179, 8, 0.25)",
          boxShadow: "0 25px 60px rgba(0,0,0,0.06)",
          zIndex: 10, position: "relative",
          textAlign: "center"
        }}
      >
        <button 
          onClick={handleLogoClick}
          style={{ 
            position: "absolute", top: "24px", left: "24px", background: "none", border: "none", 
            color: "#64748b", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px",
            fontSize: "13px", fontWeight: 700, transition: "color 0.2s"
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "#d97706"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "#64748b"; }}
        >
          <ChevronLeft size={16} /> Home
        </button>

        <div style={{ marginBottom: "32px", marginTop: "12px" }}>
          <div onClick={handleLogoClick} style={{ marginBottom: "20px", display: "inline-block", cursor: "pointer" }}>
            <FridayLogo size="1.8rem" color="#0f172a" />
          </div>

          <h2 style={{ fontSize: "1.8rem", fontWeight: 900, marginBottom: "6px", letterSpacing: "-0.5px", color: "#0f172a" }}>
            Welcome back
          </h2>
          <p style={{ color: "#64748b", fontSize: "0.92rem", fontWeight: 500 }}>
            Sign in to continue talking with Friday.
          </p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            style={{ 
              background: "#fef3c7", color: "#92400e", 
              padding: "12px 16px", borderRadius: "14px", marginBottom: "24px", fontSize: "0.88rem",
              border: "1px solid rgba(234, 179, 8, 0.4)", fontWeight: 700, textAlign: "left"
            }}
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ position: "relative" }}>
            <Mail size={18} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
            <input
              style={{ 
                width: "100%", padding: "14px 16px 14px 48px", borderRadius: "14px", 
                background: "#f8fafc", border: "1px solid rgba(0,0,0,0.12)",
                color: "#0f172a", outline: "none", transition: "all 0.25s ease",
                fontSize: "0.95rem", fontWeight: 600
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
            <Lock size={18} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
            <input
              style={{ 
                width: "100%", padding: "14px 48px 14px 48px", borderRadius: "14px", 
                background: "#f8fafc", border: "1px solid rgba(0,0,0,0.12)",
                color: "#0f172a", outline: "none", transition: "all 0.25s ease",
                fontSize: "0.95rem", fontWeight: 600
              }}
              className="auth-input-premium"
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
                background: "none", border: "none", color: "#94a3b8", cursor: "pointer"
              }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={isLoading}
            style={{ 
              width: "100%", marginTop: "6px", padding: "14px",
              fontSize: "0.98rem", fontWeight: 700, borderRadius: "14px",
              background: "#0f172a", color: "#fff", border: "none", cursor: "pointer"
            }}
          >
            {isLoading ? "Signing in..." : "Sign In"} <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ margin: "24px 0", display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ flex: 1, height: "1px", background: "rgba(0,0,0,0.08)" }} />
          <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 800 }}>OR</span>
          <div style={{ flex: 1, height: "1px", background: "rgba(0,0,0,0.08)" }} />
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <SafeGoogleButton 
            onSuccess={handleGoogleSuccess} 
            onError={(msg) => setError(msg)} 
          />
        </div>

        <p style={{ marginTop: "28px", fontSize: "0.9rem", color: "#64748b", fontWeight: 500 }}>
          Don't have an account? <Link to="/signup" style={{ color: "#d97706", fontWeight: 800, textDecoration: "none" }}>Sign up for free</Link>
        </p>
      </motion.div>
    </div>
  );
};

const SafeGoogleButton = ({ onSuccess, onError }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <button
        type="button"
        onClick={() => onError("Google Sign-In requires http://localhost:5173 to be added to Authorized JavaScript origins in Google Cloud Console.")}
        style={{
          display: "inline-flex", alignItems: "center", gap: "10px",
          padding: "10px 20px", borderRadius: "999px",
          background: "#ffffff", border: "1px solid rgba(0,0,0,0.15)",
          color: "#0f172a", fontSize: "0.88rem", fontWeight: 700,
          cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
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
        onError("Google Sign-In origin error. Use standard login or add origin to Google Console.");
      }}
      theme="outline"
      shape="circle"
    />
  );
};

export default Login;