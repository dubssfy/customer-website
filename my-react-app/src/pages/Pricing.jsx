import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Pricing.css";
import FloatingBubbles from "../components/FloatingBubbles";
import { api } from "../services/api";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import { TbTextSize } from "react-icons/tb";

const SERVICE_ICONS = {
  "Dry Cleaning":  "👔",
  "Wash & Fold":   "🧺",
  "Premium Wash":  "✨",
  "Hotel Linen":   "🛏️",
  "Uniform":       "👕",
  "Steam Iron":    "♨️",
  "Shoe Cleaning": "👟",
  "Wash Only":     "🧥",
  "Wash Iron":     "🧺",
  "General":       "🧺",
};

export default function Pricing() {
  const navigate = useNavigate();
  const [pricingData, setPricingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("");
  const [expandedCards, setExpandedCards] = useState({});

  useEffect(() => {
    fetchPricing();
  }, []);

  const fetchPricing = async () => {
    try {
      setError(null);
      const res = await api.get("/pricing");
      const rows = res.data.data || [];
      setPricingData(rows);

      // Auto-set the first available category as active tab
      if (rows.length > 0 && !activeTab) {
        const firstCat = rows[0].service_name || "";
        setActiveTab(firstCat);
      }
    } catch (err) {
      console.error("Failed to fetch pricing:", err);
      setError("Unable to load pricing. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Derive unique categories for tabs
  const categories = useMemo(() => {
    return [...new Set(pricingData.map(item => item.service_name).filter(Boolean))];
  }, [pricingData]);

  // Set active tab once categories load
  useEffect(() => {
    if (categories.length > 0 && !categories.includes(activeTab)) {
      setActiveTab(categories[0]);
    }
  }, [categories]);

  const toggleViewMore = (title) => {
    setExpandedCards((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  if (loading) {
    return (
      <section className="pricing-section">
        <div className="pricing-loading">
          <div className="loading-spinner" />
          <p>Loading prices...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="pricing-section">
        <div className="pricing-error">
          <p>{error}</p>
          <button onClick={fetchPricing} className="retry-btn">Try Again</button>
        </div>
      </section>
    );
  }

  // Filter items by selected category tab
  const filteredData = pricingData.filter(
    (item) => item.service_name?.toLowerCase() === activeTab?.toLowerCase()
  );

  // Group by type within the selected category
  const groupedByType = {};
  filteredData.forEach((item) => {
    const typeKey = item.type || "General";
    if (!groupedByType[typeKey]) {
      groupedByType[typeKey] = {
        title: typeKey,
        icon: SERVICE_ICONS[typeKey] || "🧺",
        items: [],
      };
    }
    groupedByType[typeKey].items.push({
      item:  item.category,
      old: Number(item.original_price),
      price: Number(item.discount_price),
      highlight: item.is_highlight,
    });
  });

  const displayGroups = Object.values(groupedByType);

  return (
    <section className="pricing-section">
      <FloatingBubbles />

      <h2 className="pricing-heading">
        Our Transparent{" "}
        <span className="animated-heading">
          Pricing
          <span className="heading-line"></span>
        </span>
      </h2>

      {/* Category Tabs — dynamically generated from DB */}
      {categories.length > 0 && (
        <div className="pricing-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`tab-btn ${activeTab === cat ? "active" : ""}`}
              onClick={() => setActiveTab(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Horizontally scrolling marquee below categories */}
      <div className="pricing-section-ticker">
        <div className="pricing-section-ticker-track">
          <span className="pricing-section-ticker-content">
            We also provide commercial laundry services. For more info <Link style={{fontSize: '20px'}} to="/contact" className="ticker-link">Contact Us</Link>.
          </span>
          <span className="pricing-section-ticker-content" aria-hidden="true">
            We also provide commercial laundry services. For more info <Link style={{ fontSize: '20px' }} to="/contact" className="ticker-link">Contact Us</Link>.
          </span>
          <span className="pricing-section-ticker-content" aria-hidden="true">
            We also provide commercial laundry services. For more info <Link style={{ fontSize: '20px' }} to="/contact" className="ticker-link">Contact Us</Link>.
          </span>
          <span className="pricing-section-ticker-content" aria-hidden="true">
            We also provide commercial laundry services. For more info <Link style={{ fontSize: '20px' }} to="/contact" className="ticker-link">Contact Us</Link>.
          </span>
        </div>
      </div>

      {displayGroups.length === 0 ? (
        <div className="no-prices">
          No prices available{activeTab ? ` for ${activeTab}` : ""}.
        </div>
      ) : (
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={25}
          slidesPerView={3}
          loop={displayGroups.length > 3}
          breakpoints={{
            320: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1200: { slidesPerView: 3 },
          }}
        >
          {displayGroups.map((card, index) => {
            const expanded = expandedCards[card.title];
            const visibleItems = expanded ? card.items : card.items.slice(0, 10);

            return (
              <SwiperSlide key={index}>
                <div className="price-card">
                  <div className="card-top">
                    <div className="card-icon">{card.icon}</div>
                    <h3>{card.title}</h3>
                  </div>

                  <table>
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Price</th>
                      </tr>
                    </thead>

                    <tbody>
                      {visibleItems.map((row, i) => (
                        <tr
                          key={i}
                          className={row.highlight ? "highlight-row" : ""}
                        >
                          <td>{row.item}</td>
                          <td>
                            {row.old > row.price && (
                              <span className="old-price">₹{row.old}</span>
                            )}
                            <span className="new-price">₹{row.price}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <p className="note">
                    *Note : Prices may vary based on fabric composition,garment size and treatment required .| New Cutomer: 20% off first oredr shown with coupon MY25 applied.<br />
                    Valid on first order.<br />
                    All prices are exclusive  of taxes.
                  </p>

                  {card.items.length > 10 && (
                    <button
                      className="view-btn"
                      onClick={() => toggleViewMore(card.title)}
                    >
                      {expanded ? "Show Less ↑" : "View More →"}
                    </button>
                  )}
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
    </section>
  );
}