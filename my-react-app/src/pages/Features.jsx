import React, { useEffect, useRef } from 'react';
import FloatingBubbles from '../components/FloatingBubbles';
import { useNavigate } from 'react-router-dom';
import './Features.css';

const featuredServices = [
  {
    id: "wash-only",
    icon: "🧺",
    title: "Wash & Fold",
    subtitle: "Laundry Service",
    desc: "Professional washing, drying, and folding services. We handle your clothes with care using premium detergents and fabric softeners.",
    link: "/service/wash-only"
  },
  {
    id: "commercial",
    icon: "👔",
    title: "Commercial",
    subtitle: "Laundry Service",
    desc: "Bulk laundry solutions for hotels, restaurants, and businesses in Dapoli. Reliable service with quick turnaround times.",
    link: "/service/commercial"
  },
  {
    id: "dry-cleaning",
    icon: "👕",
    title: "Eco-Friendly",
    subtitle: "Dry Cleaning",
    desc: "Gentle dry cleaning using environmentally safe solvents. Perfect for delicate fabrics and special garments.",
    link: "/service/dry-cleaning"
  },
  {
    id: "Self-Service",
    icon: "🏪",
    title: "Express Service and Delivery",
    subtitle: "Laundry Service",
    desc: "Modern Express-service facility with high-efficiency washers and dryers. Available at our Jalgaon MIDC location.",
    link: "/contact"
  }
];

const steps = [
  {
    num: "01",
    title: "Sorting & Inspection",
    desc: "Checking garments' care label instructions. Segregation of garments as per fabric colors & type. Inspection of Spots & Stains.",
    icon: "🔍"
  },
  {
    num: "02",
    title: "Spot Treatment",
    desc: "Using specialized dry cleaning stain removal solutions for various kinds of stains and fabrics.",
    icon: "🧴"
  },
  {
    num: "03",
    title: "Dry Cleaning",
    desc: "Customized dry cleaning machines for different types of garments to ensure deep cleaning without damage.",
    icon: "🌀"
  },
  {
    num: "04",
    title: "Finishing",
    desc: "Special shirt finishing, dress finishing, and form finishing for coats & jackets using imported equipment.",
    icon: "✨"
  },
  {
    num: "05",
    title: "Quality Check",
    desc: "Final inspection by experts to ensure perfect quality and finishing before the packaging stage.",
    icon: "✅"
  },
  {
    num: "06",
    title: "Packaging",
    desc: "Premium packing as used by high street fashion labels. Individual hanger packing as per your instructions.",
    icon: "📦"
  }
];

const Features = () => {
  const cardsRef = useRef([]);
  const serviceCardsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.15 });

    cardsRef.current.forEach(card => {
      if (card) observer.observe(card);
    });
    
    serviceCardsRef.current.forEach(card => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="features-page">
      <div className="features-layout">
      {/* Featured Services Section */}
      <section className="featured-services-section">
        <div className="features-container">
          <h2 className="section-title">FEATURED SERVICES</h2>
          <div className="title-underline"></div>
          
          <div className="services-grid">
            {featuredServices.map((service, index) => (
              <div 
                key={index} 
                className="service-card"
                ref={el => serviceCardsRef.current[index] = el}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="service-icon-box">
                  <span className="service-icon">{service.icon}</span>
                </div>
                <h3 className="service-title">{service.title}</h3>
                <h4 className="service-subtitle">{service.subtitle}</h4>
                <p className="service-desc">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Process Section */}
      <section className="process-section" id="process">
        <FloatingBubbles />
        
        <div className="process-header">
          <span className="process-subtitle"> OUR PROCESS </span>
          <div className="title-underline"></div>
        </div>

        <div className="zigzag-timeline-container">
          
          {/* Row 1 */}
          <div className="zigzag-row">
            <div className="row-line"></div>
            <div className="s-connector-top"></div>
            {[steps[0], steps[1]].map((step, index) => (
              <div 
                key={index}
                className="zigzag-card-container"
                ref={el => cardsRef.current[index] = el}
              >
                <div className="snake-card-inner">
                  <div className="snake-icon-wrapper">
                    <div className="snake-icon-inner">{step.icon}</div>
                    <div className="snake-step-number">{step.num}</div>
                  </div>
                  <div className="snake-text-content">
                    <h3 className="snake-step-title">{step.title}</h3>
                    <p className="snake-step-desc">{step.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Row 2 */}
          <div className="zigzag-row">
            <div className="row-line"></div>
            <div className="s-connector-bottom"></div>
            <div className="s-connector-top"></div>
            {[steps[2], steps[3]].map((step, index) => (
              <div 
                key={index + 2}
                className="zigzag-card-container"
                ref={el => cardsRef.current[index + 2] = el}
              >
                <div className="snake-card-inner">
                  <div className="snake-icon-wrapper">
                    <div className="snake-icon-inner">{step.icon}</div>
                    <div className="snake-step-number">{step.num}</div>
                  </div>
                  <div className="snake-text-content">
                    <h3 className="snake-step-title">{step.title}</h3>
                    <p className="snake-step-desc">{step.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Row 3 */}
          <div className="zigzag-row">
            <div className="row-line"></div>
            <div className="s-connector-bottom"></div>
            {[steps[4], steps[5]].map((step, index) => (
              <div 
                key={index + 4}
                className="zigzag-card-container"
                ref={el => cardsRef.current[index + 4] = el}
              >
                <div className="snake-card-inner">
                  <div className="snake-icon-wrapper">
                    <div className="snake-icon-inner">{step.icon}</div>
                    <div className="snake-step-number">{step.num}</div>
                  </div>
                  <div className="snake-text-content">
                    <h3 className="snake-step-title">{step.title}</h3>
                    <p className="snake-step-desc">{step.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
      </div>
    </div>
  );
};

export default Features;
