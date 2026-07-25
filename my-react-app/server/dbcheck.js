import pool from './config/db.js';

async function check() {
  try {
    console.log("Checking DB Connection...");
    const res = await pool.query("SELECT NOW()");
    console.log("DB Time:", res.rows[0].now);

    console.log("Checking admin_users table...");
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'admin_users'
      );
    `);
    console.log("Table 'admin_users' exists:", tableCheck.rows[0].exists);

    const tables = await pool.query(`
      SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
    `);
    console.log("All tables:", tables.rows.map(r => r.table_name));

  } catch (err) {
    console.error("DB check failed:", err);
  } finally {
    process.exit(0);
  }
}

check();
