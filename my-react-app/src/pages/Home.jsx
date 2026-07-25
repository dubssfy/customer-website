import React, { useState, useEffect, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import { X, Check, Calendar, Droplets, Wind, Sparkles, Truck, Shirt, Star, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import "./Home.css";

// New Components
import IntroSequence from "../components/IntroSequence";
import StoryPresentation from "../components/StoryPresentation";
import PremiumAboutSection from "../components/PremiumAboutSection";
import MachineServiceCard from "../components/MachineServiceCard";

const slides = [
  {
    id: "wash-only",
    image:
      "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=800&q=80",
    title: "Wash, Dry & Fold",
    description:
      "Swaccham Laundry provides premium washing, drying and folding services with utmost care.",
    longDesc: "Our professional laundry process cleans, sanitizes, and neatly folds your everyday wear, activewear, and bedsheets. We use high-efficiency washers, temperature-controlled drying, and hypoallergenic detergents to keep your fabric feeling fresh, soft, and comfortable.",
    benefits: ["Individual laundry wash loads", "Sanitized and clean machines", "Neatly packaged & folded", "Scented fabric softener option"]
  },
  {
    id: "dry-cleaning",
    image:
      "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=800&q=80",
    title: "Premium Dry Cleaning",
    description:
      "Professional dry cleaning for delicate garments with advanced cleaning technology.",
    longDesc: "Keep your suits, silk garments, and ethnic wear in pristine condition. Our dry cleaning process handles delicate embroidery, wool, and linen with specialized solvents that remove stubborn stains and grease without deteriorating or shrinking the fabric.",
    benefits: ["Eco-friendly organic solvents", "Expert inspection & stain removal", "Premium vertical steam pressing", "Delivered on custom hangers"]
  },
  {
    id: "on-time-delivery",
    image:
      "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=800&q=80",
    title: "Doorstep Pickup & Delivery",
    description:
      "Schedule your pickup and we'll collect, clean and deliver your clothes on time.",
    longDesc: "Save your valuable weekends. Our delivery crew collects your laundry directly from your doorstep and returns it clean and crisp in 24 to 48 hours. Choose your own convenient time slots and track your order online.",
    benefits: ["Free contact-free home pickup", "Express 24-hour turnaround", "Secure transit protective bags", "Reliable delivery schedules"]
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);
  
  // viewState can be 'intro', 'story', or 'home'
  const [viewState, setViewState] = useState("home"); 

  // Generate floating bubbles once
  const homeBubbles = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      size: `${Math.random() * 50 + 20}px`,
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 10 + 8}s`,
      animationDelay: `${Math.random() * 5}s`,
    }));
  }, []);

  useEffect(() => {
    // Check if the user has already seen the intro in this session
    const hasSeenIntro = sessionStorage.getItem("swachham_intro_seen");
    if (!hasSeenIntro) {
      setViewState("intro");
    }
  }, []);

  const handleIntroComplete = () => {
    setViewState("story");
  };

  const handleStoryComplete = () => {
    sessionStorage.setItem("swachham_intro_seen", "true");
    setViewState("home");
    // Scroll to top when entering home
    window.scrollTo(0, 0);
  };

  const openModal = (slide) => {
    setActiveModal(slide);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  if (viewState === "intro") {
    return <IntroSequence onComplete={handleIntroComplete} />;
  }

  if (viewState === "story") {
    return <StoryPresentation onComplete={handleStoryComplete} />;
  }

  // viewState === "home"
  return (
    <motion.div 
      className="home-page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Floating Bubbles Background */}
      <div className="home-floating-bubbles">
        {homeBubbles.map((b) => (
          <div
            key={`hb-${b.id}`}
            className="home-bubble"
            style={{
              width: b.size,
              height: b.size,
              left: b.left,
              animationDuration: b.animationDuration,
              animationDelay: b.animationDelay,
            }}
          ></div>
        ))}
      </div>

      {/* Existing Hero Swiper */}
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        navigation
        pagination={{ clickable: true }}
        //autoplay={{ delay: 4500, pauseOnMouseEnter: true }}
        autoplay={{
  delay: 3000,
  disableOnInteraction: false,
  pauseOnMouseEnter: false,
}}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop={true}
        className="heroSwiper"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className="hero"
              style={{
                backgroundImage: `url(${slide.image})`,
              }}
            >
              <div className="overlay"></div>

              <div className="content">
                <h1>{slide.title}</h1>

                <p>{slide.description}</p>

                <button onClick={() => openModal(slide)}>
                  Learn More
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Premium About Section */}
     {/* <PremiumAboutSection />

      {/* Video Section 
      <section className="home-video-section">
        <div className="video-section-header">
          <h2>Watch <span>Swachham</span> In Action</h2>
          <p>Experience our state-of-the-art industrial laundry facility</p>
        </div>
        <div className="video-wrapper">
          <video 
            controls 
            poster="/laundry1.jpg"
            preload="metadata"
          >
            <source src="/vid1.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="video-overlay-badge">
            <Play size={16} />
            <span>Facility Tour</span>
          </div>
        </div>
      </section>

      {/* Machine Service Cards */}
      <section className="machine-services-section">
        <div className="container">
          <div className="services-section-header">
            <h2>Our <span>Premium</span> Services</h2>
            <p>Select a service to explore our professional care</p>
          </div>
          <div className="machine-services-grid">
            <MachineServiceCard 
              id="dry-cleaning" title="Dry Cleaning" icon={<Sparkles size={28}/>} color="blue" 
            />
            <MachineServiceCard 
              id="wash-only" title="Wash Only" icon={<Droplets size={28}/>} color="green" 
            />
            <MachineServiceCard 
              id="wash-iron" title="Wash & Iron" icon={<Shirt size={28}/>} color="orange" 
            />
            <MachineServiceCard 
              id="steam-iron" title="Steam Iron" icon={<Wind size={28}/>} color="yellow" 
            />
            <MachineServiceCard 
              id="on-time-delivery" title="Pickup & Delivery" icon={<Truck size={28}/>} color="green" 
            />
            <MachineServiceCard 
              id="commercial" title="Commercial Linen" icon={<Star size={28}/>} color="blue" 
            />
          </div>
        </div>
      </section>

      {/* Beautiful Information Modal */}
      <AnimatePresence>
        {activeModal && (
          <motion.div 
            className="home-modal-overlay" 
            onClick={closeModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="home-modal-card animate-scale" 
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <button className="close-modal-btn" onClick={closeModal}>
                <X size={20} />
              </button>
              <div className="modal-header-banner" style={{ backgroundImage: `url(${activeModal.image})` }}>
                <div className="banner-overlay"></div>
                <h3>{activeModal.title}</h3>
              </div>
              <div className="modal-body-content">
                <p className="modal-long-desc">{activeModal.longDesc}</p>
                
                <div className="modal-benefits-section">
                  <h4>What's Included:</h4>
                  <ul className="modal-benefits-list">
                    {activeModal.benefits.map((benefit, i) => (
                      <li key={i}>
                        <Check className="benefit-check-icon" size={16} />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="modal-actions">
                  <button 
                    className="modal-action-btn primary" 
                    onClick={() => {
                      closeModal();
                      navigate("/book-now", { state: { preselectedService: activeModal.id === "dry-cleaning" ? "Dry Cleaning" : activeModal.id === "wash-only" ? "Wash Only" : "Wash & Iron" } });
                    }}
                  >
                    <Calendar size={18} />
                    Book Now
                  </button>
                  <button 
                    className="modal-action-btn secondary" 
                    onClick={() => {
                      closeModal();
                      navigate(`/service/${activeModal.id}`);
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}