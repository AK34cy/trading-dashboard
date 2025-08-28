import React, { useState, useEffect } from "react";

function TradingDashboard() {
  // Основные состояния
  const [deposit, setDeposit] = useState(10000);
  const [positions, setPositions] = useState([]);
  const [newPosition, setNewPosition] = useState({
    symbol: "",
    entry: "",
    stopLoss: "",
    riskPercent: "",
  });
  const [prices, setPrices] = useState({});

  // Свободный капитал
  const usedCapital = positions.reduce((acc, pos) => acc + pos.potentialLoss, 0);
  const freeCapital = deposit - usedCapital;

  // Получение курсов онлайн (CoinGecko)
  useEffect(() => {
    const fetchPrices = () => {
      fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd"
      )
        .then((res) => res.json())
        .then((data) => {
          setPrices({
            BTC: data.bitcoin.usd,
            ETH: data.ethereum.usd,
          });
        })
        .catch(console.error);
    };

    fetchPrices(); // первый вызов
    const interval = setInterval(fetchPrices, 10000); // обновление каждые 10 секунд
    return () => clearInterval(interval);
  }, []);

  // Обновление полей новой позиции
  const handleNewPositionChange = (e) => {
    setNewPosition({ ...newPosition, [e.target.name]: e.target.value });
  };

  // Добавление новой позиции
  const addPosition = () => {
    if (!newPosition.symbol || !newPosition.stopLoss || !newPosition.riskPercent) return;

    const symbol = newPosition.symbol.toUpperCase();
    const entry = prices[symbol] || parseFloat(newPosition.entry);
    const stopLoss = parseFloat(newPosition.stopLoss);
    const riskPercent = parseFloat(newPosition.riskPercent);

    const riskAmount = (riskPercent / 100) * deposit;
    const volume = riskAmount / Math.abs(entry - stopLoss);
    const potentialLoss = riskAmount;

    const position = {
      symbol,
      entry,
      stopLoss,
      riskPercent,
      volume,
      potentialLoss,
    };

    setPositions([...positions, position]);
    setNewPosition({ symbol: "", entry: "", stopLoss: "", riskPercent: "" });
  };

  // Удаление позиции
  const removePosition = (index) => {
    const updated = positions.filter((_, i) => i !== index);
    setPositions(updated);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto font-sans">
      <h1 className="text-2xl font-bold mb-4">Trading Dashboard</h1>

      {/* Панель депозита */}
      <div className="mb-6">
        <label className="mr-2">Депозит:</label>
        <input
          type="number"
          value={deposit}
          onChange={(e) => setDeposit(parseFloat(e.target.value))}
          className="border px-2 py-1 w-32"
        />
        <span className="ml-4">Свободный капитал: ${freeCapital.toFixed(2)}</span>
      </div>

      {/* Таблица открытых позиций */}
      <table className="w-full border border-gray-300 mb-6">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">Актив</th>
            <th className="border px-2 py-1">Цена входа</th>
            <th className="border px-2 py-1">Стоп-лосс</th>
            <th className="border px-2 py-1">Риск (%)</th>
            <th className="border px-2 py-1">Объём</th>
            <th className="border px-2 py-1">Курс USD</th>
            <th className="border px-2 py-1">Объём USD</th>
            <th className="border px-2 py-1">Потеря $</th>
            <th className="border px-2 py-1">Действия</th>
          </tr>
        </thead>
        <tbody>
          {positions.map((pos, index) => (
            <tr key={index}>
              <td className="border px-2 py-1">{pos.symbol}</td>
              <td className="border px-2 py-1">{pos.entry}</td>
              <td className="border px-2 py-1">{pos.stopLoss}</td>
              <td className="border px-2 py-1">{pos.riskPercent}%</td>
              <td className="border px-2 py-1">{pos.volume.toFixed(4)}</td>
              <td className="border px-2 py-1">${(prices[pos.symbol] || pos.entry).toFixed(2)}</td>
              <td className="border px-2 py-1">${(pos.volume * (prices[pos.symbol] || pos.entry)).toFixed(2)}</td>
              <td className="border px-2 py-1">{pos.potentialLoss.toFixed(2)}</td>
              <td className="border px-2 py-1">
                <button
                  onClick={() => removePosition(index)}
                  className="text-red-500"
                >
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Панель новой позиции */}
      <div className="mb-6">
        <h2 className="font-bold mb-2">Новая позиция</h2>
        <div className="grid grid-cols-5 gap-2 mb-2">
          <input
            type="text"
            name="symbol"
            placeholder="Актив (BTC/ETH)"
            value={newPosition.symbol}
            onChange={handleNewPositionChange}
            className="border px-2 py-1"
          />
          <input
            type="number"
            name="entry"
            placeholder="Цена входа (необяз.)"
            value={newPosition.entry}
            onChange={handleNewPositionChange}
            className="border px-2 py-1"
          />
          <input
            type="number"
            name="stopLoss"
            placeholder="Стоп-лосс"
            value={newPosition.stopLoss}
            onChange={handleNewPositionChange}
            className="border px-2 py-1"
          />
          <input
            type="number"
            name="riskPercent"
            placeholder="Риск %"
            value={newPosition.riskPercent}
            onChange={handleNewPositionChange}
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
    </div>
  );
}

export default TradingDashboard;
