// backend/controllers/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../DB/db.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

/* ✅ สมัครสมาชิก */
export async function register(req, res) {
  try {
    const { name, lastname, email, password, role } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "กรอกข้อมูลไม่ครบ" });

    // เช็กว่าอีเมลนี้เคยใช้หรือยัง
    const [exist] = await pool.query("SELECT * FROM register WHERE email = ?", [email]);
    if (exist.length > 0)
      return res.status(400).json({ message: "อีเมลนี้ถูกใช้แล้ว" });

    const hash = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO register (name, lastname, email, password, role) VALUES (?, ?, ?, ?, ?)",
      [name, lastname || "", email, hash, role || "user"]
    );

    res.json({ message: "สมัครสมาชิกสำเร็จ" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}

/* ✅ ล็อกอิน */
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "กรอกอีเมลและรหัสผ่าน" });

    const [rows] = await pool.query("SELECT * FROM register WHERE email = ?", [email]);
    if (rows.length === 0)
      return res.status(404).json({ message: "ไม่พบผู้ใช้งาน" });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ message: "รหัสผ่านไม่ถูกต้อง" });

    // สร้าง token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({ message: "เข้าสู่ระบบสำเร็จ", token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

/* ✅ ดึงข้อมูลผู้ใช้ (หลังล็อกอิน) */
export async function me(req, res) {
  try {
    const [rows] = await pool.query("SELECT id, name, lastname, email, role FROM register WHERE id = ?", [req.user.id]);
    if (rows.length === 0)
      return res.status(404).json({ message: "ไม่พบข้อมูลผู้ใช้" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
