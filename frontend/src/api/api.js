// frontend/src/api/api.js
const BASE_URL = "http://163.5.63.244:5000"; // адрес вашего backend

// Вспомогательная парс-функция — безопасно парсит JSON, если он есть
async function tryParseJson(response) {
  const ct = response.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    return await response.json();
  }
  // если сервер вернул HTML/текст — возвращаем null и логируем
  const text = await response.text();
  console.warn("API responded with non-JSON content:", text.slice(0, 300));
  return null;
}

export async function getPositions(user_id) {
  try {
    const endpoint = user_id ? `/positions/${user_id}` : `/positions`;
    const res = await fetch(`${BASE_URL}${endpoint}`);
    if (!res.ok) {
      const body = await tryParseJson(res);
      throw new Error(`Ошибка при получении позиций: ${res.status} ${res.statusText} ${body ? JSON.stringify(body) : ""}`);
    }
    const json = await tryParseJson(res);
    if (!json) return []; // если сервер вернул HTML/текст
    // Возвращаем массив в удобном виде
    if (Array.isArray(json)) return json;
    if (json.rows && Array.isArray(json.rows)) return json.rows;
    // Если сервер отдал объект (одну запись), завернём в массив
    if (json.id || json.symbol) return [json];
    console.warn("Неизвестный формат ответа getPositions:", json);
    return [];
  } catch (err) {
    console.error("getPositions error:", err);
    return [];
  }
}

export async function addPosition(position) {
  try {
    const res = await fetch(`${BASE_URL}/positions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(position),
    });

    if (!res.ok) {
      const body = await tryParseJson(res);
      throw new Error(`Ошибка при добавлении позиции: ${res.status} ${res.statusText} ${body ? JSON.stringify(body) : ""}`);
    }

    const json = await tryParseJson(res);
    console.log("api.addPosition response:", json);

    if (!json) return null;
    // если сервер вернул { rows: [ {..} ] }
    if (json.rows && Array.isArray(json.rows) && json.rows[0]) return json.rows[0];
    // если сервер вернул просто объект с данными
    if (json.id || json.symbol) return json;
    // если сервер вернул массив (маловероятно для POST)
    if (Array.isArray(json) && json[0]) return json[0];

    console.warn("addPosition: неожиданный формат ответа:", json);
    return null;
  } catch (err) {
    console.error("addPosition error:", err);
    return null;
  }
}

export async function updatePosition(id, position) {
  try {
    const res = await fetch(`${BASE_URL}/positions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(position),
    });
    if (!res.ok) {
      const body = await tryParseJson(res);
      throw new Error(`Ошибка при обновлении позиции: ${res.status} ${res.statusText} ${body ? JSON.stringify(body) : ""}`);
    }
    const json = await tryParseJson(res);
    if (!json) return null;
    if (json.rows && Array.isArray(json.rows) && json.rows[0]) return json.rows[0];
    if (json.id || json.symbol) return json;
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
    });
    if (!res.ok) {
      const body = await tryParseJson(res);
      throw new Error(`Ошибка при удалении позиции: ${res.status} ${res.statusText} ${body ? JSON.stringify(body) : ""}`);
    }
    const json = await tryParseJson(res);
    // Обычно сервер возвращает { message: "..." } — возвращаем это.
    return json || { ok: true };
  } catch (err) {
    console.error("deletePosition error:", err);
    return null;
  }
}
