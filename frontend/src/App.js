// frontend/src/App.js
import React, { useState } from "react";
import HeaderPanel from "./components/HeaderPanel";
import PositionsTable from "./components/PositionsTable";
import NewPositionForm from "./components/NewPositionForm";
import usePositions from "./hooks/usePositions";
import Auth from "./pages/Auth";

function App() {
  const [user, setUser] = useState(null);
  const [prices, setPrices] = useState({ BTC: 0, ETH: 0 }); // пока локально
  const { positions, add, remove } = usePositions();

  // Депозиты и стандартная позиция
  const [depositUSDT] = useState(50000);
  const [depositBTC] = useState(1);
  const [standardPosition] = useState(2);
  const [availableVolume] = useState(100000);

  // Проверка токена
  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser({ id: 1, name: "Demo User" });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  if (!user) return <Auth setUser={setUser} />;

  return (
    <div className="max-w-6xl mx-auto font-sans">
      <div className="flex justify-between items-center p-4 bg-gray-100 border-b">
        <h1 className="text-2xl font-bold">Trading Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-700">Привет, {user.name}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
          >
            Выйти
          </button>
        </div>
      </div>

      <div className="p-6">
        <HeaderPanel
          btcPrice={prices.BTC}
          depositUSDT={depositUSDT}
          depositBTC={depositBTC}
          standardPosition={standardPosition}
          availableVolume={availableVolume}
        />

        <PositionsTable positions={positions} prices={prices} add={add} remove={remove} />

        <NewPositionForm
          newPosition={{
            symbol: "",
            entry: "",
            stopLoss: "",
            riskPercent: standardPosition,
            amount: "",
            take_profit: "",
          }}
          setNewPosition={() => {}}
          addPosition={add}
        />
      </div>
    </div>
  );
}

export default App;
