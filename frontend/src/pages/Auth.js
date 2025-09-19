// frontend/src/pages/Auth.js
import React, { useState } from "react";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

export default function Auth({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow bg-white">
      {isRegister ? (
        <RegisterForm
          onRegisterSuccess={() => {
            setIsRegister(false); // после регистрации показываем форму логина
          }}
        />
      ) : (
        <LoginForm onLogin={onLogin} />
      )}

      <div className="mt-4 text-center">
        <button
          onClick={() => setIsRegister(!isRegister)}
          className="text-blue-600 underline"
        >
          {isRegister
            ? "Уже есть аккаунт? Войти"
            : "Нет аккаунта? Зарегистрироваться"}
        </button>
      </div>
    </div>
  );
}
