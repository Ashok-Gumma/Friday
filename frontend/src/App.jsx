import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";

import PageLoader from "./components/PageLoader.jsx";
import Home from "./components/Home.jsx";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import Chat from "./components/Chat.jsx";
import Profile from "./pages/Profile.jsx";
import PageTransition from "./components/PageTransition.jsx";
import SmoothScroll from "./components/SmoothScroll.jsx";

import { ThemeProvider } from "./context/ThemeContext.jsx";
import { LoadingProvider, useLoading } from "./context/LoadingContext.jsx";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

const AppContent = () => {
  const { isLoading, triggerLoading } = useLoading();
  const location = useLocation();

  useEffect(() => {
    // Initial mount loading
    triggerLoading(2200);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <PageLoader key="loader" />}
      </AnimatePresence>
      
      {!isLoading && (
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
            <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
            <Route path="/chat" element={
              <ProtectedRoute>
                <PageTransition><Chat /></PageTransition>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <PageTransition><Profile /></PageTransition>
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      )}
    </>
  );
};

function App() {
  return (
    <ThemeProvider>
      <LoadingProvider>
        <SmoothScroll>
          <AppContent />
        </SmoothScroll>
      </LoadingProvider>
    </ThemeProvider>
  );
}



export default App;
