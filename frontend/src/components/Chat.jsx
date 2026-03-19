import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import MoodPrompt from "./MoodPrompt";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [todayMood, setTodayMood] = useState(null);
  const [listening, setListening] = useState(false);
  const [voiceReply, setVoiceReply] = useState(true);
  const voiceReplyRef = useRef(true);
  const [isTyping, setIsTyping] = useState(false);

  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState("");

  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const profile = JSON.parse(localStorage.getItem("userProfile") || "{}");
  const synth = window.speechSynthesis;

  // Protect route
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");
  }, [navigate]);

  // Setup speech recognition once
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
    }
  }, []);

  // Load voices
  useEffect(() => {
    const loadVoices = () => {
      const v = synth.getVoices();
      setVoices(v);
      if (v.length > 0 && !selectedVoice) setSelectedVoice(v[0].name);
    };
    loadVoices();
    synth.onvoiceschanged = loadVoices;
  }, [synth, selectedVoice]);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Mic events
  useEffect(() => {
    if (!recognitionRef.current) return;

    recognitionRef.current.onresult = (e) => {
      let transcript = "";
      for (let i = 0; i < e.results.length; i++) {
        transcript += e.results[i][0].transcript;
      }
      setInput(transcript);
    };

    recognitionRef.current.onend = () => {
      setListening(false);
      if (input.trim()) handleSend(input);
    };
    // eslint-disable-next-line
  }, [input]);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition not supported");
      return;
    }

    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      setInput("");
      recognitionRef.current.start();
      setListening(true);
    }
  };

  const speakText = (text) => {
    if (!voiceReplyRef.current) return;
    synth.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    const voice = voices.find((v) => v.name === selectedVoice);
    if (voice) utter.voice = voice;
    synth.speak(utter);
  };

  const handleSend = async (text = input) => {
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { type: "user", text }]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await axios.post("/api/chat", {
        message: text,
        mood: todayMood,
        profile,
      });

      const aiText = res.data.reply;
      setIsTyping(false);
      setMessages((prev) => [...prev, { type: "ai", text: aiText }]);
      speakText(aiText);
    } catch {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { type: "ai", text: "Sorry, something went wrong 😅" },
      ]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userProfile");
    navigate("/");
  };

  if (!todayMood) return <MoodPrompt onMoodSelect={setTodayMood} />;

  return (
    <div className="chat-wrapper">
      <div className="chat-card">
        {/* Header */}
        <div className="chat-header">
          <div style={{ display: "flex", flexDirection: "column" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "600", margin: 0 }}>As You Wish AI</h2>
            <p>Mood: {todayMood}</p>
          </div>

          <div className="chat-header-actions">
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
            >
              {voices.map((v, i) => (
                <option key={i} value={v.name}>{v.name}</option>
              ))}
            </select>

            <button
              onClick={() => {
                const newValue = !voiceReply;
                setVoiceReply(newValue);
                voiceReplyRef.current = newValue;
                if (!newValue) synth.cancel(); // Stop talking immediately if turned off
              }}
              className="voice-btn"
              style={{ background: voiceReply ? "var(--primary)" : "transparent", color: voiceReply ? "white" : "inherit" }}
              title="Toggle AI voice"
            >
              🔊
            </button>

            <button
              onClick={handleLogout}
              className="btn-secondary"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="chat-empty">
              👋 Say hello to your AI!
            </div>
          ) : null}

          {messages.map((m, i) => (
            <div key={i} className={`chat-message ${m.type === "user" ? "user" : "ai"}`}>
              {m.text}
            </div>
          ))}

          {isTyping && (
            <div className="typing-indicator">
              AI is typing<span className="dots"></span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="chat-input">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={listening ? "Listening..." : "Type your message..."}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />

          <button
            onClick={toggleMic}
            className={`voice-btn flex-shrink-0 ${listening ? "active" : ""}`}
            title="Use microphone"
          >
            🎤
          </button>

          <button
            onClick={() => handleSend()}
            disabled={!input.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
