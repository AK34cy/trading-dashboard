import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Auth from "./pages/Auth";
import './index.css';

// Попытка получить токен и пользователя из localStorage
const storedToken = localStorage.getItem("token");
const storedUser = localStorage.getItem("user");

function Root() {
  const [token, setToken] = useState(storedToken || "");
  const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null);

  // Сохраняем пользователя и токен в localStorage при изменении
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  // Если нет токена — показываем Auth
  if (!token) {
    return <Auth setToken={setToken} setUser={setUser} />;
  }

  // Иначе — основной App
  return <App user={user} token={token} />;
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Root />);
