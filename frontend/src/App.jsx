import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./components/home.jsx";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import Chat from "./components/Chat.jsx";
import PageTransition from "./components/PageTransition.jsx";

function App() {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <>
      <PageTransition>
        <Routes>
          <Route path="/" element={<Home theme={theme} setTheme={setTheme} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/chat" element={<Chat theme={theme} setTheme={setTheme} />} />
        </Routes>
      </PageTransition>
    </>
  );
}

export default App;
