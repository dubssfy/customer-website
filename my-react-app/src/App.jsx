import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import FloatingContact from "./components/FloatingContact";
import GlobalLoader from "./components/GlobalLoader";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Aboutnew from "./pages/Aboutnew";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import BookNow from "./pages/BookNow";
import ThankYou from "./pages/ThankYou";
import AdminDashboard from "./pages/AdminDashboard";
import ServiceDetail from "./pages/ServiceDetail";

import "./App.css";

function AppContent() {
  const location = useLocation();

  return (
    <div className="App">
      {/* Show GlobalLoader on all pages EXCEPT Home */}
      {location.pathname !== "/" && <GlobalLoader />}

      <Navbar />
        <ScrollToTop />

      <main className="page-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/Aboutnew" element={<Aboutnew />} />
          <Route path="/Features" element={<Features />} />
          <Route path="/Pricing" element={<Pricing />} />
          <Route path="/book-now" element={<BookNow />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/service/:id" element={<ServiceDetail />} />
        </Routes>
      </main>

      <FloatingContact />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;