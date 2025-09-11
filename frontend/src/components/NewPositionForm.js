import React from "react";

export default function NewPositionForm({ newPosition, setNewPosition, addPosition }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPosition((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addPosition(newPosition);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded bg-gray-50">
      <div>
        <label className="block text-sm font-medium">Актив</label>
        <input
          type="text"
          name="symbol"
          value={newPosition.symbol}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Цена входа (опц.)</label>
        <input
          type="number"
          step="0.01"
          name="entry"
          value={newPosition.entry}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Стоп-лосс</label>
        <input
          type="number"
          step="0.01"
          name="stopLoss"
          value={newPosition.stopLoss}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Риск (%)</label>
        <input
          type="number"
          step="0.1"
          name="riskPercent"
          value={newPosition.riskPercent}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Добавить позицию
      </button>
    </form>
  );
}
