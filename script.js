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
        <b>${item.name}</b><br>
        ${item.address}<br>
        <span><b>Категорія:</b> ${item.category}</span><br>
        ${item.site ? `<a href="${item.site}" target="_blank">Перейти на сайт</a>` : ""}
      </div>
    `;

    listContainer.appendChild(entry);

    // ---- Онлайн магазини (немає координат) — пропускаємо ----
    if (!item.lat || !item.lng) return;

    // ---- Додаємо маркер на карту ----
    let marker = L.marker([item.lat, item.lng]).addTo(map);
    marker.bindPopup(`<b>${item.name}</b><br>${item.address}`);
    allMarkers.push(marker);
  });
}
