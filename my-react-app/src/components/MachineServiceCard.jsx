import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./MachineServiceCard.css";

export default function MachineServiceCard({ id, title, icon, color = "blue", route }) {
  const navigate = useNavigate();
  const doorRef = useRef(null);

  const handleClick = () => {
    // Open door briefly before navigating
    if (doorRef.current) {
      doorRef.current.style.transform = "rotateY(-100deg)";
      setTimeout(() => {
        navigate(route || `/service/${id}`);
      }, 600);
    } else {
      navigate(route || `/service/${id}`);
    }
  };

  return (
    <div className={`machine-service-card ${color}`} onClick={handleClick}>
      <div className="mini-machine">
        <div className="mini-machine-reflection"></div>
        <div className="mini-machine-panel">
          <div className="mini-machine-dial"></div>
          <div className="mini-machine-screen"></div>
        </div>
        <div className="mini-machine-drum-container">
          <div className="mini-machine-glow"></div>
          <div className="mini-machine-drum">
            <div className="mini-service-icon">{icon}</div>
          </div>
          <div className="mini-machine-door" ref={doorRef}>
            <div className="mini-door-glass"></div>
            <div className="mini-door-rim"></div>
          </div>
        </div>
      </div>
      <div className="service-title">{title}</div>
    </div>
  );
}
