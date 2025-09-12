import express from "express";
import pool from "../db.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// GET пользователя по ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT id, email, name, avatar, google_id, created_at FROM users WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Ошибка при получении пользователя:", err.message);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// POST регистрация нового пользователя
router.post("/register", async (req, res) => {
  try {
    const { email, name, password } = req.body;
    const hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (email, name, password_hash) VALUES ($1, $2, $3) RETURNING id, email, name, avatar, created_at",
      [email, name, hash]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Ошибка при регистрации:", err.message);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

export default router;
