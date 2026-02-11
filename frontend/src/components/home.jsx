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
      {/* Header */}
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

      {/* Hero */}
      <section style={{ padding: "80px 24px", textAlign: "center", maxWidth: 1100, margin: "0 auto" }}>
        <h1 style={{ fontSize: "46px", fontWeight: 900, marginBottom: 16 }}>
          Your Personal AI, <span style={{ color: "var(--primary)" }}>As You Wish</span>
        </h1>
        <p style={{ color: "var(--muted)", fontSize: 18, maxWidth: 700, margin: "0 auto 28px" }}>
          Chat smarter, think faster, and get things done with your own AI companion.
          Talk by text or voice, choose your mood, and get responses that feel human.
        </p>

        {!token && (
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <Link to="/signup" className="auth-button" style={{ maxWidth: 220 }}>
              Get Started Free
            </Link>
            <Link to="/login" className="logout-btn" style={{ background: "var(--border)", color: "var(--text)" }}>
              Login
            </Link>
          </div>
        )}
      </section>

      {/* How it works */}
      <section style={{ padding: "60px 24px", background: "var(--card)", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>How It Works</h2>
          <p style={{ color: "var(--muted)", marginBottom: 40 }}>
            Simple. Fast. Powerful.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
            {[
              { title: "1. Create Account", desc: "Sign up and set your profile preferences." },
              { title: "2. Choose Your Mood", desc: "Pick how your AI should talk to you today." },
              { title: "3. Start Chatting", desc: "Use text or voice to talk with your AI." },
              { title: "4. Get Smart Replies", desc: "Receive helpful, human-like responses instantly." },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                  borderRadius: 16,
                  padding: 24,
                  textAlign: "left",
                }}
              >
                <h3 style={{ fontWeight: 700, marginBottom: 8 }}>{item.title}</h3>
                <p style={{ color: "var(--muted)", fontSize: 14 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "60px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>Why You’ll Love It</h2>
          <p style={{ color: "var(--muted)", marginBottom: 40 }}>
            Built to feel personal, fast, and powerful.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
            {[
              "🎙 Voice Input & AI Voice Replies",
              "🎭 Mood-Based Personalities",
              "⚡ Fast & Smooth Chat Experience",
              "🎨 Multiple Themes (Light, Dark, More)",
              "🧠 Smart, Context-Aware Replies",
              "🔒 Secure Login & Profile System",
            ].map((text, i) => (
              <div
                key={i}
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 16,
                  padding: 24,
                  boxShadow: "var(--shadow)",
                  fontWeight: 600,
                }}
              >
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section style={{ padding: "60px 24px", background: "var(--card)", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>What Can You Use It For?</h2>
          <p style={{ color: "var(--muted)", marginBottom: 40 }}>
            Your AI, your rules.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
            {[
              "📚 Study & Learning",
              "💻 Coding Help",
              "📝 Writing & Ideas",
              "🧘 Motivation & Support",
              "🗣 Daily Conversations",
              "📈 Productivity & Planning",
            ].map((text, i) => (
              <div
                key={i}
                style={{
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                  borderRadius: 16,
                  padding: 20,
                  fontWeight: 600,
                }}
              >
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      {!token && (
        <section style={{ padding: "80px 24px", textAlign: "center" }}>
          <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 16 }}>
            Ready to talk with your AI?
          </h2>
          <p style={{ color: "var(--muted)", marginBottom: 24 }}>
            Create your account and start chatting in seconds.
          </p>
          <Link to="/signup" className="auth-button" style={{ maxWidth: 240, display: "inline-block" }}>
            Get Started Now 🚀
          </Link>
        </section>
      )}
    </div>
  );
};

export default Home;
