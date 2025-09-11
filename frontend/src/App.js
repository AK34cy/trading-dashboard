import React, { useState, useEffect } from "react";
import HeaderPanel from "./components/HeaderPanel";
import DepositPanel from "./components/DepositPanel";
import PositionsTable from "./components/PositionsTable";
import NewPositionForm from "./components/NewPositionForm";
import {
  getPositions,
  addPosition as apiAddPosition,
  deletePosition as apiDeletePosition,
} from "./api/api";

function App() {
  const [prices, setPrices] = useState({ BTC: 0, ETH: 0 });
  const [depositUSDT, setDepositUSDT] = useState(50000);
  const [depositBTC, setDepositBTC] = useState(1);
  const [standardPosition, setStandardPosition] = useState(2);
  const [availableVolume] = useState(100000);
  const [positions, setPositions] = useState([]);
  const [newPosition, setNewPosition] = useState({
    symbol: "",
    entry: "",
    stopLoss: "",
    riskPercent: standardPosition,
    amount: "",
  });

  useEffect(() => {
    const fetchPrices = () => {
      fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd"
      )
        .then((res) => res.json())
        .then((data) =>
          setPrices({ BTC: data.bitcoin.usd, ETH: data.ethereum.usd })
        )
        .catch(console.error);
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPositions();
        setPositions(data);
      } catch (err) {
        console.error("Ошибка загрузки позиций:", err);
      }
    };
    fetchData();
  }, []);

  const addPosition = async () => {
    if (!newPosition.symbol || !newPosition.stopLoss || !newPosition.riskPercent || !newPosition.amount) return;

    try {
      const symbol = newPosition.symbol.toUpperCase();
      const entry = prices[symbol] || parseFloat(newPosition.entry);
      const stopLoss = parseFloat(newPosition.stopLoss);
      const riskPercent = parseFloat(newPosition.riskPercent);
      const amount = parseFloat(newPosition.amount);

      const position = {
        symbol,
        entry,
        stop_loss: stopLoss,
        risk_percent: riskPercent,
        amount,
      };

      const saved = await apiAddPosition(position);
      if (saved) setPositions([...positions, saved]);
      setNewPosition({ symbol: "", entry: "", stopLoss: "", riskPercent: standardPosition, amount: "" });
    } catch (err) {
      console.error("Ошибка при добавлении позиции:", err);
    }
  };

  const removePosition = async (id) => {
    try {
      await apiDeletePosition(id);
      setPositions(positions.filter((pos) => pos.id !== id));
    } catch (err) {
      console.error("Ошибка при удалении позиции:", err);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto font-sans">
      <h1 className="text-2xl font-bold mb-4">Trading Dashboard</h1>

      <HeaderPanel
        btcPrice={prices.BTC}
        depositUSDT={depositUSDT}
        setDepositUSDT={setDepositUSDT}
        depositBTC={depositBTC}
        setDepositBTC={setDepositBTC}
        standardPosition={standardPosition}
        setStandardPosition={setStandardPosition}
        availableVolume={availableVolume}
      />

      <PositionsTable positions={positions} prices={prices} removePosition={removePosition} />

      <NewPositionForm
        newPosition={newPosition}
        setNewPosition={setNewPosition}
        addPosition={addPosition}
      />
    </div>
  );
}

export default App;
