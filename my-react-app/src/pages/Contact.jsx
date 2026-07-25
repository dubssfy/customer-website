import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Truck, Sparkles, ShieldCheck, Award, MessageSquare } from 'lucide-react';
import FloatingBubbles from '../components/FloatingBubbles';
import './contact.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
    consent: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const response = await fetch(`${apiBaseUrl}/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      setIsSubmitted(true);
      setFormData({
        name: "",
        phone: "",
        email: "",
        message: "",
        consent: false,
      });
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error(err);
    alert("Failed to send message");
  } finally {
    setIsSubmitting(false);
  }
};

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  const contactInfo = [
    {
      icon: <MapPin size={24} />,
      title: "Address",
      details: "MIDC Area, Dapoli, Maharashtra 415712",
      sub: "Doorstep Pickup across Dapoli region",
      color: "card-green"
    },
    {
      icon: <Phone size={24} />,
      title: "Phone",
      details: "+91 9684029990",
      sub: "+91 9684029991 / 92",
      color: "card-teal"
    },
    {
      icon: <Mail size={24} />,
      title: "Email",
      details: "support@swacchamlaundry.com",
      sub: "response within 2 hours",
      color: "card-emerald"
    },
    {
      icon: <Clock size={24} />,
      title: "Working Hours",
      details: "8:00 AM - 6:00 PM",
      sub: "Tue - Sun (Monday Closed)",
      color: "card-yellow"
    }
  ];

  return (
    <div className="contact-page-container">
      {/* Background Floating Bubbles */}
      <FloatingBubbles />

      {/* Hero Section */}
      <section className="contact-hero">
        <div className="contact-hero-content">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Contact Swaccham Laundry
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Experience premium fabric care with our doorstep pickup and delivery service. 
            Fill out the form below or reach out to us directly to book your convenience.
          </motion.p>
        </div>
        <motion.div 
          className="contact-hero-image"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <img 
            src="https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=800&q=80" 
            alt="Premium Laundry Clothes Basket" 
            loading="lazy"
          />
          <div className="image-overlay-glow"></div>
        </motion.div>
      </section>

      {/* Info Cards Grid */}
      <motion.section 
        className="contact-info-grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {contactInfo.map((info, idx) => (
          <motion.div 
            key={idx} 
            className={`info-card ${info.color}`}
            variants={itemVariants}
            whileHover={{ y: -8, scale: 1.02 }}
          >
            <div className="info-card-icon-wrapper">
              {info.icon}
            </div>
            <h3>{info.title}</h3>
            <p className="card-details">{info.details}</p>
            <p className="card-sub">{info.sub}</p>
          </motion.div>
        ))}
      </motion.section>

      {/* Form & Map Section */}
      <section className="form-map-section">
        {/* Contact Form Wrapper */}
        <motion.div 
          className="contact-form-wrapper"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2>Send Us a Message</h2>
          <p className="form-subtitle">Got questions? We'd love to hear from you.</p>

          {isSubmitted ? (
            <motion.div 
              className="form-success-message"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring" }}
            >
              <CheckCircle2 size={64} className="success-icon" />
              <h3>Thank You!</h3>
              <p>Your message has been sent successfully. Our team will get back to you shortly.</p>
              <button 
                onClick={() => setIsSubmitted(false)}
                className="success-reset-btn"
              >
                Send Another Message
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="input-group-grid">
                <div className="input-field-wrapper">
                  <label htmlFor="name">Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={formData.name}
                    onChange={handleChange}
                    required 
                    placeholder="Enter your name"
                  />
                </div>
                <div className="input-field-wrapper">
                  <label htmlFor="phone">Phone Number</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    value={formData.phone}
                    onChange={handleChange}
                    required 
                    placeholder="e.g. +91 9876543210"
                  />
                </div>
              </div>

              <div className="input-field-wrapper">
                <label htmlFor="email">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleChange}
                  required 
                  placeholder="name@example.com"
                />
              </div>

              <div className="input-field-wrapper">
                <label htmlFor="message">Your Message</label>
                <textarea 
                  id="message" 
                  name="message" 
                  rows="4" 
                  value={formData.message}
                  onChange={handleChange}
                  required 
                  placeholder="How can we help you today?"
                ></textarea>
              </div>

              <div className="consent-checkbox">
                <input 
                  type="checkbox" 
                  id="consent" 
                  name="consent" 
                  checked={formData.consent}
                  onChange={handleChange}
                  required 
                />
                <label htmlFor="consent">
                  I consent to processing my details according to the 
                  <a href="/privacy-policy" target="_blank" rel="noopener noreferrer"> Privacy Policy</a>.
                </label>
              </div>

              <motion.button 
                type="submit" 
                className="form-submit-btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="spinner"></span>
                ) : (
                  <>
                    <span>Send Message</span>
                    <Send size={18} />
                  </>
                )}
              </motion.button>
            </form>
          )}
        </motion.div>

        {/* Map Card */}
        <motion.div 
          className="contact-map-card"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="map-header">
            <MapPin size={20} className="map-pin-icon" />
            <div>
              <h3>Our Location</h3>
              <p>Visit our main processing facility</p>
            </div>
          </div>
          <div className="map-iframe-container">
            <iframe 
              //src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15250.77197178877!2d73.18182245!3d17.7588235!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be9e3ca15555555%3A0xe5ad4c2a4f47dfbb!2sMIDC%20Area%2C%20Dapoli%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
              src="https://maps.google.com/maps?q=17.744408181991393,73.19058058124888&z=17&output=embed"
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Swaccham Laundry Location Map"
            ></iframe>
          </div>
        </motion.div>
      </section>

      {/* Why Customers Love Swaccham Section */}
      <section className="why-swaccham-section">
        <div className="why-swaccham-container">
          {/* Left Side: Quality Image */}
          <motion.div 
            className="why-image-wrapper"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <img 
              src="https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=800&q=80" 
              alt="Professional Laundry Washing Machine and Folded Clothes" 
              loading="lazy"
            />
            <div className="floating-badge">
              <Award className="badge-icon" size={24} />
              <div>
                <h4>#1 Laundry</h4>
                <p>in Dapoli Region</p>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Content & Feature Cards */}
          <div className="why-content-wrapper">
            <motion.h2 
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Why Customers Love Swaccham
            </motion.h2>
            <motion.p 
              className="why-desc"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              We provide the highest quality fabrics care. With our streamlined process, ecological solvents, and convenience options, your satisfaction is guaranteed.
            </motion.p>

            <motion.div 
              className="why-features-list"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {/* Feature Cards */}
              <motion.div className="why-feature-card" variants={itemVariants} whileHover={{ x: 8 }}>
                <div className="feature-card-icon fb-pickup">
                  <Truck size={22} />
                </div>
                <div className="feature-card-text">
                  <h3>Doorstep Pickup</h3>
                  <p>Schedule a convenient slot, and our logistics team gathers and delivers clothes directly to your door.</p>
                </div>
              </motion.div>

              <motion.div className="why-feature-card" variants={itemVariants} whileHover={{ x: 8 }}>
                <div className="feature-card-icon fb-cleaning">
                  <Sparkles size={22} />
                </div>
                <div className="feature-card-text">
                  <h3>Professional Cleaning</h3>
                  <p>Individually inspected and treated using state-of-the-art machines and premium bio-wash solutions.</p>
                </div>
              </motion.div>

              <motion.div className="why-feature-card" variants={itemVariants} whileHover={{ x: 8 }}>
                <div className="feature-card-icon fb-pricing">
                  <span className="rupee-icon">₹</span>
                </div>
                <div className="feature-card-text">
                  <h3>Affordable Pricing</h3>
                  <p>Transparent charges per piece without hidden fees, and standard bulk discounts for everyday laundry.</p>
                </div>
              </motion.div>

              <motion.div className="why-feature-card" variants={itemVariants} whileHover={{ x: 8 }}>
                <div className="feature-card-icon fb-quality">
                  <ShieldCheck size={22} />
                </div>
                <div className="feature-card-text">
                  <h3>Premium Quality</h3>
                  <p>Soft touch, pleasant scent, eco-friendly fabric conditioners, and expert inspection at every step.</p>
                </div>
              </motion.div>

              <motion.div className="why-feature-card" variants={itemVariants} whileHover={{ x: 8 }}>
                <div className="feature-card-icon fb-delivery">
                  <Clock size={22} />
                </div>
                <div className="feature-card-text">
                  <h3>Quick Delivery</h3>
                  <p>Express 24-hour turnaround or standard 48-hour delivery. Prompt and reliable schedules.</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
