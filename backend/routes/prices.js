// backend/routes/prices.js
import express from "express";
import fetch from "node-fetch";

const router = express.Router();

let cachedPrices = null;
let lastFetch = 0;

router.get("/", async (req, res) => {
  const now = Date.now();

  // Обновляем цены не чаще, чем раз в 10 секунд
  if (!cachedPrices || now - lastFetch > 10000) {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd"
      );
      const data = await response.json();
      cachedPrices = { BTC: data.bitcoin.usd, ETH: data.ethereum.usd };
      lastFetch = now;
    } catch (err) {
      console.error("Ошибка при получении цен:", err);
      if (!cachedPrices) {
        return res.status(500).json({ error: "Невозможно получить цены" });
      }
    }
  }

  res.json(cachedPrices);
});

export default router;
