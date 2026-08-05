import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, ArrowRight, ChevronLeft, Eye, EyeOff, Sparkles } from "lucide-react";
import ProfileSelection from "./ProfileSelection";
import FridayLogo from "./FridayLogo.jsx";
import SatelliteCanvas from "./SatelliteCanvas.jsx";
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
    triggerLoading(1500);
    navigate("/");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
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
    <div
      style={{ 
        minHeight: "100vh",
        background: "#000000",
        color: "#ffffff",
        display: "flex",
        flexDirection: "column",
        justify: "space-between",
        position: "relative",
        fontFamily: "'Inter', sans-serif"
      }}
    >
      {/* CONTINUOUS SATELLITE CANVAS BACKGROUND */}
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
        
        {/* FULL WIDTH HEADER NAVIGATION BAR WITH FAR END CORNER ACTIONS */}
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
            onClick={handleLogoClick} 
            style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
          >
            <FridayLogo size="1.3rem" color="#ffffff" showBadge={true} />
          </div>

          {/* Far Right Corner: Auth Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Link to="/login" style={{ textDecoration: "none" }}>
              <button className="btn-minimal-secondary" style={{ padding: "8px 20px", fontSize: "0.82rem" }}>
                Sign In
              </button>
            </Link>
          </div>
        </header>

        {/* CENTERED SIGNUP FORM CONTAINER */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="minimal-card"
            style={{ 
              width: "100%",
              maxWidth: step === 1 ? "440px" : "620px",
              padding: "40px 32px", 
              textAlign: "center",
              boxShadow: "0 25px 60px rgba(0,0,0,0.8)",
              transition: "max-width 0.3s ease"
            }}
          >
            {/* Step Indicator */}
            <div style={{ display: "inline-flex", gap: "6px", position: "absolute", top: "24px", right: "24px" }}>
              <span style={{ width: "20px", height: "3px", borderRadius: "2px", background: "#ffffff" }} />
              <span style={{ width: "20px", height: "3px", borderRadius: "2px", background: step === 2 ? "#ffffff" : "rgba(255,255,255,0.2)", transition: "background 0.3s" }} />
            </div>

            {/* Header branding */}
            <div style={{ marginBottom: "28px" }}>
              <div onClick={handleLogoClick} style={{ marginBottom: "14px", display: "inline-block", cursor: "pointer" }}>
                <FridayLogo size="1.6rem" color="#ffffff" />
              </div>

              <h2 style={{ fontSize: "1.9rem", fontWeight: 800, marginBottom: "6px", color: "#ffffff" }}>
                {step === 1 ? (
                  <>Create <span className="font-curly" style={{ fontSize: "1.25em" }}>your account</span></>
                ) : (
                  <>Personalize <span className="font-serif-italic">your profile</span></>
                )}
              </h2>
              <p style={{ color: "#a1a1aa", fontSize: "0.88rem", fontWeight: 400 }}>
                {step === 1 ? "Step 1 of 2 — Enter your details to get started" : "Step 2 of 2 — Tailor Friday to your preferences"}
              </p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
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

            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.form 
                  key="step1"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  onSubmit={handleNextStep} 
                  style={{ display: "flex", flexDirection: "column", gap: "16px" }}
                >
                  <div style={{ position: "relative" }}>
                    <User size={18} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#71717a" }} />
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
                        fontWeight: 500
                      }}
                      name="name"
                      placeholder="Your Name"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

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
                        fontWeight: 500
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
                        fontWeight: 500
                      }}
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
                        background: "none", border: "none", color: "#71717a", cursor: "pointer"
                      }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  <button 
                    type="submit" 
                    className="btn-minimal-primary" 
                    style={{ 
                      width: "100%",
                      marginTop: "6px",
                      padding: "14px",
                      fontSize: "0.95rem",
                      borderRadius: "14px"
                    }}
                  >
                    Continue to Preferences <ArrowRight size={17} />
                  </button>
                </motion.form>
              ) : (
                <motion.form 
                  key="step2"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  onSubmit={handleSubmit} 
                  style={{ display: "flex", flexDirection: "column", gap: "20px", textAlign: "left" }}
                >
                  <ProfileSelection form={form} onChange={handleSelect} />

                  <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
                    <button 
                      type="button" 
                      onClick={() => setStep(1)}
                      className="btn-minimal-secondary"
                      style={{ flex: 1, padding: "12px", borderRadius: "14px", fontSize: "0.9rem" }}
                    >
                      Back
                    </button>
                    <button 
                      type="submit" 
                      className="btn-minimal-primary"
                      disabled={loading}
                      style={{ flex: 2, padding: "12px", borderRadius: "14px", fontSize: "0.95rem" }}
                    >
                      {loading ? "Creating Account..." : "Complete Sign Up"} <ArrowRight size={17} />
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            <p style={{ marginTop: "24px", fontSize: "0.88rem", color: "#a1a1aa", fontWeight: 500 }}>
              Already have an account? <Link to="/login" style={{ color: "#ffffff", fontWeight: 700, textDecoration: "none" }}>Sign in</Link>
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

export default Signup;