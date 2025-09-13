// frontend/src/pages/Auth.js
import React, { useState } from "react";
import LoginForm from "../components/LoginForm";
import { registerUser } from "../api/api";

export default function Auth({ setUser }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await registerUser(email, name, password);
      if (response && response.id) {
        alert("Регистрация успешна. Теперь войдите.");
        setIsRegister(false);
        setName("");
        setEmail("");
        setPassword("");
      } else {
        setError(response?.error || "Ошибка регистрации");
      }
    } catch (err) {
      console.error("handleRegister error:", err);
      setError(err.message || "Ошибка сервера");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow bg-gray-50">
      {isRegister ? (
        <>
          <h2 className="text-xl font-bold mb-4">Регистрация</h2>
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 rounded"
              required
            />
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
              {loading ? "Подождите..." : "Зарегистрироваться"}
            </button>
          </form>
        </>
      ) : (
        <LoginForm onLoginSuccess={(user) => setUser(user)} />
      )}

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
