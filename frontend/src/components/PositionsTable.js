import React from "react";

function PositionsTable({ positions, prices, removePosition }) {
  return (
    <table className="w-full border-collapse border border-gray-300">
      <thead>
        <tr>
          <th className="border px-2 py-1">ID</th>
          <th className="border px-2 py-1">Актив</th>
          <th className="border px-2 py-1">Вход</th>
          <th className="border px-2 py-1">Стоп</th>
          <th className="border px-2 py-1">Риск %</th>
          <th className="border px-2 py-1">Сумма</th>
          <th className="border px-2 py-1">Потенциальная прибыль</th>
          <th className="border px-2 py-1">Действие</th>
        </tr>
      </thead>
      <tbody>
        {positions.map((pos) => {
          const currentPrice = prices[pos.symbol] || 0;
          const potentialProfit = pos.amount * (currentPrice - pos.entry);
          return (
            <tr key={pos.id}>
              <td className="border px-2 py-1">{pos.id}</td>
              <td className="border px-2 py-1">{pos.symbol}</td>
              <td className="border px-2 py-1">{pos.entry}</td>
              <td className="border px-2 py-1">{pos.stop_loss}</td>
              <td className="border px-2 py-1">{pos.risk_percent}</td>
              <td className="border px-2 py-1">{pos.amount}</td>
              <td className="border px-2 py-1">{potentialProfit.toFixed(2)}</td>
              <td className="border px-2 py-1">
                <button
                  onClick={() => removePosition(pos.id)}
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
