import pool from '../config/db.js';

// Helper: compute IST date string (YYYY-MM-DD) for "today" in Asia/Kolkata
const getISTToday = () => {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }); // returns YYYY-MM-DD
};

// ─── GET /api/manager/bookings/today ─────────────────────────────────────────
export const getTodayBookings = async (req, res) => {
  try {
    const { search, status, city, service } = req.query;
    const todayIST = getISTToday();

    let conditions = [`DATE(created_at AT TIME ZONE 'Asia/Kolkata') = $1::date`];
    let params = [todayIST];
    let paramIndex = 2;

    if (status) {
      conditions.push(`LOWER(status) = $${paramIndex}`);
      params.push(status.toLowerCase());
      paramIndex++;
    }
    if (city) {
      conditions.push(`LOWER(city) ILIKE $${paramIndex}`);
      params.push(`%${city.toLowerCase()}%`);
      paramIndex++;
    }
    if (service) {
      conditions.push(`LOWER(service) ILIKE $${paramIndex}`);
      params.push(`%${service.toLowerCase()}%`);
      paramIndex++;
    }
    if (search) {
      conditions.push(`(LOWER(customer_name) ILIKE $${paramIndex} OR LOWER(email) ILIKE $${paramIndex} OR mobile ILIKE $${paramIndex})`);
      params.push(`%${search.toLowerCase()}%`);
      paramIndex++;
    }

    const query = `SELECT * FROM bookings WHERE ${conditions.join(' AND ')} ORDER BY created_at DESC`;
    const result = await pool.query(query, params);
    const bookings = result.rows;

    const stats = {
      total: bookings.length,
      pending: bookings.filter(b => b.status?.toLowerCase() === 'pending').length,
      accepted: bookings.filter(b => b.status?.toLowerCase() === 'accepted').length,
      completed: bookings.filter(b => b.status?.toLowerCase() === 'completed').length,
      cancelled: bookings.filter(b => b.status?.toLowerCase() === 'cancelled' || b.status?.toLowerCase() === 'rejected').length,
    };

    return res.status(200).json({ success: true, stats, data: bookings });
  } catch (err) {
    console.error('Manager getTodayBookings Error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─── GET /api/manager/bookings/date ──────────────────────────────────────────
export const getBookingsByDate = async (req, res) => {
  try {
    const { date, month, year, search, status, city, service, page = 1, limit = 20, sort = 'created_at', order = 'DESC' } = req.query;

    let conditions = [];
    let params = [];
    let paramIndex = 1;

    if (date) {
      conditions.push(`DATE(created_at AT TIME ZONE 'Asia/Kolkata') = $${paramIndex}`);
      params.push(date);
      paramIndex++;
    } else if (month && year) {
      conditions.push(`EXTRACT(MONTH FROM created_at AT TIME ZONE 'Asia/Kolkata') = $${paramIndex}`);
      params.push(parseInt(month));
      paramIndex++;
      conditions.push(`EXTRACT(YEAR FROM created_at AT TIME ZONE 'Asia/Kolkata') = $${paramIndex}`);
      params.push(parseInt(year));
      paramIndex++;
    } else if (year) {
      conditions.push(`EXTRACT(YEAR FROM created_at AT TIME ZONE 'Asia/Kolkata') = $${paramIndex}`);
      params.push(parseInt(year));
      paramIndex++;
    }

    if (status) {
      conditions.push(`LOWER(status) = $${paramIndex}`);
      params.push(status.toLowerCase());
      paramIndex++;
    }
    if (city) {
      conditions.push(`LOWER(city) ILIKE $${paramIndex}`);
      params.push(`%${city.toLowerCase()}%`);
      paramIndex++;
    }
    if (service) {
      conditions.push(`LOWER(service) ILIKE $${paramIndex}`);
      params.push(`%${service.toLowerCase()}%`);
      paramIndex++;
    }
    if (search) {
      conditions.push(`(LOWER(customer_name) ILIKE $${paramIndex} OR LOWER(email) ILIKE $${paramIndex} OR mobile ILIKE $${paramIndex})`);
      params.push(`%${search.toLowerCase()}%`);
      paramIndex++;
    }

    const allowedSorts = ['created_at', 'customer_name', 'status', 'city', 'service'];
    const sortCol = allowedSorts.includes(sort) ? sort : 'created_at';
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const countResult = await pool.query(`SELECT COUNT(*) FROM bookings ${whereClause}`, params);
    const total = parseInt(countResult.rows[0].count);

    params.push(parseInt(limit));
    params.push(offset);

    const result = await pool.query(
      `SELECT * FROM bookings ${whereClause} ORDER BY ${sortCol} ${sortOrder} LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      params
    );

    return res.status(200).json({
      success: true,
      data: result.rows,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) }
    });
  } catch (err) {
    console.error('Manager getBookingsByDate Error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─── PUT /api/manager/bookings/:id/status ────────────────────────────────────
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ['pending', 'accepted', 'completed', 'cancelled', 'rejected'];
    if (!status || !allowed.includes(status.toLowerCase())) {
      return res.status(400).json({ success: false, message: `Status must be one of: ${allowed.join(', ')}` });
    }

    const result = await pool.query(
      `UPDATE bookings SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    return res.status(200).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Manager updateBookingStatus Error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};
