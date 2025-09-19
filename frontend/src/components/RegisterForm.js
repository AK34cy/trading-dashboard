// frontend/src/components/RegisterForm.js
import React, { useState, useContext } from "react";
import { registerUser } from "../api/api";
import { UserContext } from "../context/UserContext"; // подключаем контекст

export default function RegisterForm() {
  const { setUser } = useContext(UserContext); // получаем функцию обновления пользователя
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await registerUser({ name, email, password });

      if (response && response.id) {
        // обновляем глобальный контекст пользователя сразу после успешной регистрации
        setUser({ id: response.id, name: response.name, email: response.email });
        setSuccess("Регистрация успешна! Вы вошли автоматически.");

        // сброс формы
        setName("");
        setEmail("");
        setPassword("");
      } else {
        setError(response?.error || "Ошибка при регистрации");
      }
    } catch (err) {
      console.error("RegisterForm handleSubmit error:", err);
      setError(err.message || "Ошибка при регистрации");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto p-4 border rounded bg-gray-50"
    >
      <h2 className="text-xl font-bold mb-4">Регистрация</h2>

      <div className="mb-2">
        <label className="block mb-1 text-sm font-medium">Имя</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border px-2 py-1 w-full rounded"
        />
      </div>

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
      {success && <p className="text-green-600 mb-2">{success}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-green-500 text-white px-4 py-2 rounded w-full"
      >
        {loading ? "Регистрируем..." : "Зарегистрироваться"}
      </button>
    </form>
  );
}
