import express from 'express';
import { verifyToken, requireManager } from '../middleware/auth.js';
import {
  getTodayBookings,
  getBookingsByDate,
  updateBookingStatus,
} from '../controllers/managerController.js';

const router = express.Router();

// All manager routes require valid JWT + manager (or admin) role
router.use(verifyToken, requireManager);

router.get('/bookings/today', getTodayBookings);
router.get('/bookings/date', getBookingsByDate);
router.put('/bookings/:id/status', updateBookingStatus);

export default router;
