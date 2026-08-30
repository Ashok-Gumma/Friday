import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import ThemeToggle from "./ThemeToggle.jsx";
import { NotionSignupArt } from "./NotionArt.jsx";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
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
      const res = await axios.post("/api/auth/signup", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userProfile", JSON.stringify(res.data.profile || {}));
      navigate("/chat");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    setError("");
    try {
      const res = await axios.post("/api/auth/google", { token: credentialResponse.credential });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userProfile", JSON.stringify(res.data.profile || {}));
      navigate("/chat");
    } catch {
      setError("Google Sign-Up failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg-soft)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      fontFamily: "'Inter', sans-serif",
      position: "relative",
      transition: "background 0.2s ease"
    }}>
      {/* Top Bar with Back and ThemeToggle */}
      <div style={{
        position: "absolute",
        top: "20px",
        left: "24px",
        right: "24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        maxWidth: "960px",
        margin: "0 auto"
      }}>
        <button
          onClick={() => navigate("/")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: "transparent",
            border: "none",
            color: "var(--text-muted)",
            fontSize: "0.85rem",
            fontWeight: 500,
            cursor: "pointer"
          }}
        >
          <ArrowLeft size={16} /> Home
        </button>
        <ThemeToggle size="sm" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          width: "100%",
          maxWidth: "880px",
          background: "var(--bg-card)",
          borderRadius: "20px",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-md)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
          overflow: "hidden",
          marginTop: "30px"
        }}
      >
        {/* Left Notion Cartoon Illustration Side */}
        <div style={{
          padding: "40px 32px",
          background: "var(--bg-card-subtle)",
          borderRight: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center"
        }}>
          <span style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--text)", letterSpacing: "-0.3px", marginBottom: "16px" }}>
            Friday AI
          </span>
          <div style={{ padding: "10px 0" }}>
            <NotionSignupArt width={220} height={220} />
          </div>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text)", marginTop: "12px", marginBottom: "6px" }}>
            Your safe space to talk
          </h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", maxWidth: "260px", lineHeight: 1.5 }}>
            Join thousands exploring their emotional health with adaptive Machine Learning.
          </p>
        </div>

        {/* Right Form Side */}
        <div style={{ padding: "40px 36px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ marginBottom: "24px" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.8px", color: "var(--text)", marginBottom: "6px" }}>
              Create account
            </h2>
            <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
              Start talking to Friday — it's free.
            </p>
          </div>

          {error && (
            <div style={{
              padding: "10px 14px", borderRadius: "8px",
              background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.25)",
              color: "#ef4444", fontSize: "0.85rem", marginBottom: "16px", fontWeight: 500
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>Full name</label>
              <div style={{ position: "relative" }}>
                <User size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-faint)" }} />
                <input
                  type="text" name="name" value={form.name}
                  onChange={handleChange} required placeholder="Your name"
                  className="n-input" style={{ paddingLeft: "36px" }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>Email</label>
              <div style={{ position: "relative" }}>
                <Mail size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-faint)" }} />
                <input
                  type="email" name="email" value={form.email}
                  onChange={handleChange} required placeholder="you@example.com"
                  className="n-input" style={{ paddingLeft: "36px" }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>Password</label>
              <div style={{ position: "relative" }}>
                <Lock size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-faint)" }} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password" value={form.password}
                  onChange={handleChange} required placeholder="••••••••"
                  className="n-input" style={{ paddingLeft: "36px", paddingRight: "40px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-faint)", cursor: "pointer", display: "flex" }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit" disabled={isLoading}
              className="n-btn n-btn-primary"
              style={{ width: "100%", justifyContent: "center", padding: "11px", fontSize: "0.9rem", fontWeight: 600, marginTop: "6px", borderRadius: "8px" }}
            >
              {isLoading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "20px 0" }}>
            <hr style={{ flex: 1, border: "none", borderTop: "1px solid var(--border)" }} />
            <span style={{ fontSize: "0.78rem", color: "var(--text-faint)", fontWeight: 500 }}>or</span>
            <hr style={{ flex: 1, border: "none", borderTop: "1px solid var(--border)" }} />
          </div>

          <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError("Google Sign-Up failed")} shape="rectangular" />
          </div>

          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", textAlign: "center" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "var(--text)", fontWeight: 700, textDecoration: "none" }}>
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;