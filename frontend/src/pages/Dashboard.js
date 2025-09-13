import React, { useState } from "react";
import usePositions from "../hooks/usePositions";
import PositionsTable from "../components/PositionsTable";
import NewPositionForm from "../components/NewPositionForm";

function Dashboard() {
  const { positions, prices, loading, add, update, remove } = usePositions();
  const [newPosition, setNewPosition] = useState({
    symbol: "",
    entry: "",
    stop_loss: "",
    risk_percent: "",
    amount: "",
  });

  const handleAddPosition = async () => {
    if (!newPosition.symbol || !newPosition.entry) {
      alert("Поля Актив и Вход обязательны!");
      return;
    }

    // Добавляем позицию через хук
    await add(newPosition);

    // Сброс формы
    setNewPosition({
      symbol: "",
      entry: "",
      stop_loss: "",
      risk_percent: "",
      amount: "",
    });
  };

  if (loading) {
    return <p>Загрузка позиций...</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Дашборд</h1>

      <NewPositionForm
        newPosition={newPosition}
        setNewPosition={setNewPosition}
        addPosition={handleAddPosition}
      />

      <PositionsTable positions={positions} prices={prices} remove={remove} />
    </div>
  );
}

export default Dashboard;
