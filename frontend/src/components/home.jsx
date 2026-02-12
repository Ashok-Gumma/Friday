import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ThemeSwitch from "./ThemeSwitch";

// ✅ Import images from assets
import logo from "../assets/as-you-wish-logo.png";
import homeBg from "../assets/home-logo.png";

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userProfile");
    navigate("/");
  };

  return (
    <div
      className="home-container"
      style={{
        backgroundImage: `url(${homeBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Header */}
      <header className="home-header">
        <div className="home-header-inner">
          <div className="home-brand">
            <img src={logo} alt="As You Wish" />
            <span>As You Wish!</span>
          </div>

          <div className="home-actions">
            <ThemeSwitch theme={theme} setTheme={setTheme} />

            {!token ? (
              <>
                <Link to="/login" className="btn-secondary">Login</Link>
                <Link to="/signup" className="btn-primary">Get Started</Link>
              </>
            ) : (
              <button className="btn-primary" onClick={handleLogout}>
                Sign Out
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="home-hero">
        <h1>
          Your Personal AI, <span>As You Wish!</span>
        </h1>
        <p>
          Chat smarter, think faster, and get things done with your own AI companion.
          Talk by text or voice, choose your mood, and get responses that feel human.
        </p>

        {!token && (
          <div className="hero-actions">
            <Link to="/signup" className="btn-primary">Get Started Free</Link>
            <Link to="/login" className="btn-secondary">Login</Link>
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="home-section alt">
        <div className="section-inner">
          <h2>How It Works</h2>
          <p className="section-sub">Simple. Fast. Powerful.</p>

          <div className="card-grid">
            {[
              { title: "1. Create Account", desc: "Sign up and set your profile preferences." },
              { title: "2. Choose Your Mood", desc: "Pick how your AI should talk to you today." },
              { title: "3. Start Chatting", desc: "Use text or voice to talk with your AI." },
              { title: "4. Get Smart Replies", desc: "Receive helpful, human-like responses instantly." },
            ].map((item, i) => (
              <div key={i} className="info-card">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="home-section">
        <div className="section-inner">
          <h2>Why You’ll Love It</h2>
          <p className="section-sub">Built to feel personal, fast, and powerful.</p>

          <div className="card-grid">
            {[
              "🎙 Voice Input & AI Voice Replies",
              "🎭 Mood-Based Personalities",
              "⚡ Fast & Smooth Chat Experience",
              "🎨 Multiple Themes",
              "🧠 Smart, Context-Aware Replies",
              "🔒 Secure Login System",
            ].map((text, i) => (
              <div key={i} className="feature-card">{text}</div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!token && (
        <section className="home-cta">
          <h2>Ready to talk with your AI?</h2>
          <p>Create your account and start chatting in seconds.</p>
          <Link to="/signup" className="btn-primary">Get Started Now 🚀</Link>
        </section>
      )}
    </div>
  );
};

export default Home;