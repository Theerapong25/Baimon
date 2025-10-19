// backend/DB/db.js
import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "357951",
  database: process.env.DB_NAME || "cafeverse",
  waitForConnections: true,
  connectionLimit: 10
});

export async function assertDb() {
  const [rows] = await pool.query("SELECT 1 AS ok");
  return rows?.[0]?.ok === 1;
}
