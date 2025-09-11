import React, { useState, useEffect } from "react";
import HeaderPanel from "./components/HeaderPanel";
import DepositPanel from "./components/DepositPanel";
import PositionsTable from "./components/PositionsTable";
import NewPositionForm from "./components/NewPositionForm";
import usePositions from "./hooks/usePositions";

function App() {
  // Курсы
  const [prices, setPrices] = useState({ BTC: 0, ETH: 0 });

  // Депозиты
  const [depositUSDT, setDepositUSDT] = useState(50000);
  const [depositBTC, setDepositBTC] = useState(1);

  // Стандартная позиция
  const [standardPosition, setStandardPosition] = useState(2);

  // Доступный Объём (ДО)
  const [availableVolume] = useState(100000);

  // Позиции через хук
  const { positions, add, remove, loading } = usePositions();

  // Новая позиция
  const [newPosition, setNewPosition] = useState({
    symbol: "",
    entry: "",
    stopLoss: "",
    riskPercent: standardPosition,
  });

  // Получение курсов BTC и ETH
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

  // Добавление позиции
  const handleAddPosition = () => {
    if (!newPosition.symbol || !newPosition.stopLoss || !newPosition.riskPercent) return;

    const symbol = newPosition.symbol.toUpperCase();
    const entry = prices[symbol] || parseFloat(newPosition.entry);
    const stopLoss = parseFloat(newPosition.stopLoss);
    const riskPercent = parseFloat(newPosition.riskPercent);

    const totalDeposit = depositUSDT + depositBTC * prices.BTC;
    const riskAmount = (riskPercent / 100) * totalDeposit;
    const volume = riskAmount / Math.abs(entry - stopLoss);
    const potentialLoss = riskAmount;

    const position = { symbol, entry, stopLoss, riskPercent, volume, potentialLoss };
    add(position);

    // Сброс полей новой позиции с подставленным стандартным %
    setNewPosition({ symbol: "", entry: "", stopLoss: "", riskPercent: standardPosition });
  };

  if (loading) {
    return <div className="p-6">Загрузка позиций...</div>;
  }

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

      <PositionsTable positions={positions} prices={prices} removePosition={remove} />

      <NewPositionForm
        newPosition={newPosition}
        setNewPosition={setNewPosition}
        addPosition={handleAddPosition}
      />
    </div>
  );
}

export default App;
