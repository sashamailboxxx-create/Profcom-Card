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
    const entry = document.createElement("div");
    entry.className = "item";

    entry.innerHTML = `
      <div class="item-icon">${getCategoryIcon(item.category)}</div>
      <div class="item-content">
        <b>${escapeHtml(item.name)}</b><br>
        <div class="address">${escapeHtml(item.address)}</div>
        <div class="cat">
          <strong>Категорія:</strong> ${escapeHtml(item.category)}
        </div>

        <div class="contact-box">

          ${item.instagram ? `
            <a href="${escapeAttr(item.instagram)}" target="_blank" class="btn-link">
              <img class="icon" src="https://cdn-icons-png.flaticon.com/512/174/174855.png">
              Instagram
            </a>
          ` : ''}

          ${item.phone ? `
            <a href="tel:${escapeAttr(item.phone)}" class="btn-link">
              <img class="icon" src="https://cdn-icons-png.flaticon.com/512/724/724664.png">
              ${item.phone}
            </a>
          ` : ''}

          ${item.site ? `
            <a href="${escapeAttr(item.site)}" target="_blank" class="btn-site">
              Відкрити сайт
            </a>
          ` : ''}
        </div>
      </div>
    `;

    listContainer.appendChild(entry);

    // --- Якщо нема координат — не додаємо на карту ---
    if (!item.lat || !item.lng) return;

    let marker = L.marker([Number(item.lat), Number(item.lng)]).addTo(map);

    marker.bindPopup(`
      <div style="font-size:14px; line-height:1.4;">
        <strong>${escapeHtml(item.name)}</strong><br>
        ${escapeHtml(item.address)}<br>
        <span style="color:#555">${escapeHtml(item.category)}</span><br><br>

        ${item.instagram ? `
          <a href="${escapeAttr(item.instagram)}" target="_blank" class="btn-link">
            <img class="icon" src="https://cdn-icons-png.flaticon.com/512/174/174855.png">
            Instagram
          </a><br>
        ` : ''}

        ${item.phone ? `
          <a href="tel:${escapeAttr(item.phone)}" class="btn-link">
            <img class="icon" src="https://cdn-icons-png.flaticon.com/512/724/724664.png">
            Подзвонити
          </a><br>
        ` : ''}

        ${item.site ? `
          <a href="${escapeAttr(item.site)}" target="_blank" class="btn-site" style="margin-top:5px;display:inline-block;">
            Відкрити сайт
          </a>
        ` : ''}
      </div>
    `);

    allMarkers.push(marker);
  });
}

// ==============================
//  Фільтрація
// ==============================
categoryFilter.addEventListener("change", () => {
  const selected = categoryFilter.value;

  const filtered = selected === "all"
    ? loadedData
    : loadedData.filter(item => item.category === selected);

  renderAll(filtered);
});

// ==============================
//  Безпечний текст
// ==============================
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeAttr(url) {
  return url ? url.replace(/"/g, "%22") : "";
}
