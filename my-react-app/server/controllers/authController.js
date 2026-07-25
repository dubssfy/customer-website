import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import pool from '../config/db.js';

// ─── Email Transporter ──────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ─── Helper: Generate 6-digit OTP ──────────────────────────────────────────
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// ─── @route  POST /api/auth/signup ──────────────────────────────────────────
export const signup = async (req, res) => {
  try {
    const { full_name, email, phone, password } = req.body;

    if (!full_name || !email || !phone || !password ) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    

    // Check duplicate email
    const existing = await pool.query('SELECT id FROM admin_users WHERE email = $1', [email.toLowerCase()]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ success: false, message: 'Email already registered.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }
    const role = "manager";

    const password_hash = await bcrypt.hash(password, 12);

    const result = await pool.query(
      `INSERT INTO admin_users (full_name, email, phone, password_hash, role)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, full_name, email, phone, role, created_at`,
      [full_name, email.toLowerCase(), phone, password_hash, role]
    );

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({ success: true, token, user });
  } catch (err) {
    console.error('Signup Error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error during signup.' });
  }
};

// ─── @route  POST /api/auth/login ───────────────────────────────────────────
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const result = await pool.query('SELECT * FROM admin_users WHERE email = $1', [email.toLowerCase()]);
    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    return res.status(200).json({
      success: true,
      token,
      user: { id: user.id, full_name: user.full_name, email: user.email, phone: user.phone, role: user.role },
    });
  } catch (err) {
    console.error('Login Error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

// ─── @route  POST /api/auth/forgot-password ─────────────────────────────────
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    const userResult = await pool.query('SELECT id, full_name FROM admin_users WHERE email = $1', [email.toLowerCase()]);
    if (userResult.rows.length === 0) {
      // Return success anyway for security (don't reveal if email exists)
      return res.status(200).json({ success: true, message: 'If this email exists, an OTP has been sent.' });
    }

    const user = userResult.rows[0];
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Invalidate old OTPs for this email
    await pool.query('DELETE FROM password_otps WHERE email = $1', [email.toLowerCase()]);

    // Store new OTP
    await pool.query(
      'INSERT INTO password_otps (email, otp, expires_at) VALUES ($1, $2, $3)',
      [email.toLowerCase(), otp, expiresAt]
    );

    // Send OTP email
    await transporter.sendMail({
      from: `"Swaccham Admin" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset OTP - Swaccham Admin',
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; max-width: 500px; margin: 0 auto; background: #f9fafb; padding: 32px; border-radius: 12px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #16a34a; font-size: 28px; margin: 0;">🧺 Swaccham</h1>
            <p style="color: #6b7280; margin: 4px 0 0;">Admin Dashboard</p>
          </div>
          <div style="background: white; padding: 24px; border-radius: 8px; border: 1px solid #e5e7eb;">
            <p style="color: #111827; font-size: 16px;">Hello <strong>${user.full_name}</strong>,</p>
            <p style="color: #374151;">Use the OTP below to reset your password. It expires in <strong>5 minutes</strong>.</p>
            <div style="text-align: center; margin: 24px 0;">
              <span style="font-size: 40px; font-weight: 800; letter-spacing: 12px; color: #16a34a; background: #f0fdf4; padding: 16px 24px; border-radius: 8px; border: 2px dashed #86efac;">${otp}</span>
            </div>
            <p style="color: #6b7280; font-size: 14px;">If you did not request this, please ignore this email.</p>
          </div>
          <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 16px;">© ${new Date().getFullYear()} Swaccham Laundry</p>
        </div>
      `,
    });

    return res.status(200).json({ success: true, message: 'OTP sent to your email address.' });
  } catch (err) {
    console.error('Forgot Password Error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to send OTP. Please try again.' });
  }
};

// ─── @route  POST /api/auth/verify-otp ──────────────────────────────────────
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required.' });
    }

    const result = await pool.query(
      'SELECT * FROM password_otps WHERE email = $1 ORDER BY created_at DESC LIMIT 1',
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ success: false, message: 'No OTP found. Please request a new one.' });
    }

    const otpRecord = result.rows[0];

    if (new Date() > new Date(otpRecord.expires_at)) {
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }

    if (otpRecord.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP. Please try again.' });
    }

    // Mark OTP as verified
    await pool.query('UPDATE password_otps SET verified = true WHERE id = $1', [otpRecord.id]);

    return res.status(200).json({ success: true, message: 'OTP verified successfully.' });
  } catch (err) {
    console.error('Verify OTP Error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error verifying OTP.' });
  }
};

// ─── @route  POST /api/auth/reset-password ──────────────────────────────────



export const resetPassword = async (req, res) => {
  try {
    // Accept both camelCase (newPassword) and lowercase (newpassword) from different frontends
    const { email, otp, newPassword, newpassword } = req.body;
    const passwordValue = newPassword || newpassword;

    if (!email || !otp || !passwordValue) {
      return res.status(400).json({ success: false, message: 'Email, OTP, and new password are required.' });
    }

    if (passwordValue.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    const result = await pool.query(
      'SELECT * FROM password_otps WHERE email = $1 ORDER BY created_at DESC LIMIT 1',
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ success: false, message: 'No verified OTP found.' });
    }

    const otpRecord = result.rows[0];

    if (!otpRecord.verified || otpRecord.otp !== otp) {
      return res.status(400).json({ success: false, message: 'OTP not verified. Please verify OTP first.' });
    }

    if (new Date() > new Date(otpRecord.expires_at)) {
      return res.status(400).json({ success: false, message: 'OTP expired. Please request a new one.' });
    }

    const password_hash = await bcrypt.hash(passwordValue, 12);

    await pool.query(
      'UPDATE admin_users SET password_hash = $1, updated_at = NOW() WHERE email = $2',
      [password_hash, email.toLowerCase()]
    );

    // Clean up OTP
    await pool.query('DELETE FROM password_otps WHERE email = $1', [email.toLowerCase()]);

    return res.status(200).json({ success: true, message: 'Password reset successfully. Please login.' });
  } catch (err) {
    console.error('Reset Password Error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error resetting password.' });
  }
};

// ─── @route  GET /api/users/profile ─────────────────────────────────────────
export const getProfile = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, full_name, email, phone, role, created_at FROM admin_users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.status(200).json({ success: true, user: result.rows[0] });
  } catch (err) {
    console.error('Get Profile Error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};
