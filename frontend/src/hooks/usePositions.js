import { useState, useEffect } from "react";
import {
  getPositions,
  addPosition,
  updatePosition,
  deletePosition,
} from "../api/api";

export default function usePositions() {
  const [positions, setPositions] = useState([]);
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);

  // Загружаем позиции при старте
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getPositions();
        setPositions(data);
      } catch (err) {
        console.error("Ошибка при загрузке позиций:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Добавление позиции
  const add = async (position) => {
    const newPos = await addPosition(position);
    setPositions([...positions, newPos]);
  };

  // Обновление позиции
  const update = async (id, position) => {
    const updated = await updatePosition(id, position);
    setPositions(
      positions.map((p) => (p.id === id ? updated : p))
    );
  };

  // Удаление позиции
  const remove = async (id) => {
    await deletePosition(id);
    setPositions(positions.filter((p) => p.id !== id));
  };

  return {
    positions,
    prices,
    loading,
    add,
    update,
    remove,
  };
}
