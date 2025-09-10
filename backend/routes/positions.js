import express from "express";

const router = express.Router();

// временные данные для теста
let positions = [
  {
    id: 1,
    symbol: "BTCUSDT",
    entry: 30000,
    stopLoss: 29500,
    riskPercent: 2,
    volume: 0.01,
    potentialLoss: 50,
  },
  {
    id: 2,
    symbol: "ETHUSDT",
    entry: 1800,
    stopLoss: 1750,
    riskPercent: 2,
    volume: 0.5,
    potentialLoss: 25,
  },
];

// GET /positions — вернуть все позиции
router.get("/", (req, res) => {
  res.json(positions);
});

// POST /positions — добавить новую позицию
router.post("/", (req, res) => {
  const newPos = req.body;
  newPos.id = positions.length ? positions[positions.length - 1].id + 1 : 1;
  positions.push(newPos);
  res.status(201).json(newPos);
});

// DELETE /positions/:id — удалить позицию
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  positions = positions.filter(pos => pos.id !== id);
  res.json({ message: "Удалено" });
});

export default router;
