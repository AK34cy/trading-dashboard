import React from "react";

function NewPositionForm({ newPosition, setNewPosition, addPosition }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPosition({
      ...newPosition,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addPosition();
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex gap-2 flex-wrap">
        <input
          type="text"
          name="symbol"
          value={newPosition.symbol}
          onChange={handleChange}
          placeholder="Актив"
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="entry"
          value={newPosition.entry}
          onChange={handleChange}
          placeholder="Вход"
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="stopLoss"
          value={newPosition.stopLoss}
          onChange={handleChange}
          placeholder="Стоп"
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="riskPercent"
          value={newPosition.riskPercent}
          onChange={handleChange}
          placeholder="Риск %"
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="amount"
          value={newPosition.amount}
          onChange={handleChange}
          placeholder="Сумма (в валюте)"
          className="border p-2 rounded"
          step="any"
        />
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
