import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import { 
  Leaf, Settings, ShieldCheck, Star, Clock, HeartHandshake, 
  Building2, Hotel, Utensils, GraduationCap, Briefcase, 
  CheckCircle, ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import "swiper/css";
import "swiper/css/effect-fade";
import "./StoryPresentation.css";

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const processSteps = [
  "Collection", "Barcode & Sorting", "Stain Treatment", 
  "Automated Washing", "Controlled Drying", "Professional Finishing", 
  "Quality Inspection", "Hygienic Packing", "Safe Delivery"
];

export default function StoryPresentation({ onComplete }) {
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Parallax effect for bubbles/shapes
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  const handleEnter = () => {
    if (onComplete) {
      onComplete();
    } else {
      navigate("/");
    }
  };

  return (
    <div className="story-presentation" ref={containerRef}>
      <motion.div 
        className="story-parallax-bg"
        style={{ y: backgroundY }}
      />
      
      {/* 1. OUR STORY WITH CAROUSEL */}
      <section className="story-section story-hero-section">
        {/* Background Carousel Behind Our Story */}
        <div className="story-bg-carousel">
          <Swiper
            modules={[Autoplay, EffectFade]}
            effect="fade"
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            loop={true}
            allowTouchMove={false}
            className="story-swiper"
          >
            <SwiperSlide>
              <div className="story-slide-img" style={{ backgroundImage: "url('/laundry1.jpg')" }}></div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="story-slide-img" style={{ backgroundImage: "url('/laundry2.jpg')" }}></div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="story-slide-img" style={{ backgroundImage: "url('/laundry3.jpg')" }}></div>
            </SwiperSlide>
          </Swiper>
          <div className="story-bg-overlay"></div>
        </div>

        <div className="container relative z-10 min-h-screen flex-center" style={{ paddingTop: '100px' }}>
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="section-header"
          >
            <h2>OUR STORY</h2>
            <p className="subtitle">From Tradition to Technology</p>
          </motion.div>

          <motion.div 
            className="story-grid"
            variants={staggerContainer}
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}
          >
            <motion.div className="glass-card story-card" variants={fadeInUp}>
              <div className="card-icon"><Clock /></div>
              <h3>The Traditional Past</h3>
              <p>Laundry has always been an essential part of everyday life. Traditionally performed using manual labour, it served the basic needs of the community.</p>
            </motion.div>

            <motion.div className="glass-card story-card" variants={fadeInUp}>
              <div className="card-icon"><Building2 /></div>
              <h3>The Rising Demand</h3>
              <p>As tourism and commercial development surged, the demand for hygienic, high-speed, and consistent laundry services skyrocketed.</p>
            </motion.div>

            <motion.div className="glass-card story-card" variants={fadeInUp}>
              <div className="card-icon"><Settings /></div>
              <h3>The Transformation</h3>
              <p>Detailed market research inspired a technology-driven transformation. Swachham now operates a fully automated, high-capacity industrial laundry.</p>
            </motion.div>

            <motion.div className="glass-card story-card" variants={fadeInUp}>
              <div className="card-icon"><ShieldCheck /></div>
              <h3>The Modern Standard</h3>
              <p>Every garment is handled with precision. We combine traditional values with modern technology to deliver absolute cleanliness and trust.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Decorative Curvy Line for transition */}
      <div className="story-divider-line"></div>

      {/* 2 & 3. MISSION & VISION */}
      <section className="story-section mission-vision-section">
        <div className="container">
          <div className="mv-grid">
            <motion.div 
              className="light-glass-card premium-mv-card"
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            >
              <div className="mv-icon"><Star className="text-gold" /></div>
              <h2>Our Mission</h2>
              <p>To transform laundry services through innovation, automation, operational excellence, environmentally responsible processes, reliability, hygiene, quality, and cost-effective solutions for businesses.</p>
            </motion.div>

            <motion.div 
              className="light-glass-card premium-mv-card"
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            >
              <div className="mv-icon"><Leaf className="text-green" /></div>
              <h2>Our Vision</h2>
              <p>To become Konkan's most trusted and technologically advanced industrial laundry partner by setting new benchmarks in hygiene, sustainability, innovation, quality, customer satisfaction, and operational excellence.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. OUR PROMISE */}
      <section className="story-section promise-section flex-center">
        <motion.div 
          className="promise-container"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="promise-quote">
            "Every Fabric Deserves Professional Care. <br/> Every Customer Deserves Complete Trust."
          </h2>
        </motion.div>
      </section>

      {/* 5. CORE VALUES */}
      <section className="story-section core-values-section">
        <div className="container">
          <motion.div className="section-header" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <h2>WHY SWACHHAM</h2>
            <div className="header-line"></div>
          </motion.div>
          
          <motion.div className="values-grid" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
            {['Trust', 'Quality', 'Hygiene', 'Innovation', 'Commitment', 'Professional Care'].map((value, i) => (
              <motion.div key={i} className="light-glass-card value-card" variants={fadeInUp} whileHover={{ y: -10, scale: 1.02 }}>
                <CheckCircle className="value-icon" />
                <h3>{value}</h3>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 6. INDUSTRIES WE SERVE */}
      <section className="story-section industries-section">
        <div className="container">
          <motion.div className="section-header" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <h2>INDUSTRIES WE SERVE</h2>
          </motion.div>
          
          <motion.div className="industries-grid" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
            {[
              { name: "Luxury Hotels", icon: <Hotel /> },
              { name: "Restaurants", icon: <Utensils /> },
              { name: "Educational Inst.", icon: <GraduationCap /> },
              { name: "Corporate Offices", icon: <Briefcase /> },
              { name: "Spa & Wellness", icon: <HeartHandshake /> }
            ].map((industry, i) => (
              <motion.div key={i} className="industry-card" variants={fadeInUp} whileHover={{ scale: 1.05 }}>
                <div className="ind-icon">{industry.icon}</div>
                <h4>{industry.name}</h4>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 7. OUR PROCESS - Horizontal Scroll Timeline (CSS-based, no GSAP pin) */}
      <section className="story-section process-section">
        <div className="container">
          <motion.div className="section-header" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <h2>OUR PROCESS</h2>
            <div className="header-line"></div>
          </motion.div>
        </div>
        <div className="process-scroll-track">
          {processSteps.map((step, i) => (
            <motion.div 
              key={i} 
              className="process-step-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="process-step-number">{String(i + 1).padStart(2, '0')}</div>
              <div className="process-step-dot"></div>
              <h3>{step}</h3>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 8. CTA */}
      <section className="story-section cta-section flex-center">
        <motion.div 
          className="cta-content"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2>Experience the Swachham Difference</h2>
          <button className="luxury-enter-btn" onClick={handleEnter}>
            <span>Welcome To Swachham</span>
            <ArrowRight className="btn-icon" />
          </button>
        </motion.div>
      </section>
    </div>
  );
}
