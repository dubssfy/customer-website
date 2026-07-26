import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "./IntroSequence.css";

export default function IntroSequence({ onComplete }) {
  const containerRef = useRef(null);
  const machineRef = useRef(null);
  const doorRef = useRef(null);
  const lightRef = useRef(null);
  const logoRef = useRef(null);
  const taglineRef = useRef(null);

  const [particles, setParticles] = useState([]);
  const [bubbles, setBubbles] = useState([]);
  const isMobile = window.innerWidth <= 768;

  useEffect(() => {
    // Generate random floating bubbles for the white background
    const newBubbles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      size: `${Math.random() * 40 + 20}px`,
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 8 + 5}s`,
      animationDelay: `${Math.random() * 2}s`,
    }));
    setBubbles(newBubbles);

    // Generate inner light particles
    const newParticles = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 3 + 2}s`,
      animationDelay: `${Math.random() * 1}s`,
    }));
    setParticles(newParticles);

    // GSAP Timeline for the cinematic intro
    const tl = gsap.timeline({
      onComplete: () => {
        // Give a little pause before completing the intro phase
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 1500);
      }
    });

    // 1. Initial appearance of the washing machine
    tl.fromTo(
      machineRef.current,
      { scale: 0.5, opacity: 0, y: 50 },
      { scale: isMobile ? 0.65 : 0.8, opacity: 1, y: 0, duration: 2, ease: "power3.out" }
    )
    // 2. Camera zoom effect (machine moves toward user)
    .to(
      machineRef.current,
      { scale: isMobile ? 1.5 : 2.2,y: isMobile ? "5%" : "15%", duration: 4, ease: "power2.inOut" },
      "-=0.5"
    )
    // 3. Pause briefly, vibrate slightly, door glows
    .to(machineRef.current, { x: -5, y: "+=2", duration: 0.1, yoyo: true, repeat: 5 }, "+=0.2")
    .to(".machine-glow", { opacity: 1, duration: 0.5 }, "-=0.5")
    // Fade out door logo before opening (or let it rotate with door)
    // 4. Door opens slowly (Logo rotates with the door)
    .to(
      doorRef.current,
      { rotationY: -110, transformOrigin: "left center", duration: 2.5, ease: "power1.inOut" },
      "+=0.2"
    )
    // 5. Bright white light emerges
    .to(
      lightRef.current,
      { opacity: 1, scale: 2.5, duration: 1.5, ease: "power2.out" },
      "-=1.5"
    )
    // 6. Reveal Swachham Logo and Tagline from inside
    .fromTo(
      logoRef.current,
      { scale: 0.5, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.5, ease: "back.out(1.7)" },
      "-=0.5"
    )
    .fromTo(
      ".tagline-line",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.5, ease: "power2.out" },
      "-=0.5"
    );

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div className="intro-sequence-container" ref={containerRef}>
      {/* Dynamic Background: White with floating bubbles */}
      <div className="intro-background-white"></div>
      
      {bubbles.map((b) => (
        <div
          key={`bubble-${b.id}`}
          className="intro-bubble"
          style={{
            width: b.size,
            height: b.size,
            left: b.left,
            animationDuration: b.animationDuration,
            animationDelay: b.animationDelay,
          }}
        ></div>
      ))}

      {/* Inner light particles for the drum effect */}
      <div className="inner-particles-container">
        {particles.map((p) => (
          <div
            key={`particle-${p.id}`}
            className="intro-particle"
            style={{
              left: p.left,
              top: p.top,
              animationDuration: p.animationDuration,
              animationDelay: p.animationDelay,
            }}
          ></div>
        ))}
      </div>    
      
            {/* Washing Machine */}
      <div className="machine-wrapper" ref={machineRef}>
        
        {/* Using the provided washing machine image as the body */}
        <div className="machine-image-container">
          <img 
            src="finalws.png" 
            alt="Industrial Washing Machine" 
            className="machine-base-img" 
            onError={(e) => {
              // Fallback if image is not placed yet
              e.target.style.display = 'none';
              e.target.parentElement.classList.add("machine-fallback");
            }}
          />
          
          <div className="machine-drum-container">
            <div className="machine-glow"></div>
            
            <div className="machine-drum-interior">
              {/* Emerging Light */}
             <div className="emerging-light" ref={lightRef}></div> 
              
              {/* Logo & Tagline Reveal */}
              <div className="reveal-content">
                <div className="reveal-logo" ref={logoRef}>
                  {/*<img src="/logo-transparent.png" alt="Swachham Logo Inner" className="inner-reveal-logo" />*/}
                  <h2 className="intro-brand-name">SWACHHAM</h2>
                  <h4 className="intro-brand-sub">BUSINESS OF LAUNDERING</h4>
                </div>
                <div className="reveal-tagline" ref={taglineRef}>
                  <p className="tagline-line">Rooted in Tradition.</p>
                  <p className="tagline-line">Driven by Technology.</p>
                  <p className="tagline-line">Committed to Excellence.</p>
                </div>
              </div>
            </div>
            
            {/* Door that rotates open */}
            <div className="machine-door" ref={doorRef}>
              <div className="door-glass"></div>
              <div className="door-rim"></div>
              {/* Logo on Door */}
              <div className="door-logo">
                <div className="spinner-ring"></div>
                <div className="spinner-ring-2"></div>
                <img src="/logo-mark.png" alt="Swachham Logo Door" className="door-logo-img" />
              </div>
            </div>
          </div>
          
        </div>
      </div>
      
      {/* Skip button */}
      <button className="skip-intro-btn" onClick={onComplete}>Skip Intro</button>
    </div>
  );
}
