import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { assertDb } from "./backend/DB/db.js";   // ✅ ตรงนี้ชี้ไป backend/DB/db.js

// โหลด .env
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ import routes ทั้งหมดจาก backend/routes/
import authRouter from "./backend/routes/auth.js";
import cafeRouter from "./backend/routes/cafes.js";
import menuRouter from "./backend/routes/menus.js";
import reviewRouter from "./backend/routes/reviews.js";

// เชื่อม routes เข้ากับ app
app.use("/auth", authRouter);
app.use("/cafes", cafeRouter);
app.use("/menus", menuRouter);
app.use("/reviews", reviewRouter);


// หน้า test
app.get("/", (req, res) => {
  res.send("✅ API server is running and DB connected!");
});

// เริ่มรันเซิร์ฟเวอร์
const PORT = process.env.PORT || 5001;
assertDb()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`✅ Server running at http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  });
