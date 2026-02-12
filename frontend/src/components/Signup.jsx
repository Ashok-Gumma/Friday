import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import ProfileSelection from "./ProfileSelection";
import ThemeSwitch from "./ThemeSwitch";

// ✅ Import logo + background
import logo from "../assets/as-you-wish-logo.png";
import homeBg from "../assets/home-logo.png";

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

  return (
    <div
      className="auth-split auth-bg-merged"
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${homeBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* 🔹 Blurred logo layer */}
      <div
        className="bg-logo-blur"
        style={{
          backgroundImage: `url(${logo})`,
        }}
      />

      {/* Left: Form */}
      <div className="auth-side">
        <div className="auth-theme-switch">
          <ThemeSwitch theme={theme} setTheme={setTheme} />
        </div>

        <div className="auth-card auth-card-large">
          <div className="auth-brand">
            <h2 className="auth-title">Create Your Account</h2>
            <p className="auth-subtitle">Join and personalize your AI experience</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <input
              className="auth-input"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
            />
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
              minLength={6}
            />

            <div className="auth-profile-section">
              <ProfileSelection selections={form} onSelect={handleSelect} />
            </div>

            <button className="auth-button" type="submit" disabled={loading}>
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </div>
      </div>

      {/* Right: Logo / Visual */}
      <div className="auth-visual">
        <div className="auth-visual-overlay">
          <img src={logo} alt="As You Wish" className="auth-logo" />
          <h1>As You Wish!</h1>
          <p>Your personal AI companion</p>
        </div>
      </div>
    </div>
  );
};

export default Signup;