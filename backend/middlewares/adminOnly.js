
export function adminOnly(req, res, next) {
  if (!req.user) return res.status(401).json({ message: "กรุณาเข้าสู่ระบบก่อน" });
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "เฉพาะผู้ดูแลระบบเท่านั้น" });
  next();
}
