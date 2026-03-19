import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ThemeSwitch from "./ThemeSwitch";
import logo from "../assets/as-you-wish-logo.png";

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("theme-transition");
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);

    const t = setTimeout(() => root.classList.remove("theme-transition"), 300);
    return () => clearTimeout(t);
  }, [theme]);

  // If logged in, go to chat
  useEffect(() => {
    if (token) navigate("/chat");
  }, [token, navigate]);

  return (
    <div className="home-container">
      {/* Navbar matching Antigravity */}
      <header className="home-header">
        <div className="home-brand">
          <img src={logo} alt="Logo" />
          <span>As You Wish</span>
        </div>

        <div className="home-actions">
          <ThemeSwitch theme={theme} setTheme={setTheme} />
          {!token ? (
            <Link to="/signup" className="btn-primary">Get Started</Link>
          ) : null}
        </div>
      </header>

      {/* Hero Section matching Antigravity */}
      <section className="home-hero">
        <h1>Experience liftoff with your<br />next-generation AI</h1>

        <div className="hero-actions" style={{ marginTop: '20px' }}>
          {!token ? (
            <>
              <Link to="/signup" className="btn-primary">Get Started Free</Link>
              <Link to="/login" className="btn-secondary">Log In to Account</Link>
            </>
          ) : (
            <Link to="/chat" className="btn-primary">Go to Chat</Link>
          )}
        </div>
      </section>

      {/* Kept a minimal sections to showcase theme features downwards */}
      <section className="home-section" style={{ background: 'transparent', borderTop: 'none' }}>
        <div className="section-inner">
          <div className="card-grid" style={{ marginTop: '60px' }}>
            <div className="info-card">
              <h3>1. Create Account</h3>
              <p>Sign up and set your profile preferences rapidly.</p>
            </div>
            <div className="info-card">
              <h3>2. Choose Your Mood</h3>
              <p>Pick how your AI should talk to you today.</p>
            </div>
            <div className="info-card">
              <h3>3. Start Chatting</h3>
              <p>Use text or voice to talk with your AI seamlessly.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;