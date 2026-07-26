import React from "react";
import "./Footer.css";
import {
  MapPin,
  Phone,
  Mail,
  Clock3,
  ArrowRight,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";
import { Link } from "react-router-dom";


const Footer = () => {
  return (
    <footer className="footer">

      {/* Top Wave */}
      <div className="footer-wave">
  <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
    <path
      className="footer-wave-path"
      fill="#ffffff"
      d="M0,64L60,69.3C120,75,240,85,360,74.7C480,64,600,32,720,37.3C840,43,960,85,1080,90.7C1200,96,1320,64,1380,48L1440,32V120H0Z"
    />
  </svg>

  <div className="footer-wave-text">
    HIGH SCALE | HIGH SPEED | SMART TECHNOLOGY
  </div>
</div>

      <div className="footer-container">

        {/* LEFT SECTION */}
        <div className="footer-about">

          <h2 className="footer-logo">
            Swachham
          </h2>

          <p>
            Premium Laundry & Dry Cleaning Service offering
            doorstep pickup and delivery. We care for your
            clothes with modern equipment and eco-friendly
            cleaning methods.
          </p>

          <div className="footer-contact">

            <div>
              <MapPin size={18} />
              <span> Dapoli, Maharashtra</span>
            </div>

            <div>
              <Phone size={18} />
              <span>+91  9684029991</span>
            </div>

            <div>
              <Mail size={18} />
              <span>info@swachham.co.in</span>
            </div>

            <div>
              <Clock3 size={18} />
              <span>Tue - Sun : 8:00 AM - 6:00 PM</span>
            </div>

          </div>

        </div>

        {/* COMPANY */}
        <div className="footer-links">

          <h3>Company</h3>

          <Link to="/">Home</Link>
          <Link to="/about">Testimonials</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/features">Features</Link>
          <Link to="/contact">Contact</Link>

        </div>

        {/* SERVICES */}
        <div className="footer-links">

          <h3>Services</h3>

          <Link to="/features">
            Wash & Fold
          </Link>

          <Link to="/features">
            Dry Cleaning
          </Link>

          <Link to="/features">
            Commercial Laundry
          </Link>

          <Link to="/features">
            Self Service
          </Link>

          <Link to="/features">
            Express Laundry
          </Link>

        </div>

        {/* DOWNLOAD APP */}
        <div className="footer-app">

          <h3>Download Our App</h3>

          <p>
            Book pickups, track orders and make payments
            directly from the Swachham App.
          </p>

          <div className="store-buttons">

            <a href="/">
              <img
                src="/playstore.png"
                alt="Google Play"
              />
            </a>

            <a href="/">
              <img
                src="/appstore.png"
                alt="App Store"
              />
            </a>

          </div>

          <button className="download-btn">
            Download Now
            <ArrowRight size={18} />
          </button>

        </div>

      </div>

      {/* Bottom */}

      <div className="footer-bottom">

        <div className="footer-social">

          <a href="https://www.facebook.com/profile.php?id=61588347518668">
            <FaFacebookF size={20} />
          </a>

          <a href="https://www.instagram.com/swachham.laundering/">
            <FaInstagram size={20} />
          </a>

          <a href="https://wa.me/919684029991">
            <FaWhatsapp size={20} />
          </a>

        </div>

        <p>
          © {new Date().getFullYear()} Swachham.
          All Rights Reserved.
        </p>

        <div className="footer-policy">

          <Link to="/">Privacy Policy</Link>

          <Link to="/">Terms & Conditions</Link>

        </div>

      </div>

    </footer>
  );
};

export default Footer;