// routes/menus.js
import { Router } from "express";
import { listMenus, createMenu, updateMenu, deleteMenu } from "../controllers/menuController.js";
import { authRequired} from '../middlewares/authRequired.js';
import { adminOnly } from '../middlewares/adminOnly.js';

const r = Router();

// แสดงเมนูทั้งหมด หรือ filter ด้วย cafe_id (GET /menus?cafe_id=1)
r.get("/", listMenus);

// เพิ่มเมนู (เฉพาะ admin)
r.post("/", authRequired, adminOnly, createMenu);

// แก้ไขเมนู (เฉพาะ admin)
r.put("/:id", authRequired, adminOnly, updateMenu);

// ลบเมนู (เฉพาะ admin)
r.delete("/:id", authRequired, adminOnly, deleteMenu);

export default r;
