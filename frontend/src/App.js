// frontend/src/App.js
import React, { useState, useEffect } from "react";
import HeaderPanel from "./components/HeaderPanel";
import PositionsTable from "./components/PositionsTable";
import NewPositionForm from "./components/NewPositionForm";
import usePositions from "./hooks/usePositions";
import Auth from "./pages/Auth";

function App() {
  const [user, setUser] = useState(null); // текущий пользователь
  const [prices, setPrices] = useState({ BTC: 30000, ETH: 1800 }); // локальные цены
  const [token, setToken] = useState(null);

  // Проверка токена при загрузке
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Ошибка парсинга user из localStorage:", err);
      }
    }
  }, []);

  const userId = user?.id || null;
  const { positions: rawPositions, add, update, remove, loading } = usePositions(userId, token);

  // Всегда передаём массив, даже если undefined
  const positions = Array.isArray(rawPositions) ? rawPositions : [];

  // Логируем для отладки
  console.log("App render:", { user, token, positions, loading });

  // Депозиты и стандартная позиция
  const [depositUSDT, setDepositUSDT] = useState(50000);
  const [depositBTC, setDepositBTC] = useState(1);
  const [standardPosition, setStandardPosition] = useState(2);
  const [availableVolume] = useState(100000);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  if (!user) return <Auth setUser={setUser} />;

  return (
    <div className="max-w-6xl mx-auto font-sans">
      {/* Хедер */}
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

      {/* Основная панель */}
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

        <PositionsTable
          positions={positions}
          prices={prices || {}}
          add={add}
          remove={remove}
        />

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
