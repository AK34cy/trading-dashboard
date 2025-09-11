import express from "express";
import db from "../db.js";

const router = express.Router();

// Получение всех позиций
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM positions ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка сервера при получении позиций" });
  }
});

// Получение позиции по ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query("SELECT * FROM positions WHERE id=$1", [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Позиция не найдена" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка сервера при получении позиции" });
  }
});

// Добавление новой позиции
router.post("/", async (req, res) => {
  const { symbol, entry, stopLoss, riskPercent, volume, potentialLoss } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO positions(symbol, entry, stop_loss, risk_percent, volume, potential_loss) VALUES($1,$2,$3,$4,$5,$6) RETURNING *",
      [symbol, entry, stopLoss, riskPercent, volume, potentialLoss]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка сервера при добавлении позиции" });
  }
});

// Обновление позиции по ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { symbol, entry, stopLoss, riskPercent, volume, potentialLoss } = req.body;
  try {
    const result = await db.query(
      `UPDATE positions 
       SET symbol=$1, entry=$2, stop_loss=$3, risk_percent=$4, volume=$5, potential_loss=$6 
       WHERE id=$7 
       RETURNING *`,
      [symbol, entry, stopLoss, riskPercent, volume, potentialLoss, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Позиция не найдена" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка сервера при обновлении позиции" });
  }
});

// Удаление позиции по ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query("DELETE FROM positions WHERE id=$1 RETURNING *", [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Позиция не найдена" });
    res.json({ message: "Позиция удалена", position: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка сервера при удалении позиции" });
  }
});

export default router;
