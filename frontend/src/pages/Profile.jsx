import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ProfileSelection from "../components/ProfileSelection";
import logo from "../assets/white-logo.png";

const Profile = () => {
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

  const handleSelect = (category, value) => {
    setProfile((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((v) => v !== value)
        : [...prev[category], value],
    }));
  };

  if (loading) return <div className="loading-screen">Loading...</div>;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div 
          onClick={() => navigate("/")} 
          style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}
        >
          <img src={logo} alt="Logo" style={{ width: "32px", height: "32px", objectFit: "contain" }} />
          <h2 style={{ fontSize: "18px", fontWeight: "700", margin: 0, color: "white" }}>As You Wish</h2>
        </div>
        <button className="back-button" onClick={() => navigate("/chat")}>
          Back to Chat
        </button>
      </div>

      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-user-info">
            <img 
              src={profile.avatar || logo} 
              alt="Avatar" 
              className="profile-avatar" 
            />
            <div className="profile-text">
              <h2>{profile.name}</h2>
              <p>{profile.email}</p>
            </div>
          </div>

          <div className="auth-profile-section" style={{ textAlign: "left" }}>
            <ProfileSelection selections={profile} onSelect={handleSelect} />
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
