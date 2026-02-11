import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ThemeSwitch from "./ThemeSwitch";

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
    <div className="home-container">
      <header className="home-header">
        <div className="home-header-inner">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img src="/as-you-wish-logo.png" alt="As You Wish" style={{ width: 36 }} />
            <div className="home-title">As You Wish</div>
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <ThemeSwitch theme={theme} setTheme={setTheme} />

            {!token ? (
              <>
                <Link to="/login" className="logout-btn">Login</Link>
                <Link to="/signup" className="logout-btn">Get Started</Link>
              </>
            ) : (
              <button className="logout-btn" onClick={handleLogout}>
                Sign Out
              </button>
            )}
          </div>
        </div>
      </header>

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "80px 24px",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "42px", fontWeight: 800, marginBottom: "16px" }}>
          Build Your Smart AI Chatbot
        </h1>
        <p style={{ color: "var(--muted)", marginBottom: "24px", fontSize: "18px" }}>
          Create fast, modern, and intelligent chat experiences for your users in minutes.
        </p>

        {!token && (
          <Link to="/signup" className="auth-button" style={{ maxWidth: "220px", display: "inline-block" }}>
            Get Started
          </Link>
        )}
      </div>
    </div>
  );
};

export default Home;
