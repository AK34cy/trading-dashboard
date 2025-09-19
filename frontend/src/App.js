// frontend/src/App.js
import React, { useState, useEffect } from "react";
import HeaderPanel from "./components/HeaderPanel";
import PositionsTable from "./components/PositionsTable";
import NewPositionForm from "./components/NewPositionForm";
import usePositions from "./hooks/usePositions";
import Auth from "./pages/Auth";
import apiClient, { setAuthToken, clearAuthToken } from "./services/apiClient";

function App() {
  const [user, setUser] = useState(null);

  // Курсы (пока статично, позже заменим на API)
  const [prices] = useState({ BTC: 30000, ETH: 1800 });

  // Депозиты и настройки
  const [depositUSDT, setDepositUSDT] = useState(50000);
  const [depositBTC, setDepositBTC] = useState(1);
  const [standardPosition, setStandardPosition] = useState(2);
  const [availableVolume] = useState(100000);

  // Восстановление сессии при старте
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setAuthToken(storedToken); // сразу в apiClient
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Ошибка парсинга user:", err);
      }
    }
  }, []);

  // Хук позиций (сам знает про apiClient и токен)
  const { positions, add, update, remove, loading } = usePositions();

  // Авторизация
  const handleLogin = (loggedUser, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(loggedUser));
    setAuthToken(token);
    setUser(loggedUser);
  };

  // Выход
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    clearAuthToken();
    setUser(null);
  };

  return (
    <div className="max-w-6xl mx-auto font-sans">
      {/* Хедер */}
      <div className="flex justify-between items-center p-4 bg-gray-100 border-b">
        <h1 className="text-2xl font-bold">Trading Dashboard</h1>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-gray-700">Привет, {user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
              >
                Выйти
              </button>
            </>
          ) : (
            <span className="text-gray-700">Вы не вошли</span>
          )}
        </div>
      </div>

      {/* Контент */}
      <div className="p-6">
        {!user ? (
          <>
            <Auth onLogin={handleLogin} />
            <div className="mt-6 p-4 border rounded bg-gray-50">
              <h2 className="text-lg font-bold mb-2">Пример курсов</h2>
              <p>BTC: ${prices.BTC}</p>
              <p>ETH: ${prices.ETH}</p>
            </div>
          </>
        ) : (
          <>
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
              positions={Array.isArray(positions) ? positions : []}
              prices={prices}
              add={add}
              remove={remove}
              loading={loading}
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
          </>
        )}
      </div>
    </div>
  );
}

export default App;
