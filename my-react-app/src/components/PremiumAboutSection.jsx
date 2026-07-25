import React from "react";
import { motion } from "framer-motion";
import { Users, Shirt, ThumbsUp, Clock } from "lucide-react";
import "./PremiumAboutSection.css";

const Counter = ({ target, label, icon, delay }) => {
  return (
    <motion.div 
      className="animated-counter-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6, delay: delay }}
    >
      <div className="counter-icon">{icon}</div>
      <div className="counter-content">
        <h3>{target}</h3>
        <p>{label}</p>
      </div>
    </motion.div>
  );
};

export default function PremiumAboutSection() {
  return (
    <section className="premium-about-section">
      <div className="about-split-container">
        
        {/* Left Side: Visuals */}
        <div className="about-visuals">
          <motion.div 
            className="about-image-wrapper"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1 }}
          >
            <div className="soap-bubbles">
              <div className="bubble b1"></div>
              <div className="bubble b2"></div>
              <div className="bubble b3"></div>
              <div className="bubble b4"></div>
              <div className="bubble b5"></div>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1545601445-4d6a0a058631?w=800&q=80" 
              alt="Industrial Laundry Facility" 
              className="about-main-img"
            />
            <div className="glass-badge">
              <span className="badge-year">10+</span>
              <span className="badge-text">Years of<br/>Excellence</span>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Content */}
        <div className="about-content-wrapper">
          <motion.div 
            className="about-text-content"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1 }}
          >
            <h4 className="section-subtitle">ABOUT SWACHHAM</h4>
            <h2 className="section-title">Setting the Benchmark in <span>Industrial Laundry</span></h2>
            <p className="section-desc">
              At Swachham, we don’t just wash clothes; we engineer cleanliness. Utilizing cutting-edge automated machinery and eco-friendly practices, we deliver unmatched hygiene, speed, and reliability to businesses across Konkan.
            </p>
            
            <div className="counters-grid">
              <Counter target="10,000+" label="Garments Washed/Day" icon={<Shirt />} delay={0.1} />
              <Counter target="500+" label="Happy Clients" icon={<Users />} delay={0.2} />
              <Counter target="99%" label="Customer Satisfaction" icon={<ThumbsUp />} delay={0.3} />
              <Counter target="24-Hour" label="Fast Turnaround" icon={<Clock />} delay={0.4} />
            </div>

          </motion.div>
        </div>
        
      </div>
    </section>
  );
}
