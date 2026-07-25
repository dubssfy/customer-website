import express from 'express';
import { 
  createBooking, 
  getAllBookings, 
  getBookingById, 
  updateBookingStatus, 
  deleteBooking 
} from '../controllers/bookingController.js';
import { body } from 'express-validator';

const router = express.Router();

// Validation middleware
const validateBooking = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('mobile').matches(/^\d{10}$/).withMessage('Valid 10-digit mobile number is required'),
  body('orderType').notEmpty().withMessage('Order type is required'),
  body('city').notEmpty().withMessage('City is required'),
  body('service').notEmpty().withMessage('Service is required'),
  body('address').notEmpty().withMessage('Address is required'),
];

// Routes
router.post('/', validateBooking, createBooking);
router.get('/', getAllBookings);
router.get('/:id', getBookingById);
router.put('/:id', updateBookingStatus);
router.delete('/:id', deleteBooking);

export default router;
