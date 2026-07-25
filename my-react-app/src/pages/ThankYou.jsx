import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, Home, CalendarPlus } from "lucide-react";
import { motion } from "framer-motion";
import "./ThankYou.css";

export default function ThankYou() {
  const navigate = useNavigate();
  const location = useLocation();

  const bookingId = location.state?.bookingId;

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!bookingId) {
      setLoading(false);
      return;
    }

    const fetchBooking = async () => {
      try {
        const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await fetch(
          `${apiBaseUrl}/bookings/${bookingId}`
        );

        const data = await response.json();

        if (data.success) {
          // Your backend returns the booking inside "data"
          setBooking(data.data);
        }
      } catch (error) {
        console.error("Error fetching booking:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  return (
    <div className="thank-you-page">
      <motion.div
        className="thank-you-card"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="success-icon-wrapper">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.2,
              type: "spring",
              stiffness: 200,
            }}
          >
            <CheckCircle className="success-icon" />
          </motion.div>
        </div>

        <h1 className="thank-you-title">Thank You!</h1>

        <p className="thank-you-message">
          Your pickup has been successfully scheduled.
          <br />
          Our team will arrive at your doorstep to collect your clothes.
        </p>

        <div className="order-details-card">

          <div className="detail-row">
            <span className="detail-label">Booking ID</span>
            <span className="detail-value">
              {loading
                ? "Loading..."
                : booking?.booking_id || "Not Available"}
            </span>
          </div>

         {/* <div className="detail-row">
            <span className="detail-label">Customer</span>
            <span className="detail-value">
              {loading
                ? "Loading..."
                : booking?.customer_name || "Not Available"}
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Email</span>
            <span className="detail-value">
              {loading
                ? "Loading..."
                : booking?.email || "Not Available"}
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Mobile</span>
            <span className="detail-value">
              {loading
                ? "Loading..."
                : booking?.mobile || "Not Available"}
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Service</span>
            <span className="detail-value">
              {loading
                ? "Loading..."
                : booking?.service || "Not Available"}
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Order Type</span>
            <span className="detail-value">
              {loading
                ? "Loading..."
                : booking?.order_type || "Not Available"}
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-label">City</span>
            <span className="detail-value">
              {loading
                ? "Loading..."
                : booking?.city || "Not Available"}
            </span>
          </div>*/}

          <div className="detail-row">
            <span className="detail-label">Status</span>
            <span className="detail-value status-confirmed">
              {loading
                ? "Loading..."
                : booking?.status || "Pending"}
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Estimated Pickup</span>
            <span className="detail-value">
              Within 60 Minutes
            </span>
          </div>

        </div>

        <div className="thank-you-actions">
          <button
            onClick={() => navigate("/")}
            className="btn-secondary"
          >
            <Home size={18} />
            Back to Home
          </button>

          <button
            onClick={() => navigate("/book-now")}
            className="btn-primary"
          >
            <CalendarPlus size={18} />
            Book Another
          </button>
        </div>
      </motion.div>
    </div>
  );
}