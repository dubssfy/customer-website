import pool from "../config/db.js";

// ─── GET /api/pricing ─────────────────────────────────────────────────────────
// Public endpoint — used by customer website
export const getPricing = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, type, category, service_name, original_price, discount_price,
             is_highlight, display_order, created_at, updated_at
      FROM pricing
      WHERE service_name NOT IN ('Hotel Linen', 'Guest Laundry')
      ORDER BY category, type, display_order, id
    `);

    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('getPricing Error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch pricing data.' });
  }
};

// ─── PUT /api/pricing/:id ─────────────────────────────────────────────────────
// Legacy public update (kept for backward compat but admin should use /api/admin/prices/:id)
export const updatePricing = async (req, res) => {
  const { id } = req.params;
  const { original_price, discount_price, is_highlight, type, category, service_name, display_order } = req.body;

  try {
    const result = await pool.query(
      `UPDATE pricing
       SET
         original_price = COALESCE($1, original_price),
         discount_price = COALESCE($2, discount_price),
         is_highlight   = COALESCE($3, is_highlight),
         type           = COALESCE($4, type),
         category       = COALESCE($5, category),
         service_name   = COALESCE($6, service_name),
         display_order  = COALESCE($7, display_order),
         updated_at     = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING *`,
      [
        original_price != null ? parseFloat(original_price) : null,
        discount_price != null ? parseFloat(discount_price) : null,
        is_highlight != null ? is_highlight : null,
        type || null,
        category || null,
        service_name || null,
        display_order != null ? parseInt(display_order) : null,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Price item not found.' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('updatePricing Error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to update pricing data.' });
  }
};