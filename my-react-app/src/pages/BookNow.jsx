import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../services/api";
import "./BookNow.css";
import { Loader2 } from "lucide-react";

export default function BookNow() {
  const navigate = useNavigate();
  const location = useLocation();
  const preselected = location.state?.preselectedService || "";

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    orderType: "",
    city: "",
    service: preselected,
    mapLink: "",
    address: ""
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};
    if (!formData.name) tempErrors.name = "Name is required";
    if (!formData.email) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Email is invalid";
    }
    if (!formData.mobile) {
      tempErrors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      tempErrors.mobile = "Mobile must be 10 digits";
    }
    if (!formData.orderType) tempErrors.orderType = "Order type is required";
    if (!formData.city) tempErrors.city = "City is required";
    if (!formData.service) tempErrors.service = "Service is required";
    if (!formData.address) tempErrors.address = "Address is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validate()) return;

  setLoading(true);

  try {
    const response = await api.post("/bookings", formData);

    if (response.data.success) {
      navigate("/thank-you", {
        state: {
          bookingId: response.data.bookingId,
        },
      });
    } else {
      alert("Booking failed. Please try again.");
    }
  } catch (error) {
    console.error("Booking error:", error);
    alert("Failed to book pickup. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="book-now-page animate-on-scroll visible">
      <div className="book-now-content-wrapper">
        
        {/* Left Side: Form */}
        <div className="book-now-container">
          <div className="book-now-card">
            <h2>Schedule Your Pickup</h2>
            <p className="subtitle">Easy & Fast!</p>

            <form onSubmit={handleSubmit} className="book-now-form">
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Customer Name"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? "error-input" : ""}
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>

              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "error-input" : ""}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="mobile"
                  placeholder="Mobile Number"
                  value={formData.mobile}
                  onChange={handleChange}
                  className={errors.mobile ? "error-input" : ""}
                />
                {errors.mobile && <span className="error-text">{errors.mobile}</span>}
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <select
                    name="orderType"
                    value={formData.orderType}
                    onChange={handleChange}
                    className={errors.orderType ? "error-input" : ""}
                  >
                    <option value="">Order Type</option>
                    <option value="Pickup">Pickup</option>
                    <option value="Walk In">Walk In</option>
                  </select>
                  {errors.orderType && <span className="error-text">{errors.orderType}</span>}
                </div>

                <div className="form-group half">
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={errors.city ? "error-input" : ""}
                  >
                    <option value="">City</option>
                    <option value="Dapoli">Dapoli</option>
                    <option value="Khed">Khed</option>
                    <option value="Chiplun">Chiplun</option>
                    <option value="Guhagar">Guhagar</option>
                  </select>
                  {errors.city && <span className="error-text">{errors.city}</span>}
                </div>
              </div>

              <div className="form-group">
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className={errors.service ? "error-input" : ""}
                >
                  <option value="">Service</option>
                  <option value="Dry Cleaning">Dry Cleaning</option>
                  <option value="Steam Iron">Steam Iron</option>
                  <option value="Wash & Iron">Wash & Iron</option>
                  <option value="Wash Only">Wash Only</option>
                </select>
                {errors.service && <span className="error-text">{errors.service}</span>}
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="mapLink"
                  placeholder="Google Map Link (Optional)"
                  value={formData.mapLink}
                  onChange={handleChange}
                  className={errors.mapLink ? "error-input" : ""}
                />
              </div>

              <div className="form-group">
                <textarea
                  name="address"
                  placeholder="Address"
                  rows="3"
                  value={formData.address}
                  onChange={handleChange}
                  className={errors.address ? "error-input" : ""}
                ></textarea>
                {errors.address && <span className="error-text">{errors.address}</span>}
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="spinner" size={20} /> Booking...
                  </>
                ) : (
                  "Book Pickup"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Side: Animated Scooter */}
        <div className="scooter-container">
          <img src="/scooter.png" alt="Delivery Scooter" className="animated-scooter" />
        </div>

      </div>
    </div>
  );
}
