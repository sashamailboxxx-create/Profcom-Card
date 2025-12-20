// --- Ініціалізація карти ---
let map = L.map('map').setView([49.5883, 34.5514], 11);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
}).addTo(map);

const listContainer = document.getElementById("list");
const categoryFilter = document.getElementById("categoryFilter");
let allMarkers = [];
let loadedData = [];

// --- Іконки категорій ---
function getCategoryIcon(category) {
  switch (category) {
    case "Аптека": return "💊";
    case "Автозапчастини": return "🔩";
    case "АЗС": return "⛽";
    case "Магазин": return "🛒";
    case "Ресторан": return "🍽️";
    case "Онлайн-магазини": return "🌐";
    default: return "📍";
  }
}

// ==============================
//  Завантаження JSON
// ==============================
fetch("data.json")
  .then(response => {
    if (!response.ok) throw new Error("Не вдалося завантажити data.json.");
    return response.json();
  })
  .then(data => {
    loadedData = data;
    renderAll(data);
  })
  .catch(err => {
    console.error("Помилка при завантаженні data.json:", err);
    listContainer.innerHTML = `<div style="color:#f88;padding:15px;">Помилка: не вдалось завантажити список.</div>`;
  });

// ==============================
//  Рендер списку + карти
// ==============================
function renderAll(data) {
  listContainer.innerHTML = "";
  allMarkers.forEach(m => map.removeLayer(m));
  allMarkers = [];

  data.forEach(item => {
    // --- Рендер списку ---
    const entry = document.createElement("div");
    entry.className = "item";

    entry.innerHTML = `
      <div class="item-icon">${getCategoryIcon(item.category)}</div>
      <div class="item-content">
        <b>${escapeHtml(item.name)}</b><br>
        <div class="address">${escapeHtml(item.address)}</div>
        <div class="cat"><strong>Категорія:</strong> ${escapeHtml(item.category)}</div>

        ${item.instagram ? `
          <a href="${escapeAttr(item.instagram)}" target="_blank" class="btn-link">
            <span class="icon">📸</span> Instagram
          </a>` : ''}

        ${item.site ? `
          <a href="${escapeAttr(item.site)}" target="_blank" class="btn-link">
            <span class="icon">🌐</span> Сайт
          </a>` : ''}

        ${item.phone ? `
          <a href="tel:${escapeAttr(item.phone)}" class="btn-link">
            <span class="icon">📞</span> Подзвонити
          </a>` : ''}
      </div>
    `;

    listContainer.appendChild(entry);

    // --- Якщо нема координат — тільки список ---
    if (item.lat == null || item.lng == null) return;

    // --- Створюємо маркер ---
    const marker = L.marker([Number(item.lat), Number(item.lng)]).addTo(map);

    marker.bindPopup(`
      <div style="font-size:14px; line-height:1.4;">
        <strong>${escapeHtml(item.name)}</strong><br>
        ${escapeHtml(item.address)}<br>
        <span>${escapeHtml(item.category)}</span><br><br>

        ${item.instagram ? `<a href="${escapeAttr(item.instagram)}" target="_blank">📸 Instagram</a><br>` : ''}
        ${item.site ? `<a href="${escapeAttr(item.site)}" target="_blank">🌐 Сайт</a><br>` : ''}
        ${item.phone ? `<a href="tel:${escapeAttr(item.phone)}">📞 Подзвонити</a>` : ''}
      </div>
    `);

    allMarkers.push(marker);

    // ==============================
    //  🔹 НОВЕ: клік по партнеру → карта
    // ==============================
    entry.addEventListener("click", () => {
      map.setView([item.lat, item.lng], 15, { animate: true });
      marker.openPopup();
    });
  });
}

// ==============================
//  Фільтрація по категорії
// ==============================
categoryFilter.addEventListener("change", () => {
  const selected = categoryFilter.value;

  const filtered =
    selected === "all"
      ? loadedData
      : loadedData.filter(item => item.category === selected);

  renderAll(filtered);
});

// ==============================
//  Функції безпеки тексту
// ==============================
function escapeHtml(str) {
  if (!str && str !== 0) return "";
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(url) {
  if (!url) return "";
  return url.replace(/"/g, "%22");
}
