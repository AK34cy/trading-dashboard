import React from "react";

export default function DepositPanel({ deposit, setDeposit, freeCapital }) {
  return (
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
  );
}
