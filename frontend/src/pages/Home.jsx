import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, Mic, Sparkles, Shield } from "lucide-react";
import MoodPrompt from "../components/MoodPrompt";
import Chat from "../components/Chat";
import logo from "../assets/white-logo.png";

const Home = () => {
  const [todayMood, setTodayMood] = useState(sessionStorage.getItem("todayMood"));
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedProfile = localStorage.getItem("userProfile");

    if (!token || !storedProfile) {
      navigate("/login");
      return;
    }

    setProfile(JSON.parse(storedProfile));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  const handleMoodSelect = (mood) => {
    setTodayMood(mood);
    sessionStorage.setItem("todayMood", mood);
  };

  if (!profile) {
    return <div className="loading-screen">Loading your AI friend...</div>;
  }

  if (todayMood) {
    return <Chat profile={profile} todayMood={todayMood} />;
  }

  return (
    <div className="home-container" style={{ position: 'relative', height: '100vh', overflowY: 'auto', overflowX: 'hidden' }}>
      
      {/* Immersive Floating Background Boxes */}
      <div className="chat-bg-blobs" style={{ position: 'fixed' }}>
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
        <div className="blob blob-4"></div>
        <div className="blob blob-5"></div>
        <div className="blob blob-6"></div>
      </div>

      <header className="home-header" style={{ position: 'relative', zIndex: 10 }}>
        <div className="home-brand">
          <img src={logo} alt="Logo" style={{ width: "32px", height: "32px" }} />
          <span>As You Wish</span>
        </div>
        <div className="home-actions">
          <button className="btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="home-hero" style={{ position: 'relative', zIndex: 10 }}>
        <div className="fade-in-slide-up">
          <h1 className="hero-title">Experience AI Immersion</h1>
          <p style={{ color: "var(--muted)", fontSize: "1.2rem", maxWidth: "600px", margin: "0 auto 3rem" }}>
            The next generation of conversational intelligence. Personal, immersive, and predictive.
          </p>
        </div>

        <div className="feature-grid">
          <div className="feature-card float-v1">
            <div className="feature-icon"><Zap size={24} /></div>
            <h3>Multimodal Core</h3>
            <p>Powered by bleeding-edge AI to fulfill every command with precision and logic.</p>
          </div>
          <div className="feature-card float-v2">
            <div className="feature-icon"><Mic size={24} /></div>
            <h3>Crystal Voice</h3>
            <p>Seamless voice interaction for a hands-free, futuristic control experience.</p>
          </div>
          <div className="feature-card float-v3">
            <div className="feature-icon"><Sparkles size={24} /></div>
            <h3>Adaptive Bokeh</h3>
            <p>A living application environment that morphs visually based on your selected mood.</p>
          </div>
          <div className="feature-card float-v4">
            <div className="feature-icon"><Shield size={24} /></div>
            <h3>Deep Memory</h3>
            <p>Intelligence that remembers your strengths and preferences to personalize every interaction.</p>
          </div>
        </div>

        <div className="chat-card" style={{ marginTop: "4rem", marginBottom: "4rem", position: "relative", zIndex: 20 }}>
          <MoodPrompt onMoodSelect={handleMoodSelect} />
        </div>
      </main>
    </div>
  );
};

export default Home;
