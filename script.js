let map = L.map('map').setView([49.5883, 34.5514], 11);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
}).addTo(map);

const listContainer = document.getElementById("list");
const categoryFilter = document.getElementById("categoryFilter");
let allMarkers = [];
let loadedData = [];

// ----------------------
//  Завантаження JSON
// ----------------------
fetch("data.json")
  .then(response => response.json())
  .then(data => {
    loadedData = data;
    renderAll(data);
  });

// ----------------------
//  Рендер списку + карти
// ----------------------
function renderAll(data) {
  listContainer.innerHTML = "";
  allMarkers.forEach(m => map.removeLayer(m));
  allMarkers = [];

  data.forEach(item => {
    // ---- Рендер списку ----
    const entry = document.createElement("div");
    entry.className = "list-item";
    entry.innerHTML = `
      <h3>${item.name}</h3>
      <p>${item.address}</p>
      <p><strong>Категорія:</strong> ${item.category}</p>
      ${item.site ? `<a href="${item.site}" target="_blank">Перейти на сайт</a>` : ""}
    `;
    listContainer.appendChild(entry);

    // ---- Якщо магазин онлайн — не додаємо на карту ----
    if (!item.lat || !item.lng) return;

    // ---- Додаємо маркер ----
    let marker = L.marker([item.lat, item.lng]).addTo(map);
    marker.bindPopup(`<b>${item.name}</b><br>${item.address}`);
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
