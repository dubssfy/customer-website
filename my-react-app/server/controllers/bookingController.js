import { v4 as uuidv4 } from 'uuid';
import pool from '../config/db.js';
import { validationResult } from 'express-validator';
import { sendConfirmationEmail } from '../utils/email.js';
import { sendWhatsAppMessage } from "../utils/sendWhatsApp.js";

// @desc    Create a new booking
// @route   POST /api/bookings
// @desc    Create a new booking
// @route   POST /api/bookings
export const createBooking = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  const {
    name,
    email,
    mobile,
    orderType,
    city,
    service,
    address,
    mapLink,
  } = req.body;

  

  try {
    const result = await pool.query(
      `INSERT INTO bookings
      (
        
        customer_name,
        email,
        mobile,
        order_type,
        city,
        service,
        address,
        map_link
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *`,
      
      [
        
        name,
        email,
        mobile,
        orderType,
        city,
        service,
        address,
        mapLink || null,
      ]
      
    );
    const id = result.rows[0].id;

const bookingId = `SW${String(id).padStart(7, "0")}`;
await pool.query(
  "UPDATE bookings SET booking_id = $1 WHERE id = $2",
  [bookingId, id]
);

    console.log("Booking saved successfully.");

    // Send Email
    try {
      await sendConfirmationEmail(email, {
        name,
        bookingId,
        orderType,
        service,
        city,
        estimatedPickup: "Within 60 Minutes",
      });

      console.log("Confirmation email sent.");
    } catch (err) {
      console.error("Email Error:", err);
    }

    // Send WhatsApp
    try {
      await sendWhatsAppMessage({
        mobile,
        name,
        bookingId
       
      });

      console.log("WhatsApp sent.");
    } catch (err) {
      console.error("WhatsApp Error:", err);
    }

    return res.status(201).json({
      success: true,
      bookingId,
      data: result.rows[0],
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
// @desc    Get all bookings
// @route   GET /api/bookings
export const getAllBookings = async (req, res) => {
  try {

    const bookings = await pool.query(
      "SELECT * FROM bookings ORDER BY created_at DESC"
    );

    res.status(200).json({
      success: true,
      count: bookings.rowCount,
      data: bookings.rows
    });

  } catch (error) {
    console.error("Error fetching bookings:", error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

// @desc    Get single booking using UUID
// @route   GET /api/bookings/:id
export const getBookingById = async (req, res) => {

  try {

    const { id } = req.params;

    const booking = await pool.query(
      "SELECT * FROM bookings WHERE booking_id = $1",
      [id]
    );

    if (booking.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    res.status(200).json({
      success: true,
      data: booking.rows[0]
    });

  } catch (error) {

    console.error("Error fetching booking:", error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }

};

// @desc    Update booking status
// @route   PUT /api/bookings/:id
export const updateBookingStatus = async (req, res) => {

  try {

    const { id } = req.params;
    const { status } = req.body;

    const updatedBooking = await pool.query(
      `UPDATE bookings
       SET status = $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [status, id]
    );

    if (updatedBooking.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    res.status(200).json({
      success: true,
      data: updatedBooking.rows[0]
    });

  } catch (error) {

    console.error("Error updating booking:", error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }

};

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
export const deleteBooking = async (req, res) => {

  try {

    const { id } = req.params;

    const deletedBooking = await pool.query(
      "DELETE FROM bookings WHERE id = $1 RETURNING *",
      [id]
    );

    if (deletedBooking.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking deleted successfully",
      data: {}
    });

  } catch (error) {

    console.error("Error deleting booking:", error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }

};