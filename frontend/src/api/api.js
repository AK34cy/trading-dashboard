const BASE_URL = "http://163.5.63.244:5000"; // адрес вашего backend

export async function getPositions(user_id) {
  try {
    const res = await fetch(`${BASE_URL}/positions/${user_id}`);
    if (!res.ok) throw new Error("Ошибка при получении позиций");
    return await res.json();
  } catch (err) {
    console.error(err);
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
    if (!res.ok) throw new Error("Ошибка при добавлении позиции");
    return await res.json();
  } catch (err) {
    console.error(err);
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
    if (!res.ok) throw new Error("Ошибка при обновлении позиции");
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function deletePosition(id) {
  try {
    const res = await fetch(`${BASE_URL}/positions/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Ошибка при удалении позиции");
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}
