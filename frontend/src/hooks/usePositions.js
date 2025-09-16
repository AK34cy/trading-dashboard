import { useState, useEffect } from "react";
import {
  getPositions,
  addPosition,
  updatePosition,
  deletePosition,
} from "../api/api.js";

export default function usePositions(user_id, token) {
  const [positions, setPositions] = useState([]);
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(false); // false по умолчанию

  // Функция для получения позиций
  const fetchPositions = async () => {
    if (!user_id || !token) return; // Если нет пользователя или токена — ничего не делаем
    setLoading(true);
    try {
      const data = await getPositions(user_id, token); // передаём токен
      setPositions(data || []);
    } catch (err) {
      console.error("Ошибка при загрузке позиций:", err);
    } finally {
      setLoading(false);
    }
  };

  // Загружаем позиции при старте и при изменении user_id или token
  useEffect(() => {
    if (user_id && token) {
      fetchPositions();
    } else {
      setPositions([]); // очищаем массив, если нет пользователя
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user_id, token]);

  // Добавление позиции
  const add = async (position) => {
    if (!token) return null;
    try {
      const newPos = await addPosition(position, token);
      if (newPos) setPositions((prev) => [...prev, newPos]);
      return newPos;
    } catch (err) {
      console.error("Ошибка при добавлении позиции:", err);
      return null;
    }
  };

  // Обновление позиции
  const update = async (id, position) => {
    if (!token) return null;
    try {
      const updated = await updatePosition(id, position, token);
      if (updated) {
        setPositions((prev) =>
          prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
        );
      }
      return updated;
    } catch (err) {
      console.error("Ошибка при обновлении позиции:", err);
      return null;
    }
  };

  // Удаление позиции
  const remove = async (id) => {
    if (!token) return null;
    try {
      const result = await deletePosition(id, token);
      if (result) {
        setPositions((prev) => prev.filter((p) => p.id !== id));
      }
      return result;
    } catch (err) {
      console.error("Ошибка при удалении позиции:", err);
      return null;
    }
  };

  return {
    positions,
    prices,
    loading,
    add,
    update,
    remove,
    fetchPositions,
  };
}
