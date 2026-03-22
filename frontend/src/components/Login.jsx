import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import ThemeSwitch from "./ThemeSwitch";

import logoBg from "../assets/as-you-wish-logo.png";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("theme-transition");
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);

    const t = setTimeout(() => root.classList.remove("theme-transition"), 300);
    return () => clearTimeout(t);
  }, [theme]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userProfile", JSON.stringify(res.data.profile));
      navigate("/chat");
    } catch {
      setError("Invalid email or password");
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
    <div className="auth-split">
      <div className="auth-theme-switch">
        <ThemeSwitch theme={theme} setTheme={setTheme} />
      </div>

      <div className="auth-card">
        <div className="auth-brand">
          <img src={logoBg} alt="As You Wish" className="auth-logo" />
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Log in to your smart AI companion</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            className="auth-input"
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            className="auth-input"
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button className="auth-button" type="submit">Login</button>
        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <div className="google-login-container">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError("Google Login failed")}
            useOneTap
            theme={theme === "dark" ? "filled_blue" : "outline"}
            shape="pill"
            width="100%"
          />
        </div>

        <div className="auth-footer">
          Don’t have an account? <Link to="/signup">Sign up</Link>
        </div>
      </div>
    </div>
  );
};


export default Login;