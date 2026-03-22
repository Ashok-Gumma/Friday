import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Sparkles, Shield, Cpu } from "lucide-react";
import logo from "../assets/white-logo.png";

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // If logged in, go to chat
  useEffect(() => {
    if (token) navigate("/chat");
  }, [token, navigate]);

  return (
    <div className="home-root" style={{ 
      position: 'relative', minHeight: '100vh', overflow: 'hidden', 
      background: '#000', display: 'flex', flexDirection: 'column', color: '#fff' 
    }}>
      
      {/* Immersive Floating Background Boxes */}
      <div className="chat-bg-blobs" style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      <div className="home-container fade-in-slide-up" style={{ 
        position: 'relative', zIndex: 10, flex: 1, display: 'flex', flexDirection: 'column' 
      }}>

        {/* Navbar */}
        <header style={{ 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
          padding: '24px 48px', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.05)' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => navigate("/")}>
            <img src={logo} alt="Logo" style={{ width: '32px', height: '32px' }} />
            <span style={{ fontSize: '1.2rem', fontWeight: 600, letterSpacing: '1px' }}>As You Wish</span>
          </div>
          <div>
            {!token ? (
              <Link to="/signup" className="btn-primary" style={{ padding: '10px 24px', borderRadius: '8px', fontSize: '14px' }}>Access Terminal</Link>
            ) : (
              <Link to="/chat" className="btn-primary" style={{ padding: '10px 24px', borderRadius: '8px', fontSize: '14px' }}>Return to Mission</Link>
            )}
          </div>
        </header>

        {/* Hero & Features (Centered) */}
        <main style={{ 
          flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', 
          padding: '0 5%', textAlign: 'center' 
        }}>
          
          <div style={{ marginBottom: '60px' }}>
            <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '20px', letterSpacing: '-1px' }}>
              Absolute Precision.
            </h1>
            <p style={{ color: "var(--muted)", fontSize: "1.2rem", maxWidth: "600px", margin: "0 auto", lineHeight: 1.6 }}>
              A distraction-free, ultra-integrated AI command center. <br /> Built for speed, immersion, and total logical clarity.
            </p>
          </div>

          {/* Clean Floating Features Row */}
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '1000px' }}>
            
            <div className="feature-card float-v1" style={{ width: '280px', padding: '24px', textAlign: 'left', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', backdropFilter: 'blur(10px)' }}>
              <Sparkles size={24} style={{ color: 'var(--primary)', marginBottom: '16px' }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Neural Adaptability</h3>
              <p style={{ fontSize: '14px', color: 'var(--muted)', margin: 0, lineHeight: 1.5 }}>Dynamic mood selection formats the AI's personality and tone perfectly to your required workflow.</p>
            </div>

            <div className="feature-card float-v2" style={{ width: '280px', padding: '24px', textAlign: 'left', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', backdropFilter: 'blur(10px)' }}>
              <Cpu size={24} style={{ color: 'var(--primary)', marginBottom: '16px' }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Zero Latency</h3>
              <p style={{ fontSize: '14px', color: 'var(--muted)', margin: 0, lineHeight: 1.5 }}>Seamless multimodal execution. From text logic to voice-activated commands instantly.</p>
            </div>

            <div className="feature-card float-v3" style={{ width: '280px', padding: '24px', textAlign: 'left', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', backdropFilter: 'blur(10px)' }}>
              <Shield size={24} style={{ color: 'var(--primary)', marginBottom: '16px' }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Absolute Privacy</h3>
              <p style={{ fontSize: '14px', color: 'var(--muted)', margin: 0, lineHeight: 1.5 }}>Rigorous end-to-end security ensures your session data remains isolated and protected globally.</p>
            </div>

          </div>

        </main>

        <footer style={{ textAlign: 'center', padding: '24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p style={{ fontSize: '12px', letterSpacing: '2px', color: 'var(--muted)', margin: 0, textTransform: 'uppercase' }}>
            &copy; 2026 As You Wish AI Core.
          </p>
        </footer>

      </div>
    </div>
  );
};

export default Home;