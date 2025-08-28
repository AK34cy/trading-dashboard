import React from "react";

export default function NewPositionForm({
  newPosition,
  setNewPosition,
  addPosition,
}) {
  const handleChange = (e) => {
    setNewPosition({ ...newPosition, [e.target.name]: e.target.value });
  };

  return (
    <div className="mb-6">
      <h2 className="font-bold mb-2">Новая позиция</h2>
      <div className="grid grid-cols-5 gap-2 mb-2">
        <input
          type="text"
          name="symbol"
          placeholder="Актив (BTC/ETH)"
          value={newPosition.symbol}
          onChange={handleChange}
          className="border px-2 py-1"
        />
        <input
          type="number"
          name="entry"
          placeholder="Цена входа (необяз.)"
          value={newPosition.entry}
          onChange={handleChange}
          className="border px-2 py-1"
        />
        <input
          type="number"
          name="stopLoss"
          placeholder="Стоп-лосс"
          value={newPosition.stopLoss}
          onChange={handleChange}
          className="border px-2 py-1"
        />
        <input
          type="number"
          name="riskPercent"
          placeholder="Риск %"
          value={newPosition.riskPercent}
          onChange={handleChange}
          className="border px-2 py-1"
        />
        <button
          onClick={addPosition}
          className="bg-blue-500 text-white px-4 py-1 rounded"
        >
          Добавить
        </button>
      </div>
    </div>
  );
}
