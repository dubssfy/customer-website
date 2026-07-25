import express from 'express';
import { verifyToken, requireAdmin } from '../middleware/auth.js';
import {
  getTodayBookings,
  getWeeklyBookings,
  getMonthlyBookings,
  getYearlyBookings,
  getBookingsByDate,
  getPrices,
  addPrice,
  updatePrice,
  deletePrice,
} from '../controllers/adminController.js';

const router = express.Router();

// All admin routes require valid JWT + admin role
router.use(verifyToken, requireAdmin);

// Booking filter routes
router.get('/bookings/today', getTodayBookings);
router.get('/bookings/weekly', getWeeklyBookings);
router.get('/bookings/monthly', getMonthlyBookings);
router.get('/bookings/yearly', getYearlyBookings);
router.get('/bookings/date', getBookingsByDate);

// Price management routes
router.get('/prices', getPrices);
router.post('/prices', addPrice);
router.put('/prices/:id', updatePrice);
router.delete('/prices/:id', deletePrice);

export default router;
