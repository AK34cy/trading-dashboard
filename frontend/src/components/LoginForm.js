// frontend/src/components/LoginForm.js
import React, { useState } from "react";
import { loginUser } from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function LoginForm() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // отправка логина
      const response = await loginUser({ email, password });

      if (response && response.token) {
        // токен уже сохранён в localStorage в api.js

        // формируем объект пользователя, если его нет в ответе
        const user = response.user || { id: 1, name: email };

        // обновляем глобальное состояние через контекст
        login(user);
      } else {
        setError(response?.error || "Неверный email или пароль");
      }
    } catch (err) {
      console.error("LoginForm handleSubmit error:", err);
      setError(err.message || "Ошибка при логине");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto p-4 border rounded bg-gray-50"
    >
      <h2 className="text-xl font-bold mb-4">Вход</h2>

      <div className="mb-2">
        <label className="block mb-1 text-sm font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border px-2 py-1 w-full rounded"
        />
      </div>

      <div className="mb-2">
        <label className="block mb-1 text-sm font-medium">Пароль</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border px-2 py-1 w-full rounded"
        />
      </div>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
      >
        {loading ? "Входим..." : "Войти"}
      </button>
    </form>
  );
}
