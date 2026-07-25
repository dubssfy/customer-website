import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './GlobalLoader.css';

const GlobalLoader = () => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Initial load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Trigger on route change
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!isLoading) return null;

  return (
    <div className={`global-loader-overlay ${!isLoading ? 'fade-out' : ''}`}>
      <div className="loader-content">
        <div className="spinner-ring"></div>
        <div className="spinner-ring-2"></div>
        <img src="/logo-mark.png" alt="Swaccham Logo" className="loader-logo" />
      </div>
    </div>
  );
};

export default GlobalLoader;
