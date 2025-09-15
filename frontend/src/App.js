// frontend/src/App.js
import React, { useState, useEffect } from "react";
import HeaderPanel from "./components/HeaderPanel";
import PositionsTable from "./components/PositionsTable";
import NewPositionForm from "./components/NewPositionForm";
import usePositions from "./hooks/usePositions";
import Auth from "./pages/Auth";

function App() {
  const [user, setUser] = useState(null); // текущий пользователь
  const [prices, setPrices] = useState({ BTC: 0, ETH: 0 });
  const { positions, add, update, remove } = usePositions();

  // Депозиты и стандартная позиция
  const [depositUSDT, setDepositUSDT] = useState(50000);
  const [depositBTC, setDepositBTC] = useState(1);
  const [standardPosition, setStandardPosition] = useState(2);
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
      // TODO: можно сделать запрос к backend для проверки токена
      setUser({ id: 1, name: "Demo User" }); // для MVP просто ставим пользователя
    }
  }, []);

  // Выход
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  if (!user) return <Auth setUser={setUser} />;

  return (
    <div className="max-w-6xl mx-auto font-sans">
      {/* Хедер пользователя */}
      <div className="flex justify-between items-center p-4 bg-gray-100 border-b">
        <h1 className="text-2xl font-bold">Trading Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-700">Привет, {user.name || "Пользователь"}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
          >
            Выйти
          </button>
        </div>
      </div>

      {/* Основная панель с данными */}
      <div className="p-6">
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
    </div>
  );
}

export default App;
