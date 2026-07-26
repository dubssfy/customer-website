import React, { useRef, useEffect, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./TestimonialsSection.css";

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
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          speed={1200}
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
