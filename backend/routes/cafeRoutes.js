import { Router } from "express";
import { listCafes, createCafe } from "../controllers/cafeController.js";
// import { authRequired, adminOnly } from "../middlewares/authRequired.js";

const r = Router();

r.get("/", listCafes);
// ชั่วคราวเพื่อทดสอบ ตัด auth ออกก่อน
r.post("/", createCafe);

export default r;
