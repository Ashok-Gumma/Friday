import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MoodPrompt from "../components/MoodPrompt";
import Chat from "../components/Chat";

const Home = () => {
  const [profile, setProfile] = useState(null);
  const [todayMood, setTodayMood] = useState(null);
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
    navigate("/login");
  };

  if (!profile) {
    return <div className="loading-screen">Loading your AI friend...</div>;
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="home-brand">
          <span> As You Wish</span>
        </div>
        <div className="home-actions">
          <button className="btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="chat-wrapper">
        <div className="chat-card">
          {!todayMood ? (
            <MoodPrompt onMoodSelect={setTodayMood} />
          ) : (
            <Chat profile={profile} todayMood={todayMood} />
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
