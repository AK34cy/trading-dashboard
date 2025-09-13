import React from "react";

export default function DepositPanel({ deposit = 0, setDeposit, freeCapital = 0 }) {
  return (
    <div className="mb-6 p-2 border rounded bg-gray-50">
      <label className="mr-2 font-medium">Депозит:</label>
      <input
        type="number"
        value={deposit}
        onChange={(e) => setDeposit(parseFloat(e.target.value) || 0)}
        className="border px-2 py-1 w-32 rounded"
      />
      <span className="ml-4 font-semibold">
        Свободный капитал: ${Number(freeCapital || 0).toFixed(2)}
      </span>
    </div>
  );
}
