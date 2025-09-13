import React, { useState, useEffect } from "react";
import HeaderPanel from "./components/HeaderPanel";
import DepositPanel from "./components/DepositPanel";
import PositionsTable from "./components/PositionsTable";
import NewPositionForm from "./components/NewPositionForm";
import usePositions from "./hooks/usePositions";
import Auth from "./pages/Auth";
import { getPositions, addPosition as apiAddPosition, deletePosition as apiDeletePosition } from "./api/api";

function App() {
  const [user, setUser] = useState(null); // текущий пользователь
  const [prices, setPrices] = useState({ BTC: 0, ETH: 0 });

  const { positions, add, update, remove } = usePositions();

  // Депозиты
  const [depositUSDT, setDepositUSDT] = useState(50000);
  const [depositBTC, setDepositBTC] = useState(1);

  // Стандартная позиция
  const [standardPosition, setStandardPosition] = useState(2);

  // Доступный Объём (ДО)
  const [availableVolume] = useState(100000);

  // Получение курсов BTC и ETH
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch("http://163.5.63.244:5000/prices");
        const data = await res.json();
        setPrices({ BTC: data.BTC, ETH: data.ETH });
      } catch (err) {
        console.error("Ошибка при загрузке цен:", err);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 10000);
    return () => clearInterval(interval);
  }, []);

  // Проверка токена при загрузке
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Можно добавить декодирование JWT или запрос на проверку с бэкендом
      setUser({ id: 1 }); // для MVP просто ставим пользователя
    }
  }, []);

  if (!user) {
    return <Auth setUser={setUser} />;
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
        newPosition={{
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
        }}
        setNewPosition={() => {}}
        addPosition={add}
      />
    </div>
  );
}

export default App;
