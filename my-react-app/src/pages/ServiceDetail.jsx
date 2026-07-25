import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, ShieldCheck, CheckCircle2, Leaf, Sparkles } from "lucide-react";
import FloatingBubbles from "../components/FloatingBubbles";
import "./ServiceDetail.css";

const servicesData = {
  "dry-cleaning": {
    title: "Premium Dry Cleaning",
    tagline: "Gentle, non-toxic care for your finest garments",
    icon: "👔",
    theme: "theme-blue",
    description: "Our premium dry cleaning service uses advanced eco-friendly solvents to protect delicate fibers, preserve colors, and maintain fabric structure. We inspect and pre-treat all spots, perform deep gentle cleaning, and hand-finish your garments to immaculate perfection. Ideal for suits, silk sarees, designer wear, lehengas, and woolens.",
    features: [
      "100% Eco-Friendly & Non-Toxic Solvents",
      "Specialized Pre-treatment for Spots & Stains",
      "Delicate Fabric Care (Silk, Wool, Lace, Embroidery)",
      "Premium Hanger Packaging with Protective Covers"
    ],
    careInstructions: "Store dry-cleaned clothes in breathable cotton garment bags instead of plastic to allow fabrics to breathe. Hang immediately upon receipt.",
    turnaround: "3 - 4 Days",
    originalServiceKey: "Dry Cleaning"
  },
  "wash-only": {
    title: "Wash & Tumble Dry",
    tagline: "Clean, fresh, and perfectly folded everyday casuals",
    icon: "🧥",
    theme: "theme-teal",
    description: "Our standard wash & fold service is perfect for shirts, jeans, activewear, towels, and bedsheets. We wash your clothes in dedicated individual machines (never mixed with other customers) using premium detergents, tumble dry them to soft perfection, and fold them neatly so they are ready to go back into your wardrobe.",
    features: [
      "Individual Machine Loads for Absolute Hygiene",
      "Premium Bio-detergents & Sanitizing Fabric Softeners",
      "Color Sorting & Custom Water Temperature Control",
      "Expert Fold & Tidy Packaging"
    ],
    careInstructions: "To maintain color brightness, wash whites and colored clothes separately. Wash activewear in cool water to prevent elastic breakdown.",
    turnaround: "24 - 48 Hours",
    originalServiceKey: "Wash Only"
  },
  "wash-iron": {
    title: "Wash & Iron Service",
    tagline: "The complete laundry solution with professional press",
    icon: "🧺",
    theme: "theme-orange",
    description: "Why spend your weekends laundering and ironing? Swaccham takes care of the entire cycle. We wash your everyday or formal wear, dry them carefully, and iron them with professional steam tables for that crisp, clean, ready-to-wear look. Perfect for office wear, uniforms, shirts, and trousers.",
    features: [
      "Deep Clean Washing with Softener Treatment",
      "Wrinkle-Free Steam Ironing for Sharp Looks",
      "Cuff, Collar, and Crease Perfection",
      "Delivered on Hangers or Neatly Packaged"
    ],
    careInstructions: "Fasten all buttons and zip up zippers before sending your clothes for washing to avoid fabric snags and maintain shirt structure.",
    turnaround: "48 Hours",
    originalServiceKey: "Wash & Iron"
  },
  "steam-iron": {
    title: "Professional Steam Pressing",
    tagline: "Crease-free perfection with fabric sanitization",
    icon: "♨️",
    theme: "theme-amber",
    description: "Ensure your clothes look crisp and fresh without the risk of shine marks or burn damage. Our vertical steam iron tables sanitize fabrics, remove stubborn creases, and restore the natural drape of wool, linen, cotton, and delicate synthetics. It's the ultimate refresh for lightly worn clothes.",
    features: [
      "High-pressure Vertical Steam Ironing",
      "No Fabric Shine or Heat Burns (Safe for delicate synthetics)",
      "Kills 99.9% of Fabric Bacteria through heat steam",
      "Immediate placement on hangers to preserve shape"
    ],
    careInstructions: "Hang steamed garments in an open space for 15-20 minutes before placing them in the wardrobe to allow residual moisture to evaporate.",
    turnaround: "24 Hours",
    originalServiceKey: "Steam Iron"
  },
  "on-time-delivery": {
    title: "On-Time Doorstep Delivery",
    tagline: "Free pickup and delivery exactly when you need it",
    icon: "🟢",
    theme: "theme-green",
    description: "We understand that time is valuable. Swaccham offers a highly reliable doorstep laundry logistics network. Schedule a convenient slot, and our agent will collect your garments. Once clean, we deliver them back sanitized and crisp right to your door. We commit to a strict on-time delivery schedule.",
    features: [
      "Convenient Doorstep Pickup & Delivery Slots",
      "Real-time Booking & Notification Updates",
      "Special Weatherproof Packaging for Transit Care",
      "Super Express (Same-Day) Service available on request"
    ],
    careInstructions: "Group your clothes and make a quick checklist. Let our representative know about any specific stains or instructions during the pickup.",
    turnaround: "As Scheduled",
    originalServiceKey: "Wash & Iron"
  }
};

export default function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const service = servicesData[id];

  if (!service) {
    return (
      <div className="service-error-container">
        <h2>Service Not Found</h2>
        <p>The requested service information does not exist.</p>
        <button onClick={() => navigate("/")} className="back-home-btn">
          Go Back Home
        </button>
      </div>
    );
  }

  const handleBookNow = () => {
    navigate("/book-now", {
      state: { preselectedService: service.originalServiceKey }
    });
  };

  return (
    <div className={`service-detail-page ${service.theme}`}>
      <FloatingBubbles />
      
      <div className="service-detail-container">
        {/* Back Button */}
        <button className="back-link-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Back to Home
        </button>

        {/* Hero Section */}
        <header className="service-hero">
          <div className="service-hero-icon">{service.icon}</div>
          <div className="service-hero-text">
            <span className="badge">Premium Service Info</span>
            <h1>{service.title}</h1>
            <p className="tagline">{service.tagline}</p>
          </div>
        </header>

        {/* Content Layout */}
        <div className="service-grid-layout">
          {/* Main Info */}
          <div className="main-info-card">
            <h2>Overview</h2>
            <p className="description-text">{service.description}</p>

            <div className="key-benefits">
              <h3>Key Service Benefits</h3>
              <div className="benefits-grid">
                {service.features.map((feature, idx) => (
                  <div key={idx} className="benefit-item">
                    <CheckCircle2 className="benefit-icon" size={20} />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Info Sidebar */}
          <div className="sidebar-info-card">
            <div className="sidebar-item">
              <Clock className="sidebar-icon" size={24} />
              <div>
                <h4>Average Turnaround</h4>
                <p>{service.turnaround}</p>
              </div>
            </div>

            <div className="sidebar-item">
              <ShieldCheck className="sidebar-icon" size={24} />
              <div>
                <h4>Quality Assurance</h4>
                <p>100% Satisfaction Guarantee</p>
              </div>
            </div>

            <div className="sidebar-item">
              <Leaf className="sidebar-icon" size={24} />
              <div>
                <h4>Eco-Conscious</h4>
                <p>Safe, green solvents used</p>
              </div>
            </div>

            <div className="care-tips-box">
              <div className="care-tips-title">
                <Sparkles size={16} />
                <span>Expert Care Tip</span>
              </div>
              <p>{service.careInstructions}</p>
            </div>

            <button className="service-book-btn" onClick={handleBookNow}>
              Book This Service Now ⚡
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
