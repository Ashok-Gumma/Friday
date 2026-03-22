import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ThemeSwitch from "../components/ThemeSwitch";
import logoBg from "../assets/as-you-wish-logo.png";

const Profile = ({ theme, setTheme }) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [strengthInput, setStrengthInput] = useState("");
  const [weaknessInput, setWeaknessInput] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data.profile);
    } catch (err) {
      console.error("Failed to fetch profile", err);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      const res = await axios.put(
        "/api/auth/profile",
        {
          strengths: profile.strengths,
          weaknesses: profile.weaknesses,
          hobbies: profile.hobbies,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProfile(res.data.profile);
      localStorage.setItem("userProfile", JSON.stringify(res.data.profile));
      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const addStrength = () => {
    if (strengthInput.trim()) {
      setProfile({
        ...profile,
        strengths: [...profile.strengths, strengthInput.trim()],
      });
      setStrengthInput("");
    }
  };

  const removeStrength = (index) => {
    const newStrengths = profile.strengths.filter((_, i) => i !== index);
    setProfile({ ...profile, strengths: newStrengths });
  };

  const addWeakness = () => {
    if (weaknessInput.trim()) {
      setProfile({
        ...profile,
        weaknesses: [...profile.weaknesses, weaknessInput.trim()],
      });
      setWeaknessInput("");
    }
  };

  const removeWeakness = (index) => {
    const newWeaknesses = profile.weaknesses.filter((_, i) => i !== index);
    setProfile({ ...profile, weaknesses: newWeaknesses });
  };

  if (loading) return <div className="loading-screen">Loading...</div>;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <ThemeSwitch theme={theme} setTheme={setTheme} />
        <button className="back-button" onClick={() => navigate("/chat")}>
          Back to Chat
        </button>
      </div>

      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-user-info">
            <img 
              src={profile.avatar || logoBg} 
              alt="Avatar" 
              className="profile-avatar" 
            />
            <div className="profile-text">
              <h2>{profile.name}</h2>
              <p>{profile.email}</p>
            </div>
          </div>

          <div className="profile-sections">
            <div className="profile-section">
              <h3>My Strengths</h3>
              <div className="tag-input">
                <input
                  type="text"
                  placeholder="Add a strength..."
                  value={strengthInput}
                  onChange={(e) => setStrengthInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addStrength()}
                />
                <button onClick={addStrength}>Add</button>
              </div>
              <div className="tags">
                {profile.strengths.map((s, i) => (
                  <span key={i} className="tag strength">
                    {s} <button onClick={() => removeStrength(i)}>&times;</button>
                  </span>
                ))}
              </div>
            </div>

            <div className="profile-section">
              <h3>My Weaknesses</h3>
              <div className="tag-input">
                <input
                  type="text"
                  placeholder="Add a weakness..."
                  value={weaknessInput}
                  onChange={(e) => setWeaknessInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addWeakness()}
                />
                <button onClick={addWeakness}>Add</button>
              </div>
              <div className="tags">
                {profile.weaknesses.map((w, i) => (
                  <span key={i} className="tag weakness">
                    {w} <button onClick={() => removeWeakness(i)}>&times;</button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {message && <div className="profile-message">{message}</div>}

          <button 
            className="save-button" 
            onClick={handleSave} 
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
