import pool from './config/db.js';

async function updateSchema() {
  try {
    const res = await pool.query('SELECT COUNT(*) FROM pricing');
    console.log(`Current pricing rows: ${res.rows[0].count}`);
    
    // We will drop and recreate to match exactly
    await pool.query(`DROP TABLE IF EXISTS pricing`);
    
    await pool.query(`
      CREATE TABLE pricing (
        id SERIAL PRIMARY KEY,
        type VARCHAR(100) NOT NULL,
        category VARCHAR(100) NOT NULL,
        original_price NUMERIC(10,2) NOT NULL,
        discount_price NUMERIC(10,2) NOT NULL,
        is_highlight BOOLEAN DEFAULT false,
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        service_name VARCHAR(100)
      )
    `);
    
    console.log('Pricing table updated to new schema.');
  } catch(e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}

updateSchema();
