import React from "react";

export default function HeaderPanel({
  btcPrice = 0,
  depositUSDT = 0,
  setDepositUSDT,
  depositBTC = 0,
  setDepositBTC,
  standardPosition = 0,
  setStandardPosition,
  availableVolume = 0,
}) {
  // Общий депозит в USDT (учитываем BTC через курс)
  const totalDepositUSDT = (depositUSDT || 0) + (depositBTC || 0) * (btcPrice || 0);

  return (
    <div className="mb-6 p-4 border rounded bg-gray-50">
      <h2 className="text-lg font-bold mb-2">Общие параметры</h2>

      <div className="grid grid-cols-5 gap-4 items-center">
        {/* Курс BTC */}
        <div>
          <label className="block text-sm font-medium">Курс BTC/USDT</label>
          <p className="mt-1 text-green-600 font-bold">${btcPrice.toFixed(2)}</p>
        </div>

        {/* Депозит USDT */}
        <div>
          <label className="block text-sm font-medium">Депозит USDT</label>
          <input
            type="number"
            value={depositUSDT}
            onChange={(e) => setDepositUSDT(parseFloat(e.target.value) || 0)}
            className="border px-2 py-1 w-full"
          />
        </div>

        {/* Депозит BTC */}
        <div>
          <label className="block text-sm font-medium">Депозит BTC</label>
          <input
            type="number"
            value={depositBTC}
            onChange={(e) => setDepositBTC(parseFloat(e.target.value) || 0)}
            className="border px-2 py-1 w-full"
          />
        </div>

        {/* Общая сумма */}
        <div>
          <label className="block text-sm font-medium">Общий депозит (USDT)</label>
          <p className="mt-1 text-green-600 font-bold">{totalDepositUSDT.toFixed(2)}</p>
        </div>

        {/* Стандартная позиция */}
        <div>
          <label className="block text-sm font-medium">Стандартная позиция (%)</label>
          <input
            type="number"
            value={standardPosition}
            onChange={(e) => setStandardPosition(parseFloat(e.target.value) || 0)}
            className="border px-2 py-1 w-full"
          />
        </div>
      </div>

      {/* Доступный Объём */}
      <div className="mt-4">
        <label className="block text-sm font-medium">Доступный Объём (ДО)</label>
        <p className="mt-1 text-blue-600 font-bold">{(availableVolume || 0).toLocaleString()}</p>
      </div>
    </div>
  );
}
