import express from "express";
import pool from "../db.js";

const router = express.Router();

// --- Получить все позиции ---
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM positions ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Ошибка сервера");
  }
});

// --- Получить позиции конкретного пользователя ---
router.get("/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const result = await pool.query(
      "SELECT * FROM positions WHERE user_id = $1 ORDER BY created_at DESC",
      [user_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Ошибка сервера");
  }
});

// --- Добавить новую позицию ---
router.post("/", async (req, res) => {
  try {
    const { user_id, symbol, entry, stop_loss, risk_percent, volume, potential_loss } = req.body;
    const result = await pool.query(
      `INSERT INTO positions 
      (user_id, symbol, entry, stop_loss, risk_percent, volume, potential_loss)
      VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [user_id, symbol, entry, stop_loss, risk_percent, volume, potential_loss]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Ошибка сервера");
  }
});

// --- Обновить позицию ---
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { symbol, entry, stop_loss, risk_percent, volume, potential_loss } = req.body;
    const result = await pool.query(
      `UPDATE positions SET
      symbol=$1, entry=$2, stop_loss=$3, risk_percent=$4, volume=$5, potential_loss=$6
      WHERE id=$7 RETURNING *`,
      [symbol, entry, stop_loss, risk_percent, volume, potential_loss, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Ошибка сервера");
  }
});

// --- Удалить позицию ---
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM positions WHERE id=$1", [id]);
    res.json({ message: "Позиция удалена" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Ошибка сервера");
  }
});

export default router;
