import pool from '../config/db.js';

export const initializeDatabase = async () => {
  try {
    // Admin/Manager users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(15) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'manager')),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // OTP table for password reset
    await pool.query(`
      CREATE TABLE IF NOT EXISTS password_otps (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        otp VARCHAR(6) NOT NULL,
        expires_at TIMESTAMPTZ NOT NULL,
        verified BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // Pricing table (ensure it exists with all needed columns)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pricing (
        id SERIAL PRIMARY KEY,
        type VARCHAR(100) NOT NULL DEFAULT 'General',
        category VARCHAR(100) NOT NULL,
        service_name VARCHAR(100) NOT NULL DEFAULT '',
        original_price NUMERIC(10,2) NOT NULL,
        discount_price NUMERIC(10,2) NOT NULL,
        is_highlight BOOLEAN DEFAULT false,
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Safe migrations — add columns if they don't already exist
    await pool.query(`ALTER TABLE pricing ADD COLUMN IF NOT EXISTS type VARCHAR(100) NOT NULL DEFAULT 'General'`);
    await pool.query(`ALTER TABLE pricing ADD COLUMN IF NOT EXISTS service_name VARCHAR(100) NOT NULL DEFAULT ''`);
    await pool.query(`ALTER TABLE pricing ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0`);
    await pool.query(`ALTER TABLE pricing ADD COLUMN IF NOT EXISTS is_highlight BOOLEAN DEFAULT false`);
    await pool.query(`ALTER TABLE pricing ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`);

    // Ensure bookings table has status and updated_at columns
    await pool.query(`
      ALTER TABLE bookings 
      ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Pending'
    `);
    await pool.query(`
      ALTER TABLE bookings 
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW()
    `);
    await pool.query(`
      ALTER TABLE bookings 
      ADD COLUMN IF NOT EXISTS map_link TEXT
    `);

    console.log('✅ Database tables initialized successfully');
  } catch (err) {
    console.error('❌ Database initialization error:', err.message);
  }
};
