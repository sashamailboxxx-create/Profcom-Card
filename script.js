const map = L.map('map').setView([49.588, 34.551], 9);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
}).addTo(map);

let markers = [];
let shopData = [];

fetch('data.json')
  .then(r => r.json())
  .then(data => {
    shopData = data;
    renderMarkers(data);
    renderList(data);
  });

function renderMarkers(data) {
  markers.forEach(m => map.removeLayer(m));
  markers = [];

  data.forEach(shop => {
    if (shop.lat && shop.lng) {
      const marker = L.marker([shop.lat, shop.lng])
        .addTo(map)
        .bindPopup(`<b>${shop.name}</b><br>${shop.address}<br>${shop.category}`);

      markers.push(marker);
    }
  });
}

function renderList(data) {
  const list = document.getElementById("list");
  list.innerHTML = "";

  data.forEach(shop => {
    list.innerHTML += `
      <div class="item">
        <b>${shop.name}</b><br>
        ${shop.address}<br>
        Категорія: ${shop.category}
      </div>
    `;
  });
}

// Фільтр
document.getElementById("categoryFilter").addEventListener("change", e => {
  const val = e.target.value;

  if (val === "all") {
    renderMarkers(shopData);
    renderList(shopData);
  } else {
    const filtered = shopData.filter(s => s.category === val);
    renderMarkers(filtered);
    renderList(filtered);
  }
});
