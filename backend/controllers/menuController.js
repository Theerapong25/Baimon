// controllers/menuController.js
import { pool } from "../DB/db.js";

/* ===== ดึงเมนูทั้งหมด หรือเฉพาะร้าน ===== */
export async function listMenus(req, res, next) {
  try {
    const cafe_id = req.query.cafe_id;
    let sql = "SELECT * FROM menu_cafe";
    const params = [];

    if (cafe_id) {
      sql += " WHERE cafe_id = ?";
      params.push(cafe_id);
    }

    sql += " ORDER BY menu_id DESC";
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (e) {
    next(e);
  }
}

/* ===== เพิ่มเมนูใหม่ ===== */
export async function createMenu(req, res, next) {
  try {
    const { cafe_id, name, type, price, image_url } = req.body || {};
    if (!cafe_id || !name || !price)
      return res.status(400).json({ message: "กรอกข้อมูลให้ครบ cafe_id, name, price" });

    const [r] = await pool.query(
      "INSERT INTO menu_cafe (cafe_id, name, type, price, image_url) VALUES (?,?,?,?,?)",
      [cafe_id, name, type || null, price, image_url || null]
    );

    res.status(201).json({ menu_id: r.insertId });
  } catch (e) {
    next(e);
  }
}

/* ===== แก้ไขข้อมูลเมนู ===== */
export async function updateMenu(req, res, next) {
  try {
    const menu_id = Number(req.params.id);
    const { name, type, price, image_url } = req.body || {};

    const [r] = await pool.query(
      `UPDATE menu_cafe
       SET name = COALESCE(?, name),
           type = COALESCE(?, type),
           price = COALESCE(?, price),
           image_url = COALESCE(?, image_url)
       WHERE menu_id = ?`,
      [name, type, price, image_url, menu_id]
    );

    if (!r.affectedRows)
      return res.status(404).json({ message: "ไม่พบเมนูที่ต้องการแก้ไข" });

    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
}

/* ===== ลบเมนู ===== */
export async function deleteMenu(req, res, next) {
  try {
    const menu_id = Number(req.params.id);
    const [r] = await pool.query("DELETE FROM menu_cafe WHERE menu_id = ?", [menu_id]);
    if (!r.affectedRows)
      return res.status(404).json({ message: "ไม่พบเมนูนี้" });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
}
