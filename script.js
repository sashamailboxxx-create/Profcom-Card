// script.js - заміни весь файл цим кодом
let map = L.map('map').setView([49.5883, 34.5514], 11);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
}).addTo(map);

const listContainer = document.getElementById("list");
const categoryFilter = document.getElementById("categoryFilter");
let allMarkers = [];
let loadedData = [];

// --- іконки категорій ---
function getCategoryIcon(category) {
  switch(category) {
    case "Аптека": return "💊";
    case "Автозапчастини": return "🔩";
    case "АЗС": return "⛽";
    case "Магазин": return "🛒";
    case "Ресторан": return "🍽️";
    case "Онлайн-магазини": return "🌐";
    default: return "📍";
  }
}

// ----------------------
//  Завантаження JSON
// ----------------------
fetch("data.json")
  .then(response => {
    if (!response.ok) throw new Error("Не вдалося завантажити data.json — перевірте шлях/файл.");
    return response.json();
  })
  .then(data => {
    loadedData = data;
    renderAll(data);
  })
  .catch(err => {
    console.error("Помилка при завантаженні data.json:", err);
    listContainer.innerHTML = `<div style="color: #f88; padding: 15px;">Помилка: не вдалось завантажити список. Дивись консоль (F12).</div>`;
  });

// ----------------------
//  Рендер списку + карти
// ----------------------
function renderAll(data) {
  listContainer.innerHTML = "";
  allMarkers.forEach(m => map.removeLayer(m));
  allMarkers = [];

  data.forEach(item => {
    // ---- Рендер списку (новий красивий стиль з іконкою) ----
    const entry = document.createElement("div");
    entry.className = "item";

    entry.innerHTML = `
      <div class="item-icon">${getCategoryIcon(item.category)}</div>
      <div class="item-content">
        <b>${escapeHtml(item.name)}</b><br>
        <div class="address">${escapeHtml(item.address)}</div>
        <div class="cat"><strong>Категорія:</strong> ${escapeHtml(item.category)}</div>
        ${item.site ? `<div class="site"><a href="${escapeAttr(item.site)}" target="_blank" rel="noopener">Перейти на сайт</a></div>` : ""}
      </div>
    `;

    listContainer.appendChild(entry);

    // ---- Якщо координати відсутні або null — не додаємо маркер ----
    // перевіряємо на null/undefined (користувач може мати "lat": null)
    if (item.lat == null || item.lng == null) return;

    // ---- Додаємо маркер на карту ----
    let marker = L.marker([Number(item.lat), Number(item.lng)]).addTo(map);
    marker.bindPopup(`<b>${escapeHtml(item.name)}</b><br>${escapeHtml(item.address)}`);
    allMarkers.push(marker);
  });
}

// ----------------------
//  Фільтр по категорії
// ----------------------
categoryFilter.addEventListener("change", () => {
  const selected = categoryFilter.value;

  const filtered = selected === "all"
    ? loadedData
    : loadedData.filter(item => item.category === selected);

  renderAll(filtered);
});

// Невелика функція-ескейп для безпечного вставляння тексту
function escapeHtml(str) {
  if (!str && str !== 0) return "";
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// Санітізація для атрибутів посилань
function escapeAttr(url) {
  if (!url) return "";
  return url.replace(/"/g, "%22");
}
