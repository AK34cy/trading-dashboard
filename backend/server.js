import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import positionsRouter from "./routes/positions.js";
import pricesRouter from "./routes/prices.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());

// маршруты
app.use("/positions", positionsRouter);

// цены
app.use("/prices", pricesRouter);

// базовый маршрут для проверки
app.get("/", (req, res) => {
  res.send("Backend работает!");
});

// запуск сервера
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
