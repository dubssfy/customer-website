import pool from '../config/db.js';

// Helper: compute IST date string (YYYY-MM-DD) for "today" in Asia/Kolkata
const getISTToday = () => {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }); // returns YYYY-MM-DD
};

// Helper: build stats from an array of bookings
const buildStats = (bookings) => ({
  total: bookings.length,
  pending: bookings.filter(b => b.status?.toLowerCase() === 'pending').length,
  accepted: bookings.filter(b => b.status?.toLowerCase() === 'accepted').length,
  completed: bookings.filter(b => b.status?.toLowerCase() === 'completed').length,
  cancelled: bookings.filter(b =>
    b.status?.toLowerCase() === 'cancelled' || b.status?.toLowerCase() === 'rejected'
  ).length,
});

// ─── GET /api/admin/bookings/today ───────────────────────────────────────────
export const getTodayBookings = async (req, res) => {
  try {
    const todayIST = getISTToday(); // e.g. "2026-07-14"

    const result = await pool.query(`
      SELECT * FROM bookings
      WHERE DATE(created_at AT TIME ZONE 'Asia/Kolkata') = $1::date
      ORDER BY created_at DESC
    `, [todayIST]);

    const bookings = result.rows;
    return res.status(200).json({ success: true, stats: buildStats(bookings), data: bookings });
  } catch (err) {
    console.error('Admin getTodayBookings Error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─── GET /api/admin/bookings/weekly ──────────────────────────────────────────
export const getWeeklyBookings = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM bookings
      WHERE created_at AT TIME ZONE 'Asia/Kolkata' >= DATE_TRUNC('week', NOW() AT TIME ZONE 'Asia/Kolkata') AT TIME ZONE 'Asia/Kolkata'
      ORDER BY created_at DESC
    `);

    const bookings = result.rows;
    return res.status(200).json({ success: true, stats: buildStats(bookings), data: bookings });
  } catch (err) {
    console.error('Admin getWeeklyBookings Error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─── GET /api/admin/bookings/monthly ─────────────────────────────────────────
export const getMonthlyBookings = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM bookings
      WHERE EXTRACT(YEAR FROM created_at AT TIME ZONE 'Asia/Kolkata') = EXTRACT(YEAR FROM NOW() AT TIME ZONE 'Asia/Kolkata')
        AND EXTRACT(MONTH FROM created_at AT TIME ZONE 'Asia/Kolkata') = EXTRACT(MONTH FROM NOW() AT TIME ZONE 'Asia/Kolkata')
      ORDER BY created_at DESC
    `);

    const bookings = result.rows;
    return res.status(200).json({ success: true, stats: buildStats(bookings), data: bookings });
  } catch (err) {
    console.error('Admin getMonthlyBookings Error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─── GET /api/admin/bookings/yearly ──────────────────────────────────────────
export const getYearlyBookings = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM bookings
      WHERE EXTRACT(YEAR FROM created_at AT TIME ZONE 'Asia/Kolkata') = EXTRACT(YEAR FROM NOW() AT TIME ZONE 'Asia/Kolkata')
      ORDER BY created_at DESC
    `);

    const bookings = result.rows;
    return res.status(200).json({ success: true, stats: buildStats(bookings), data: bookings });
  } catch (err) {
    console.error('Admin getYearlyBookings Error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─── GET /api/admin/bookings/date?date=YYYY-MM-DD ───────────────────────────
export const getBookingsByDate = async (req, res) => {
  try {
    const { date, month, year } = req.query;

    let query = '';
    let params = [];

    if (date) {
      query = `SELECT * FROM bookings WHERE DATE(created_at AT TIME ZONE 'Asia/Kolkata') = $1::date ORDER BY created_at DESC`;
      params = [date];
    } else if (month && year) {
      query = `SELECT * FROM bookings WHERE EXTRACT(MONTH FROM created_at AT TIME ZONE 'Asia/Kolkata') = $1 AND EXTRACT(YEAR FROM created_at AT TIME ZONE 'Asia/Kolkata') = $2 ORDER BY created_at DESC`;
      params = [parseInt(month), parseInt(year)];
    } else if (year) {
      query = `SELECT * FROM bookings WHERE EXTRACT(YEAR FROM created_at AT TIME ZONE 'Asia/Kolkata') = $1 ORDER BY created_at DESC`;
      params = [parseInt(year)];
    } else {
      return res.status(400).json({ success: false, message: 'Provide date, month/year, or year.' });
    }

    const result = await pool.query(query, params);
    const bookings = result.rows;

    return res.status(200).json({ success: true, stats: buildStats(bookings), data: bookings });
  } catch (err) {
    console.error('Admin getBookingsByDate Error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─── GET /api/admin/prices ───────────────────────────────────────────────────
export const getPrices = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM pricing ORDER BY category, type, display_order, id'
    );
    return res.status(200).json({ success: true, data: result.rows });
  } catch (err) {
    console.error('Admin getPrices Error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─── POST /api/admin/prices ──────────────────────────────────────────────────
export const addPrice = async (req, res) => {
  try {
    const { category, service_name, original_price, discount_price, type, display_order, is_highlight } = req.body;

    if (!category || !service_name || original_price == null || discount_price == null || !type) {
      return res.status(400).json({
        success: false,
        message: 'Category, service name, type, original price and discount price are required.',
      });
    }

    const result = await pool.query(
      `INSERT INTO pricing (type, category, original_price, discount_price, is_highlight, display_order, service_name)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [type, category, parseFloat(original_price), parseFloat(discount_price), is_highlight || false, display_order || 0, service_name]
    );

    return res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Admin addPrice Error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─── PUT /api/admin/prices/:id ───────────────────────────────────────────────
export const updatePrice = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, service_name, original_price, discount_price, type, display_order, is_highlight } = req.body;

    const result = await pool.query(
      `UPDATE pricing SET
        type = COALESCE($1, type),
        category = COALESCE($2, category),
        original_price = COALESCE($3, original_price),
        discount_price = COALESCE($4, discount_price),
        is_highlight = COALESCE($5, is_highlight),
        display_order = COALESCE($6, display_order),
        service_name = COALESCE($7, service_name),
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $8 RETURNING *`,
      [
        type || null,
        category || null,
        original_price != null ? parseFloat(original_price) : null,
        discount_price != null ? parseFloat(discount_price) : null,
        is_highlight != null ? is_highlight : null,
        display_order != null ? parseInt(display_order) : null,
        service_name || null,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Price item not found.' });
    }

    return res.status(200).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Admin updatePrice Error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─── DELETE /api/admin/prices/:id ───────────────────────────────────────────
export const deletePrice = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM pricing WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Price item not found.' });
    }

    return res.status(200).json({ success: true, message: 'Price item deleted successfully.' });
  } catch (err) {
    console.error('Admin deletePrice Error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};
