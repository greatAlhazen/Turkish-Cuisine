const lang = food.geometry.coordinates[0];
const lat = food.geometry.coordinates[1];

const map = new maplibregl.Map({
  container: "map",
  style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${mapApi}`, // stylesheet location
  center: [lang, lat], // starting position [lng, lat]
  zoom: 9,
});

map.addControl(new maplibregl.NavigationControl(), "bottom-right");

const marker = new maplibregl.Marker({
  color: "#fedf17",
})
  .setLngLat([lang, lat])
  .setPopup(new maplibregl.Popup().setHTML(`<h3>${food.title}</h3>`))
  .addTo(map);
