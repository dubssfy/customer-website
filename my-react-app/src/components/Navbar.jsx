import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaRegClock, FaPhoneAlt } from "react-icons/fa";
import { Menu, X } from "lucide-react";
import "./Navbar.css";

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [animateRing, setAnimateRing] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu and trigger logo animation on route change
  useEffect(() => {
    setIsMobileOpen(false);
    
    // Trigger logo ring animation
    setAnimateRing(true);
    const timer = setTimeout(() => {
      setAnimateRing(false);
    }, 1400);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/Features", label: "Features" },
    { to: "/Pricing", label: "Pricing" },
    { to: "/about", label: "Testimonials" },
    { to: "/Aboutnew", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <nav className={`navbar ${isScrolled ? "navbar-scrolled" : ""}`}>
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <div className="logo-container">
            <div className={`logo-ring-wrapper ${animateRing ? "animate-ring" : ""}`}>
              <svg className="logo-ring-svg" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2563EB" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="44" className="logo-ring-track" />
                <circle cx="50" cy="50" r="44" className="logo-ring-circle" />
              </svg>
              <img src="/logo-mark.png" alt="Swaccham Logo Mark" className="navbar-logo-mark" />
            </div>
            <img src="/logo-text.png" alt="Swaccham" className="navbar-logo-text" />
          </div>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggle"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label="Toggle menu"
        >
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navigation Links */}
        <div className={`navbar-menu ${isMobileOpen ? "navbar-menu-open" : ""}`}>
          <div className="navbar-links">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`navbar-link ${location.pathname === link.to ? "navbar-link-active" : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="navbar-info">
            {/* Clock */}
            <div className="info-item">
              <div className="icon clock-icon">
                <FaRegClock />
              </div>
              <div className="text">
                <span>8:00-18:00</span>
                <small>Tue-Sun</small>
              </div>
            </div>

            {/* Phone */}
            <div className="info-item">
              <div className="icon phone-icon">
                <FaPhoneAlt />
              </div>
              <div className="text">
                <span>+91 96840299 90/91/92</span>
              </div>
            </div>

            {/* Book Now Button */}
            <Link to="/book-now" className="book-now-btn">
              Book Now
              <span className="arrow-icon">↗</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;