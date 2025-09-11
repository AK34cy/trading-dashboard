import React from "react";
import { getPositions, addPosition, updatePosition, deletePosition } from "../api/api";

export default function PositionsTable({ positions, prices, removePosition }) {
  return (
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
            <td className="border px-2 py-1">
              ${(prices[pos.symbol] || pos.entry).toFixed(2)}
            </td>
            <td className="border px-2 py-1">
              ${(pos.volume * (prices[pos.symbol] || pos.entry)).toFixed(2)}
            </td>
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
  );
}
