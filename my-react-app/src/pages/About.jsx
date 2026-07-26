/*import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Award, Target, Compass, Users } from "lucide-react";
import TestimonialsSection from "../components/TestimonialsSection";
import "./About.css";*/

{/*export default function About() {
  const [activeProfile, setActiveProfile] = useState(null);

  const profilesData = {
    founder: {
      name: "Siddharth Shinde",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
      bio: "Siddharth founded Swaccham Laundry with a vision to revolutionize the laundry and fabric-care sector. With over 8 years of experience in hospitality operations, he is passionate about customer satisfaction, service delivery efficiency, and bringing advanced European laundry systems to Maharashtra.",
      expertise: "Business Strategy, Operations Management, Customer Success"
    },
    cofounder: {
      name: "Pooja Patil",
      role: "Co-Founder & CTO",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
      bio: "Pooja leads the technology and chemical sciences division. With a solid background in chemical engineering, she oversaw the deployment of our eco-friendly bio-wash systems, water recycling units, and computerized inventory software. She ensures that Swaccham remains gentle on clothes and the environment.",
      expertise: "Textile Chemistry, Smart Logistics, Sustainable Tech"
    }
  };

  return (
    <div className="about-page-wrapper">
      {/* 1. Redesigned Testimonials Section at the Top */}
      <TestimonialsSection />

      {/* 2. Redesigned About Us Details 
      <section className="story-section">
        <div className="story-container">
          {/* Main Info Card 
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="story-card"
          >
            <div className="story-header">
              <span>Our Story</span>
              <h2>About Swaccham Laundry</h2>
              <div className="story-line"></div>
            </div>

            <p className="story-text">
              Swaccham Laundry is dedicated to providing premium laundry and dry-cleaning services with modern technology and excellent customer care. We ensure every garment is cleaned, pressed, and delivered with the highest quality standards.
            </p>

            <hr className="divider" />

            {/* Mission & Vision cards 
            <div className="mission-vision-grid">
              <motion.div 
                whileHover={{ y: -5 }}
                className="mission-card"
              >
                <div className="card-icon-box">
                  <Target size={22} />
                </div>
                <h3 className="card-title">Our Mission</h3>
                <p className="card-desc">
                  To provide fast, affordable, hygienic, and reliable laundry services while ensuring complete customer satisfaction at every doorstep.
                </p>
              </motion.div>

              <motion.div 
                whileHover={{ y: -5 }}
                className="vision-card"
              >
                <div className="card-icon-box">
                  <Compass size={22} />
                </div>
                <h3 className="card-title">Our Vision</h3>
                <p className="card-desc">
                  To become the most trusted and innovative laundry service provider by combining smart cloud logistics with eco-safe fabric sciences.
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Team Section 
          <div className="leadership-header">
            <span>Leadership</span>
            <h2>Meet Our Team</h2>
            <div className="story-line"></div>
          </div>

          <div className="team-grid">
            {/* Founder Card 
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="team-card"
            >
              <div className="team-avatar-wrapper">
                <img
                  src={profilesData.founder.image}
                  alt={profilesData.founder.name}
                  className="team-avatar founder-avatar"
                />
              </div>

              <h3 className="team-name">
                {profilesData.founder.name}
              </h3>

              <p className="team-role">
                {profilesData.founder.role}
              </p>

              <button
                className="team-btn"
                onClick={() => setActiveProfile(profilesData.founder)}
              >
                View Profile
              </button>
            </motion.div>

            {/* Co-founder Card 
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="team-card"
            >
              <div className="team-avatar-wrapper">
                <img
                  src={profilesData.cofounder.image}
                  alt={profilesData.cofounder.name}
                  className="team-avatar cofounder-avatar"
                />
              </div>

              <h3 className="team-name">
                {profilesData.cofounder.name}
              </h3>

              <p className="team-role">
                {profilesData.cofounder.role}
              </p>

              <button
                className="team-btn"
                onClick={() => setActiveProfile(profilesData.cofounder)}
              >
                View Profile
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Leadership Profile Modal *
      <AnimatePresence>
        {activeProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="profile-modal-overlay"
            onClick={() => setActiveProfile(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="profile-modal-card"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="close-profile-btn"
                onClick={() => setActiveProfile(null)}
              >
                <X size={18} />
              </button>

              <img
                src={activeProfile.image}
                alt={activeProfile.name}
                className="modal-avatar"
              />

              <h3 className="modal-title">
                {activeProfile.name}
              </h3>
              
              <p className="modal-role">
                {activeProfile.role}
              </p>

              <div style={{ textAlign: "left", marginBottom: "24px" }}>
                <h4 className="modal-bio-title">
                  Biography
                </h4>
                <p className="modal-bio">
                  {activeProfile.bio}
                </p>
              </div>

              <div className="modal-expertise-box">
                <h4 className="modal-expertise-title">
                  Key Expertise
                </h4>
                <p className="modal-expertise">
                  {activeProfile.expertise}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}*/}
import React, { useRef, useEffect, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./About.css";

const reviews = [
  {
    name: "Rahul Mandlik",
    role: "Our Customer",
   // image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&q=80",
    rating: 5,
    text: "I absolutely really so loved how spotless, fresh and neatly packed my blankets and curtains came back. No dust, no dullness, and colours stayed safe like new. Swaccham made my home care premium, and I'm definitely sticking with them."
  },
  {
    name: "Satish KOkane",
    role: "Our Customer",
    //image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&q=80",
    rating: 5,
    text: "I sent my sneakers and leather shoes to Swaccham and they came back beautifully cleaned, fresh, well-shaped, and neatly packed. Colour and texture stayed safe like new. Finally found a premium service that truly takes real footwear care seriously."
  },
  {
    name: "Atul Kulkarni",
    role: "Our Customer",
    //image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&q=80",
    rating: 5,
    text: "The curtains and sofa covers I sent were returned spotless, neatly packed, and smelling wonderfully fresh. Dust and dullness vanished without harming fabric colour or texture. Swaccham made my home feel brighter, cleaner, refreshed with real care!"
  },
  {
    name: "Sayali Fadake",
    role: "Our Customer",
   // image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&q=80",
    rating: 5,
    text: "Swaccham's premium dry cleaning is unmatched! My wedding lehenga came back looking brand new with all the intricate embroidery perfectly intact. The doorstep pickup was right on time and very professional."
  },
  {
    name: "Aditya Kale",
    role: "Our Customer",
    //image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&q=80",
    rating: 5,
    text: "I use their wash and iron service weekly for my office wear. Crisp creases, clean scent, and very affordable prices. Their delivery staff is extremely polite, punctual, and helpful."
  }
];

export default function TestimonialsSection() {
  // Refs for touch-pause logic
  const swiperRef = useRef(null);
  const resumeTimerRef = useRef(null);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) {
        clearTimeout(resumeTimerRef.current);
      }
    };
  }, []);

  // When user starts touching/dragging — pause autoplay immediately
  const handleTouchStart = useCallback(() => {
    // Clear any pending resume timer
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
    const swiper = swiperRef.current;
    if (swiper && swiper.autoplay && !swiper.destroyed) {
      swiper.autoplay.stop();
    }
  }, []);

  // When user finishes touching/dragging — resume after 2.5s delay
  const handleTouchEnd = useCallback(() => {
    // Clear any existing timer first
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
    }
    resumeTimerRef.current = setTimeout(() => {
      const swiper = swiperRef.current;
      if (swiper && swiper.autoplay && !swiper.destroyed) {
        swiper.autoplay.start();
      }
      resumeTimerRef.current = null;
    }, 2500);
  }, []);

  return (
    <section className="testimonials-section">
      <div className="testimonials-container">
        <div className="section-header text-center">
          <span className="sub-title">Happy Clients</span>
          <h2>Our clients praise us for <span>great service</span></h2>
          <div className="header-line"></div>
        </div>

        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          spaceBetween={30}
          slidesPerView={3}
          loop={true}
          autoplay={{
            delay: 6000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          speed={1500}
          pagination={{
            clickable: true,
            dynamicBullets: true
          }}
          navigation={true}
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 20
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 25
            },
            1100: {
              slidesPerView: 3,
              spaceBetween: 30
            }
          }}
          className="testimonials-swiper"
        >
          {reviews.map((review, index) => (
            <SwiperSlide key={index}>
              <motion.div 
                className="testimonial-card"
                whileHover={{ y: -8, scale: 1.01 }}
                transition={{ duration: 0.3 }}
              >
                {/* Accent line */}
                <div className="card-accent-line"></div>
                
                {/* Quote Icon */}
                <div className="quote-icon-wrapper">
                  <Quote size={20} fill="currentColor" />
                </div>

                {/* Rating stars */}
                <div className="rating-wrapper">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={16} className="star-icon fill-star" />
                  ))}
                </div>

                {/* Testimonial text */}
                <p className="testimonial-text">
                  "{review.text}"
                </p>

                {/* Author Info*/} 
                <div className="author-info">
                  <img 
                    src={review.image} 
                    alt={review.name} 
                    className="author-image"
                    loading="lazy"
                  />
                  <div className="author-meta">
                    <h4 className="author-name">{review.name}</h4>
                    <span className="author-role">{review.role}</span>
                  </div>
                </div> 
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
