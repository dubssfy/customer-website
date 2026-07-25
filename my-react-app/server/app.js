import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Existing routes
import bookingRoutes from './routes/bookings.js';
import pricingRoutes from './routes/pricing.js';

// New admin routes
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import managerRoutes from './routes/manager.js';
import userRoutes from './routes/users.js';
import contactRoutes from "./routes/contact.js";

// DB init
import { initializeDatabase } from './models/initDb.js';
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

dotenv.config();

process.on('uncaughtException', (err) => {
  console.error('🔥 UNCAUGHT EXCEPTION:', err.stack || err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🔥 UNHANDLED REJECTION:', reason.stack || reason);
});

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:5173', // Customer website
    'http://localhost:5174', // Admin dashboard
    'https://swachham.co.in',
    'https://admin.swachham.co.in',
  ],
  credentials: true,
}));
app.use(express.json());
app.use(morgan('dev'));

// Existing customer-facing routes (untouched)
app.use('/api/bookings', bookingRoutes);
app.use('/api/pricing', pricingRoutes);

// New admin/auth routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/manager', managerRoutes);
app.use("/api/contact", contactRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;

// Initialize DB tables, then start server
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📧 EMAIL_USER: ${process.env.EMAIL_USER}`);
    console.log(`🔑 JWT_SECRET exists: ${!!process.env.JWT_SECRET}`);
  });
});
