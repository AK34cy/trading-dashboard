// backend/routes/positions.js
import express from "express";
import pool from "../db.js";

const router = express.Router();

// GET все позиции пользователя
router.get("/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM positions WHERE user_id = $1 ORDER BY id ASC",
      [user_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Ошибка при получении позиций:", err.message);
    res.status(500).json({ error: "Ошибка сервера при получении позиций" });
  }
});

// POST добавить новую позицию
router.post("/", async (req, res) => {
  try {
    const {
      user_id,
      symbol,
      entry,
      stop_loss,
      risk_percent,
      amount,
      take_profit,
      leverage,
      status,
      closed_at,
      notes,
      order_type,
      exchange,
      fee_open,
      fee_close,
      fee_funding,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO positions
        (user_id, symbol, entry, stop_loss, risk_percent, amount,
         take_profit, leverage, status, closed_at, notes, order_type, exchange,
         fee_open, fee_close, fee_funding)
       VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
       RETURNING *`,
      [
        user_id,
        symbol,
        entry,
        stop_loss,
        risk_percent,
        amount,
        take_profit,
        leverage,
        status || "open",
        closed_at,
        notes,
        order_type,
        exchange,
        fee_open,
        fee_close,
        fee_funding,
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Ошибка при добавлении позиции:", err.message);
    res.status(500).json({ error: "Ошибка сервера при добавлении позиции" });
  }
});

// PUT обновить позицию
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const fields = req.body;
    const keys = Object.keys(fields);
    const values = Object.values(fields);

    if (keys.length === 0) {
      return res.status(400).json({ error: "Нет данных для обновления" });
    }

    const setClause = keys.map((key, idx) => `${key} = $${idx + 1}`).join(", ");

    const result = await pool.query(
      `UPDATE positions SET ${setClause} WHERE id = $${
        keys.length + 1
      } RETURNING *`,
      [...values, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Позиция не найдена" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Ошибка при обновлении позиции:", err.message);
    res.status(500).json({ error: "Ошибка сервера при обновлении позиции" });
  }
});

// DELETE удалить позицию
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM positions WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Позиция не найдена" });
    }

    res.json({ message: "Позиция удалена", deleted: result.rows[0] });
  } catch (err) {
    console.error("Ошибка при удалении позиции:", err.message);
    res.status(500).json({ error: "Ошибка сервера при удалении позиции" });
  }
});

export default router;
