import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Home from "./components/home.jsx";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import Chat from "./components/Chat.jsx";
import Profile from "./pages/Profile.jsx";
import PageTransition from "./components/PageTransition.jsx";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <PageTransition>
        <Routes>
          <Route path="/" element={<Home  />} />
          <Route path="/login" element={<Login  />} />
          <Route path="/signup" element={<Signup  />} />
          <Route path="/chat" element={
            <ProtectedRoute>
              <Chat  />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile  />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PageTransition>
    </GoogleOAuthProvider>
  );
}


export default App;
