// db.js
const mysql = require("mysql2");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "user_db",
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test the connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Error connecting to MySQL:", err.message);
  } else {
    console.log(`✅ Connected to MySQL database: ${process.env.DB_NAME || "user_db"}`);
    connection.release();
  }
});

module.exports = pool.promise();
