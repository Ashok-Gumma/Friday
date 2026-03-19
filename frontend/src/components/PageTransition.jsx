import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const PageTransition = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Start loader on route change
    setLoading(true);
    
    // Smooth transition timeout
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800); // 800ms loading effect

    return () => clearTimeout(timer);
  }, [location.pathname]); // Re-trigger on path change

  return (
    <>
      {loading ? (
        <div className="global-loader">
          <div className="loader-ring" />
          <div className="loader-text">AS YOU WISH</div>
        </div>
      ) : null}
      
      <div className={`page-content ${loading ? 'hidden' : 'visible'}`}>
        {!loading && children}
      </div>
    </>
  );
};

export default PageTransition;
