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
  // Курсы
  const [prices, setPrices] = useState({ BTC: 0, ETH: 0 });

  // Депозиты
  const [depositUSDT, setDepositUSDT] = useState(50000);
  const [depositBTC, setDepositBTC] = useState(1);

  // Стандартная позиция
  const [standardPosition, setStandardPosition] = useState(2);

  // Доступный Объём (ДО)
  const [availableVolume] = useState(100000);

  // Позиции
  const [positions, setPositions] = useState([]);
  const [newPosition, setNewPosition] = useState({
    symbol: "",
    entry: "",
    stopLoss: "",
    riskPercent: standardPosition,
    amount: "",
    input_type: "coin",
    take_profit: "",
    leverage: "",
    notes: "",
    order_type: "market",
    exchange: "Binance",
    fee_open: "",
    fee_close: "",
    fee_funding: "",
  });

  // Получение курсов BTC и ETH
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch("http://163.5.63.244:5000/prices");
        const data = await res.json();
        setPrices({ BTC: data.BTC, ETH: data.ETH });
      } catch (err) {
        console.error("Ошибка при загрузке цен:", err);
        // Заглушка, чтобы интерфейс не ломался
        setPrices((prev) => prev);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 10000); // обновляем каждые 10 сек
    return () => clearInterval(interval);
  }, []);

  // Загрузка позиций из БД
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

  // Добавление позиции
  const addPosition = async () => {
    if (!newPosition.symbol || !newPosition.stopLoss || !newPosition.riskPercent) return;

    try {
      const symbol = newPosition.symbol.toUpperCase();
      const entry = newPosition.entry ? parseFloat(newPosition.entry) : prices[symbol] || 0;
      const stopLoss = parseFloat(newPosition.stopLoss);
      const riskPercent = parseFloat(newPosition.riskPercent);
      const amount = parseFloat(newPosition.amount || 0);

      const position = {
        user_id: 1, // можно динамически
        symbol,
        entry,
        stop_loss: stopLoss,
        risk_percent: riskPercent,
        amount,
        input_type: newPosition.input_type || "coin",
        take_profit: newPosition.take_profit ? parseFloat(newPosition.take_profit) : null,
        leverage: newPosition.leverage ? parseFloat(newPosition.leverage) : null,
        status: "open",
        notes: newPosition.notes || "",
        order_type: newPosition.order_type || "market",
        exchange: newPosition.exchange || "Binance",
        fee_open: newPosition.fee_open ? parseFloat(newPosition.fee_open) : 0,
        fee_close: newPosition.fee_close ? parseFloat(newPosition.fee_close) : 0,
        fee_funding: newPosition.fee_funding ? parseFloat(newPosition.fee_funding) : 0,
      };

      const saved = await apiAddPosition(position);
      if (saved) setPositions([...positions, saved]);

      // Сброс формы
      setNewPosition({
        symbol: "",
        entry: "",
        stopLoss: "",
        riskPercent: standardPosition,
        amount: "",
        input_type: "coin",
        take_profit: "",
        leverage: "",
        notes: "",
        order_type: "market",
        exchange: "Binance",
        fee_open: "",
        fee_close: "",
        fee_funding: "",
      });
    } catch (err) {
      console.error("Ошибка при добавлении позиции:", err);
    }
  };

  // Удаление позиции
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
