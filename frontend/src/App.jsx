import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AnimatePresence } from "framer-motion";

import PageLoader from "./components/PageLoader.jsx";
import Home from "./components/Home.jsx";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import Chat from "./components/Chat.jsx";
import Profile from "./pages/Profile.jsx";
import PageTransition from "./components/PageTransition.jsx";

import { LoadingProvider, useLoading } from "./context/LoadingContext.jsx";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

const AppContent = () => {
  const { isLoading, triggerLoading } = useLoading();
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    // Initial mount loading
    triggerLoading(2000);
  }, []);

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AnimatePresence mode="wait">
        {isLoading && <PageLoader key="loader" />}
      </AnimatePresence>
      
      {!isLoading && (
        <PageTransition>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/chat" element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PageTransition>
      )}
    </GoogleOAuthProvider>
  );
};

function App() {
  return (
    <LoadingProvider>
      <AppContent />
    </LoadingProvider>
  );
}



export default App;
