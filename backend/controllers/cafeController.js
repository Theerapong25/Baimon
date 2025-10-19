import { pool } from "../DB/db.js";

export async function createCafe(req, res) {
  const { name, address } = req.body || {};
  if (!name) return res.status(400).json({ message: "name required" });
  const [r] = await pool.query(
    "INSERT INTO cafe (name, address) VALUES (?, ?)",
    [name, address || null]
  );
  res.status(201).json({ cafe_id: r.insertId });
}
export async function updateCafe(req, res) {
  try {
    const { id } = req.params;
    const { name, address } = req.body || {};
    const [result] = await pool.query(
      "UPDATE cafe SET name = COALESCE(?, name), address = COALESCE(?, address) WHERE id = ?",
      [name, address, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Cafe not found" });
    }
    res.json({ message: "Cafe updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ลบข้อมูลร้านกาแฟ
export const deleteCafe = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM cafe WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Cafe not found" });
    }

    res.json({ message: "Cafe deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export async function listCafes(req, res) {
  const [rows] = await pool.query(
    "SELECT cafe_id, name, address FROM cafe ORDER BY cafe_id DESC"
  );
  res.json(rows);
  
}
