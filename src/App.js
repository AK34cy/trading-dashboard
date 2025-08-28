import React, { useState, useEffect } from "react";
import DepositPanel from "./components/DepositPanel";
import PositionsTable from "./components/PositionsTable";
import NewPositionForm from "./components/NewPositionForm";

function App() {
  const [deposit, setDeposit] = useState(10000);
  const [positions, setPositions] = useState([]);
  const [newPosition, setNewPosition] = useState({
    symbol: "",
    entry: "",
    stopLoss: "",
    riskPercent: "",
  });
  const [prices, setPrices] = useState({});

  const usedCapital = positions.reduce((acc, pos) => acc + pos.potentialLoss, 0);
  const freeCapital = deposit - usedCapital;

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

    fetchPrices();
    const interval = setInterval(fetchPrices, 10000);
    return () => clearInterval(interval);
  }, []);

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

  const removePosition = (index) => {
    setPositions(positions.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6 max-w-5xl mx-auto font-sans">
      <h1 className="text-2xl font-bold mb-4">Trading Dashboard</h1>
      <DepositPanel deposit={deposit} setDeposit={setDeposit} freeCapital={freeCapital} />
      <PositionsTable positions={positions} prices={prices} removePosition={removePosition} />
      <NewPositionForm newPosition={newPosition} setNewPosition={setNewPosition} addPosition={addPosition} />
    </div>
  );
}

export default App;
