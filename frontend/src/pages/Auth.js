import React, { useState } from "react";
import { loginUser, registerUser } from "../api/api";

export default function Auth({ setUser, setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (isRegister) {
        const data = await registerUser({ email, password, name });
        if (data && data.id) {
          alert("Регистрация успешна. Теперь войдите.");
          setIsRegister(false);
          setName("");
        }
      } else {
        const data = await loginUser({ email, password });
        if (data && data.token) {
          setToken(data.token);
          setUser(data.user);
        }
      }
    } catch (err) {
      console.error("Ошибка авторизации:", err);
      setError(err.message || "Ошибка сервера");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">
        {isRegister ? "Регистрация" : "Вход"}
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {isRegister && (
          <input
            type="text"
            placeholder="Имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded"
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
          required
        />
        {error && <div className="text-red-500">{error}</div>}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Подождите..." : isRegister ? "Зарегистрироваться" : "Войти"}
        </button>
      </form>
      <div className="mt-4 text-center">
        <button
          onClick={() => {
            setIsRegister(!isRegister);
            setError("");
          }}
          className="text-blue-600 underline"
        >
          {isRegister ? "Уже есть аккаунт? Войти" : "Нет аккаунта? Зарегистрироваться"}
        </button>
      </div>
    </div>
  );
}
