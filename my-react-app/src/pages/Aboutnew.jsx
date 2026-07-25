import React, { useRef, useState } from 'react';
import { Expand } from "lucide-react";
import './Aboutnew.css';

const OurPromise = () => {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const promises = [
    {
      icon: '💙',
      title: '100% Happiness Guarantee',
      description:
        "If you're not completely satisfied with the wash or dry cleaning, we will re-wash your clothes for free!"
    },
    {
      icon: '⚡',
      title: 'Fast & High Quality',
      description:
        'We work hard to make sure that the clothes you get back are spotless and ready for action.'
    },
    {
      icon: '🌿',
      title: 'Cleaner & Greener',
      description:
        'We work with the environment in mind. No harsh chemicals, only eco-friendly detergents that are gentle on your clothes and the planet.'
    }
  ];

  const togglePlay = () => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
        setPlaying(false);
      } else {
        videoRef.current.play();
        setPlaying(true);
      }
    }
  };
  const openFullscreen = (e) => {
  e.stopPropagation();

  const video = videoRef.current;
  if (!video) return;

  if (video.requestFullscreen) {
    video.requestFullscreen();
  } else if (video.webkitEnterFullscreen) {
    // iPhone Safari
    video.webkitEnterFullscreen();
  } else if (video.webkitRequestFullscreen) {
    // Older Safari
    video.webkitRequestFullscreen();
  } else if (video.msRequestFullscreen) {
    // IE/Edge
    video.msRequestFullscreen();
  }
};

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setPlaying(true);
    }
  };

  const handlePause = () => {
    setPlaying(false);
  };

  const handleEnded = () => {
    setPlaying(false);
  };

  return (
    <section className="our-promise" id="about">
      <div className="our-promise-container">
        {/* Left Side */}
        <div className="our-promise-left">
          <div className="promise-video" onClick={togglePlay} style={{ cursor: "pointer" }}>
            <video
              ref={videoRef}
              className="promise-image"
              src="/vid1.mp4"
              preload="metadata"
              playsInline
              onPause={handlePause}
              onEnded={handleEnded}
             controlsList="nodownload"
             disablePictureInPicture
            />

            {!playing && (
              <button
                className="play-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlay();
                }}
                aria-label="Play Video"
              >
                ▶
              </button>
            )}
          </div>
          <button
  className="fullscreen-btn"
  onClick={openFullscreen}
  aria-label="Fullscreen"
>
  <Expand size={20} />
</button>

          <p className="promise-caption">
            Discover why thousands of people trust us to care for their clothes!
          </p>
        </div>

        {/* Right Side */}
        <div className="our-promise-right">
          <h2 className="promise-section-title">OUR PROMISE</h2>

          <div className="promises-list">
            {promises.map((promise, index) => (
              <div key={index} className="promise-item">
                <div className="promise-icon">{promise.icon}</div>

                <div className="promise-content">
                  <h3 className="promise-title">{promise.title}</h3>
                  <p className="promise-description">
                    {promise.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurPromise;