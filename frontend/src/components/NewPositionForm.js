// frontend/src/components/NewPositionForm.js
import React, { useState, useEffect } from "react";

function NewPositionForm({ add, prices }) {
  const [newPosition, setNewPosition] = useState({
    entry: "",
    stop_loss: "",
    take_profit: "",
    risk_percent: 2, // по умолчанию 2%
  });

  const [calc, setCalc] = useState({
    volume_money: 0,
    volume_qty: 0,
    current_price: 0,
    pnl: 0,
  });

  // Берём цену BTC (можно расширить потом на ETH и др.)
  const currentPrice = prices?.BTC || 0;

  useEffect(() => {
    const { entry, stop_loss, take_profit, risk_percent } = newPosition;
    if (!entry || !stop_loss || !risk_percent) {
      setCalc((prev) => ({ ...prev, current_price: currentPrice, pnl: 0 }));
      return;
    }

    const riskAmount = 1000 * (risk_percent / 100); // пока фиксированный депозит 1000 USDT
    const stopDistance = Math.abs(entry - stop_loss);

    let volume_qty = 0;
    let volume_money = 0;
    let pnl = 0;

    if (stopDistance > 0) {
      volume_qty = riskAmount / stopDistance;
      volume_money = volume_qty * entry;
    }

    if (take_profit) {
      pnl = (take_profit - entry) * volume_qty;
    }

    setCalc({
      volume_money: volume_money.toFixed(2),
      volume_qty: volume_qty.toFixed(4),
      current_price: currentPrice,
      pnl: pnl.toFixed(2),
    });
  }, [newPosition, currentPrice]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPosition((prev) => ({
      ...prev,
      [name]: parseFloat(value) || "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const added = await add({
      ...newPosition,
      volume_money: parseFloat(calc.volume_money),
      volume_qty: parseFloat(calc.volume_qty),
    });

    if (added) {
      setNewPosition({
        entry: "",
        stop_loss: "",
        take_profit: "",
        risk_percent: 2,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="flex gap-2 items-center flex-wrap">
        <input
          type="number"
          name="entry"
          value={newPosition.entry}
          onChange={handleChange}
          placeholder="Вход"
          className="w-24 border p-2 rounded"
          step="any"
          required
        />
        <input
          type="number"
          name="stop_loss"
          value={newPosition.stop_loss}
          onChange={handleChange}
          placeholder="СЛ"
          className="w-24 border p-2 rounded"
          step="any"
          required
        />
        <input
          type="number"
          name="take_profit"
          value={newPosition.take_profit}
          onChange={handleChange}
          placeholder="ТП"
          className="w-24 border p-2 rounded"
          step="any"
        />
        <input
          type="number"
          name="risk_percent"
          value={newPosition.risk_percent}
          onChange={handleChange}
          placeholder="Риск %"
          className="w-20 border p-2 rounded"
          step="any"
        />

        {/* расчётные значения */}
        <span className="w-28 text-sm text-gray-700">
          ${calc.volume_money}
        </span>
        <span className="w-28 text-sm text-gray-700">
          {calc.volume_qty}
        </span>
        <span className="w-20 text-sm text-gray-700">
          {calc.current_price}
        </span>
        <span
          className={`w-28 text-sm font-bold ${
            calc.pnl >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {calc.pnl}
        </span>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Добавить
        </button>
      </div>
    </form>
  );
}

export default NewPositionForm;
