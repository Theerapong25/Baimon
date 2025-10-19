import { pool } from '../DB/db.js';

export async function listReviews(req, res, next) {
  try {
    const cafe_id = Number(req.params.cafe_id);
    const [rows] = await pool.query(
      `SELECT r.review_id, r.cafe_id, r.user_id, u.name, r.rating, r.comment, r.created_at
       FROM reviews r LEFT JOIN register u ON u.id = r.user_id
       WHERE r.cafe_id=? ORDER BY r.created_at DESC`,
      [cafe_id]
    );
    res.json(rows);
  } catch (e) { next(e); }
}

export async function createReview(req, res, next) {
  try {
    const { cafe_id, rating, comment } = req.body || {};
    if (!cafe_id || rating == null) return res.status(400).json({ message: 'cafe_id และ rating จำเป็น' });
    const user_id = req.user.user_id; // จาก JWT
    const [r] = await pool.query(
      'INSERT INTO reviews (cafe_id, user_id, rating, comment) VALUES (?,?,?,?)',
      [cafe_id, user_id, rating, comment || '']
    );
    res.status(201).json({ review_id: r.insertId });
  } catch (e) { next(e); }
}

export async function deleteReview(req, res, next) {
  try {
    const review_id = Number(req.params.review_id);
    const user_id = req.user.user_id;
    const [r] = await pool.query('DELETE FROM reviews WHERE review_id=? AND user_id=?', [review_id, user_id]);
    if (!r.affectedRows) return res.status(403).json({ message: 'ไม่มีสิทธิ์ลบหรือไม่พบรีวิว' });
    res.json({ ok: true });
  } catch (e) { next(e); }
}
