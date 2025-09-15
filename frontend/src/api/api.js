// frontend/src/api/api.js
const BASE_URL = "http://163.5.63.244:5000"; // адрес вашего backend

// Токен в localStorage
export function getToken() {
  return localStorage.getItem("token");
}
export function setToken(token) {
  if (token) localStorage.setItem("token", token);
}
export function clearToken() {
  localStorage.removeItem("token");
}

// Формируем заголовки с авторизацией (только Authorization)
function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Универсальный безопасный парсер JSON
async function tryParseJson(response) {
  if (!response) return null;
  const ct = response.headers.get?.("content-type") || "";
  // Если нет тела (204) — вернём null
  if (response.status === 204) return null;
  if (ct.includes("application/json")) {
    try {
      return await response.json();
    } catch (e) {
      console.warn("JSON parse error:", e);
      return null;
    }
  }
  // если сервер вернул текст/HTML — читаем текст и логируем (ограничим вывод)
  try {
    const text = await response.text();
    console.warn("API ответил не JSON:", text.slice(0, 300));
  } catch (e) {
    // ничего
  }
  return null;
}

// Вспомогательная обёртка fetch для автоматического BASE_URL и обработки ошибок
async function request(path, options = {}, needAuth = false) {
  const headers = {
    ...(options.headers || {}),
    ...(needAuth ? authHeaders() : {}),
  };

  // если есть тело и нет Content-Type — проставим JSON
  if (options.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const json = await tryParseJson(res);
  if (!res.ok) {
    // если сервер вернул объект с { error: "..." }
    const msg = json?.error || `${res.status} ${res.statusText}`;
    const err = new Error(msg);
    err.response = res;
    err.body = json;
    throw err;
  }
  return json;
}

/* =========================
   Auth API
   - Принимают объекты: { email, password } и { email, name, password }
   ========================= */

export async function loginUser({ email, password }) {
  try {
    const json = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (json?.token) {
      setToken(json.token);
    }
    return json;
  } catch (err) {
    console.error("loginUser error:", err);
    return null;
  }
}

export async function registerUser({ email, name, password }) {
  try {
    const json = await request("/users/register", {
      method: "POST",
      body: JSON.stringify({ email, name, password }),
    });
    return json;
  } catch (err) {
    console.error("registerUser error:", err);
    return null;
  }
}

export function logout() {
  clearToken();
}

/* =========================
   Positions API
   All endpoints require auth headers
   ========================= */

export async function getPositions(user_id) {
  try {
    const endpoint = user_id ? `/positions/${user_id}` : `/positions`;
    const json = await request(endpoint, { method: "GET" }, true);
    // возвращаем массив
    if (Array.isArray(json)) return json;
    if (!json) return [];
    return Array.isArray(json.rows) ? json.rows : [json];
  } catch (err) {
    console.error("getPositions error:", err);
    return [];
  }
}

export async function addPosition(position) {
  try {
    const json = await request("/positions", {
      method: "POST",
      body: JSON.stringify(position),
    }, true);
    return json;
  } catch (err) {
    console.error("addPosition error:", err);
    return null;
  }
}

export async function updatePosition(id, position) {
  try {
    const json = await request(`/positions/${id}`, {
      method: "PUT",
      body: JSON.stringify(position),
    }, true);
    return json;
  } catch (err) {
    console.error("updatePosition error:", err);
    return null;
  }
}

export async function deletePosition(id) {
  try {
    const json = await request(`/positions/${id}`, {
      method: "DELETE",
    }, true);
    return json || { ok: true };
  } catch (err) {
    console.error("deletePosition error:", err);
    return null;
  }
}
