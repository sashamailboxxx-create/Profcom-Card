function renderAll(data) {
  listContainer.innerHTML = "";
  allMarkers.forEach(m => map.removeLayer(m));
  allMarkers = [];

  data.forEach(item => {
    // ==============================
    //  РЕНДЕР СПИСКУ
    // ==============================
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

        ${(item.site || item.website) ? `
          <a href="${escapeAttr(item.site || item.website)}" target="_blank" class="btn-link">
            <span class="icon">🌐</span> Сайт
          </a>` : ''}

        ${item.phone ? `
          <a href="tel:${escapeAttr(item.phone)}" class="btn-link">
            <span class="icon">📞</span> Подзвонити
          </a>` : ''}

        ${item.lat != null && item.lng != null ? `
          <button class="btn-map">📍 Показати на карті</button>
        ` : ''}
      </div>
    `;

    listContainer.appendChild(entry);

    // ==============================
    //  ЯКЩО НЕМА КООРДИНАТ — ТІЛЬКИ СПИСОК
    // ==============================
    if (item.lat == null || item.lng == null) return;

    // ==============================
    //  МАРКЕР
    // ==============================
    const marker = L.marker([Number(item.lat), Number(item.lng)]).addTo(map);

    marker.bindPopup(`
      <div style="font-size:14px; line-height:1.4;">
        <strong>${escapeHtml(item.name)}</strong><br>
        ${escapeHtml(item.address)}<br>
        <span>${escapeHtml(item.category)}</span><br><br>

        ${item.instagram ? `
          <a href="${escapeAttr(item.instagram)}" target="_blank">📸 Instagram</a><br>` : ''}

        ${(item.site || item.website) ? `
          <a href="${escapeAttr(item.site || item.website)}" target="_blank">🌐 Сайт</a><br>` : ''}

        ${item.phone ? `
          <a href="tel:${escapeAttr(item.phone)}">📞 Подзвонити</a>` : ''}
      </div>
    `);

    allMarkers.push(marker);

    // ==============================
    //  КЛІК ПО КАРТЦІ → КАРТА
    // ==============================
    entry.addEventListener("click", () => {
      map.setView([item.lat, item.lng], 15, { animate: true });

      setTimeout(() => {
        map.panBy([0, -150], { animate: true });
        marker.openPopup();
      }, 300);
    });

    // ==============================
    //  КНОПКА "ПОКАЗАТИ НА КАРТІ"
    // ==============================
    const mapBtn = entry.querySelector(".btn-map");

    if (mapBtn) {
      mapBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // не конфліктує з кліком по картці

        map.setView([item.lat, item.lng], 15, { animate: true });

        setTimeout(() => {
          map.panBy([0, -150], { animate: true });
          marker.openPopup();
        }, 300);
      });
    }
  });
}
