const BASE_URL = "http://163.5.63.244:5000"; // адрес вашего backend

// Получаем токен из localStorage
function getToken() {
  return localStorage.getItem("token");
}

// Формируем заголовки с авторизацией
function authHeaders() {
  const token = getToken();
  return token ? { "Authorization": `Bearer ${token}` } : {};
}

// Универсальный безопасный парсер JSON
async function tryParseJson(response) {
  const ct = response.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    return await response.json();
  }
  const text = await response.text();
  console.warn("API ответил не JSON:", text.slice(0, 300));
  return null;
}

// ======== Auth API ========

export async function loginUser(email, password) {
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const json = await tryParseJson(res);
    if (!res.ok) throw new Error(json?.error || res.statusText);
    if (json.token) localStorage.setItem("token", json.token);
    return json;
  } catch (err) {
    console.error("loginUser error:", err);
    return null;
  }
}

export async function registerUser(email, name, password) {
  try {
    const res = await fetch(`${BASE_URL}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name, password }),
    });
    const json = await tryParseJson(res);
    if (!res.ok) throw new Error(json?.error || res.statusText);
    return json;
  } catch (err) {
    console.error("registerUser error:", err);
    return null;
  }
}

// ======== Positions API ========

export async function getPositions(user_id) {
  try {
    const endpoint = user_id ? `/positions/${user_id}` : `/positions`;
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: { ...authHeaders(), "Content-Type": "application/json" },
    });
    const json = await tryParseJson(res);
    if (!res.ok) throw new Error(json?.error || res.statusText);
    return Array.isArray(json) ? json : [json];
  } catch (err) {
    console.error("getPositions error:", err);
    return [];
  }
}

export async function addPosition(position) {
  try {
    const res = await fetch(`${BASE_URL}/positions`, {
      method: "POST",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify(position),
    });
    const json = await tryParseJson(res);
    if (!res.ok) throw new Error(json?.error || res.statusText);
    return json;
  } catch (err) {
    console.error("addPosition error:", err);
    return null;
  }
}

export async function updatePosition(id, position) {
  try {
    const res = await fetch(`${BASE_URL}/positions/${id}`, {
      method: "PUT",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify(position),
    });
    const json = await tryParseJson(res);
    if (!res.ok) throw new Error(json?.error || res.statusText);
    return json;
  } catch (err) {
    console.error("updatePosition error:", err);
    return null;
  }
}

export async function deletePosition(id) {
  try {
    const res = await fetch(`${BASE_URL}/positions/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    const json = await tryParseJson(res);
    if (!res.ok) throw new Error(json?.error || res.statusText);
    return json || { ok: true };
  } catch (err) {
    console.error("deletePosition error:", err);
    return null;
  }
}
