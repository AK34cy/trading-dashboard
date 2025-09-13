import React, { useState } from "react";

function NewPositionForm({ add }) {
  const [newPosition, setNewPosition] = useState({
    symbol: "",
    entry: "",
    stop_loss: "",
    risk_percent: "",
    amount: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPosition((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // вызываем add из хука usePositions, который принимает токен внутри
    const added = await add(newPosition);
    if (added) {
      // сбрасываем форму
      setNewPosition({
        symbol: "",
        entry: "",
        stop_loss: "",
        risk_percent: "",
        amount: "",
      });
    }
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
          required
        />
        <input
          type="number"
          name="entry"
          value={newPosition.entry}
          onChange={handleChange}
          placeholder="Вход"
          className="border p-2 rounded"
          step="any"
          required
        />
        <input
          type="number"
          name="stop_loss"
          value={newPosition.stop_loss}
          onChange={handleChange}
          placeholder="Стоп"
          className="border p-2 rounded"
          step="any"
        />
        <input
          type="number"
          name="risk_percent"
          value={newPosition.risk_percent}
          onChange={handleChange}
          placeholder="Риск %"
          className="border p-2 rounded"
          step="any"
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
