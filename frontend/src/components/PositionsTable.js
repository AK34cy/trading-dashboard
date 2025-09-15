// frontend/src/components/PositionsTable.js
import React, { useState, useEffect } from "react";

function PositionsTable({ positions = [], prices = {}, remove }) {
  const [newPosition, setNewPosition] = useState({
    symbol: "",
    entry: "",
    stop_loss: "",
    take_profit: "",
    risk_percent: 2, // дефолт
  });

  const [calc, setCalc] = useState({
    volume_money: 0,
    volume_qty: 0,
    current_price: 0,
    pnl: 0,
  });

  // пересчёт при изменении формы или цены
  useEffect(() => {
    const { entry, stop_loss, take_profit, risk_percent } = newPosition;
    const symbol = newPosition.symbol || "BTC";
    const currentPrice = prices[symbol] || 0;

    if (!entry || !stop_loss || !risk_percent) {
      setCalc({
        volume_money: 0,
        volume_qty: 0,
        current_price: currentPrice,
        pnl: 0,
      });
      return;
    }

    const riskAmount = 1000 * (risk_percent / 100); // условный депозит
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
  }, [newPosition, prices]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPosition((prev) => ({
      ...prev,
      [name]: value === "" ? "" : parseFloat(value) || value,
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
        symbol: "",
        entry: "",
        stop_loss: "",
        take_profit: "",
        risk_percent: 2,
      });
    }
  };

  return (
    <table className="w-full border-collapse border border-gray-300">
      <thead>
        <tr>
          <th className="border px-2 py-1">Монета</th>
          <th className="border px-2 py-1">Вход</th>
          <th className="border px-2 py-1">СЛ</th>
          <th className="border px-2 py-1">ТП</th>
          <th className="border px-2 py-1">Объем сумма</th>
          <th className="border px-2 py-1">Объем кол-во</th>
          <th className="border px-2 py-1">Тек. цена</th>
          <th className="border px-2 py-1">Прибыль/Убыток</th>
          <th className="border px-2 py-1">Риск %</th>
          <th className="border px-2 py-1">Действие</th>
        </tr>
      </thead>
      <tbody>
        {/* строка формы */}
        <tr>
          <td>
            <input
              type="text"
              name="symbol"
              value={newPosition.symbol}
              onChange={handleChange}
              placeholder="Монета"
              className="w-24 border p-1 rounded"
              required
            />
          </td>
          <td>
            <input
              type="number"
              name="entry"
              value={newPosition.entry}
              onChange={handleChange}
              placeholder="Вход"
              className="w-24 border p-1 rounded"
              step="any"
              required
            />
          </td>
          <td>
            <input
              type="number"
              name="stop_loss"
              value={newPosition.stop_loss}
              onChange={handleChange}
              placeholder="СЛ"
              className="w-24 border p-1 rounded"
              step="any"
              required
            />
          </td>
          <td>
            <input
              type="number"
              name="take_profit"
              value={newPosition.take_profit}
              onChange={handleChange}
              placeholder="ТП"
              className="w-24 border p-1 rounded"
              step="any"
            />
          </td>
          <td>{calc.volume_money}</td>
          <td>{calc.volume_qty}</td>
          <td>{calc.current_price}</td>
          <td
            className={`font-bold ${
              calc.pnl >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {calc.pnl}
          </td>
          <td>
            <input
              type="number"
              name="risk_percent"
              value={newPosition.risk_percent}
              onChange={handleChange}
              placeholder="Риск %"
              className="w-20 border p-1 rounded"
              step="any"
            />
          </td>
          <td>
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Добавить
            </button>
          </td>
        </tr>

        {/* существующие позиции */}
        {positions.map((pos) => {
          const currentPrice = prices[pos.symbol] || 0;
          const pnl = (currentPrice - pos.entry) * pos.volume_qty;

          return (
            <tr key={pos.id}>
              <td className="border px-2 py-1">{pos.symbol}</td>
              <td className="border px-2 py-1">{pos.entry}</td>
              <td className="border px-2 py-1">{pos.stop_loss}</td>
              <td className="border px-2 py-1">{pos.take_profit}</td>
              <td className="border px-2 py-1">{pos.volume_money}</td>
              <td className="border px-2 py-1">{pos.volume_qty}</td>
              <td className="border px-2 py-1">{currentPrice}</td>
              <td
                className={`border px-2 py-1 font-bold ${
                  pnl >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {pnl.toFixed(2)}
              </td>
              <td className="border px-2 py-1">{pos.risk_percent}</td>
              <td className="border px-2 py-1">
                <button
                  onClick={() => remove(pos.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Удалить
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default PositionsTable;
