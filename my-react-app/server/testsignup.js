import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from './config/db.js';
import dotenv from 'dotenv';
dotenv.config();

async function testSignup() {
  try {
    const full_name = "Soham Satish Kokane";
    const email = "sohamkokane2103@gmail.com";
    const phone = "755842923";
    const password = "password123";
    const role = "manager";

    const password_hash = await bcrypt.hash(password, 12);
    console.log("Bcrypt hash generated successfully.");

    console.log("Inserting to DB...");
    const result = await pool.query(
      `INSERT INTO admin_users (full_name, email, phone, password_hash, role)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, full_name, email, phone, role, created_at`,
      [full_name, email.toLowerCase(), phone, password_hash, role]
    );
    console.log("Insert success! ID:", result.rows[0].id);

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    console.log("JWT sign success! Token length:", token.length);

    // clean up
    await pool.query("DELETE FROM admin_users WHERE id = $1", [user.id]);
    console.log("Cleanup success.");
  } catch (err) {
    console.error("Signup test failed with error:", err);
  } finally {
    process.exit(0);
  }
}

testSignup();
