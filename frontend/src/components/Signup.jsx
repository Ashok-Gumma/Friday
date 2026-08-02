import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, ArrowRight, ChevronLeft, Eye, EyeOff, Sparkles } from "lucide-react";
import ProfileSelection from "./ProfileSelection";
import FridayLogo from "./FridayLogo.jsx";
import { useLoading } from "../context/LoadingContext.jsx";

const Signup = () => {
  const navigate = useNavigate();
  const { triggerLoading } = useLoading();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
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

  const handleLogoClick = () => {
    triggerLoading(2000);
    navigate("/");
  };

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

  const handleNextStep = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError("Please fill out your name, email, and password.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!form.hobbies.length || !form.strengths.length || !form.weaknesses.length) {
      setError("Please select at least one item for hobbies, strengths, and areas to improve.");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/api/auth/signup", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Account creation failed. Please try again.");
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
      setError("Google Sign-Up failed");
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "#faf9f5", padding: "50px 20px", position: "relative",
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Ambient background light */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(circle at 50% 25%, rgba(250, 204, 21, 0.15) 0%, transparent 65%)"
      }} />

      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        style={{ 
          width: "100%", maxWidth: "640px", padding: "44px 36px", 
          background: "#ffffff",
          borderRadius: "32px",
          border: "1px solid rgba(234, 179, 8, 0.25)",
          boxShadow: "0 25px 60px rgba(0,0,0,0.06)",
          zIndex: 10, position: "relative",
          textAlign: "center"
        }}
      >
        <button 
          onClick={step === 2 ? () => setStep(1) : handleLogoClick}
          style={{ 
            position: "absolute", top: "24px", left: "24px", background: "none", border: "none", 
            color: "#64748b", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px",
            fontSize: "13px", fontWeight: 700, transition: "color 0.2s"
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "#d97706"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "#64748b"; }}
        >
          <ChevronLeft size={16} /> {step === 2 ? "Back to Step 1" : "Home"}
        </button>

        {/* Step Indicator */}
        <div style={{ display: "inline-flex", gap: "8px", position: "absolute", top: "28px", right: "28px" }}>
          <span style={{ width: "24px", height: "4px", borderRadius: "2px", background: "#facc15" }} />
          <span style={{ width: "24px", height: "4px", borderRadius: "2px", background: step === 2 ? "#facc15" : "rgba(0,0,0,0.1)", transition: "background 0.3s" }} />
        </div>

        <div style={{ textAlign: "center", marginBottom: "32px", marginTop: "12px" }}>
          <div onClick={handleLogoClick} style={{ marginBottom: "18px", display: "inline-block", cursor: "pointer" }}>
            <FridayLogo size="1.8rem" color="#0f172a" />
          </div>

          <h2 style={{ fontSize: "1.8rem", fontWeight: 900, marginBottom: "6px", letterSpacing: "-0.5px", color: "#0f172a" }}>
            {step === 1 ? "Create your account" : "Your Preferences"}
          </h2>
          <p style={{ color: "#64748b", fontSize: "0.92rem", fontWeight: 500 }}>
            {step === 1 ? "Step 1 of 2 — Enter your details" : "Step 2 of 2 — Tell Friday a bit about yourself"}
          </p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }}
            style={{ 
              background: "#fef3c7", color: "#92400e", 
              padding: "12px 16px", borderRadius: "14px", marginBottom: "24px", fontSize: "0.88rem", textAlign: "left",
              border: "1px solid rgba(234, 179, 8, 0.4)", fontWeight: 700
            }}
          >
            {error}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.form 
              key="step1"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              onSubmit={handleNextStep} 
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <div style={{ position: "relative" }}>
                <User size={18} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                <input
                  style={{ 
                    width: "100%", padding: "14px 16px 14px 48px", borderRadius: "14px", 
                    background: "#f8fafc", border: "1px solid rgba(0,0,0,0.12)",
                    color: "#0f172a", outline: "none", transition: "all 0.25s ease",
                    fontSize: "0.95rem", fontWeight: 600
                  }}
                  className="auth-input-premium"
                  name="name"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

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
                  placeholder="Password (min 6 chars)"
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
                style={{ 
                  width: "100%", marginTop: "6px", padding: "14px",
                  fontSize: "0.98rem"
                }}
              >
                Continue to Preferences <ArrowRight size={18} />
              </button>
            </motion.form>
          ) : (
            <motion.form 
              key="step2"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              onSubmit={handleSubmit} 
              style={{ display: "flex", flexDirection: "column", gap: "24px" }}
            >
              <ProfileSelection selections={form} onSelect={handleSelect} />

              <button 
                type="submit" 
                className="btn-primary" 
                disabled={loading}
                style={{ 
                  width: "100%", padding: "14px",
                  fontSize: "0.98rem"
                }}
              >
                {loading ? "Creating Account..." : "Complete Sign Up"} <Sparkles size={18} />
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {step === 1 && (
          <>
            <div style={{ margin: "24px 0", display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
            </div>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError("Google Sign-Up failed")}
                theme="filled_black"
                shape="circle"
              />
            </div>
          </>
        )}

        <p style={{ marginTop: "28px", fontSize: "0.9rem", color: "rgba(255,255,255,0.5)" }}>
          Already have an account? <Link to="/login" style={{ color: "#fb7185", fontWeight: 700, textDecoration: "none" }}>Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;