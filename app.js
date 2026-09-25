/* Óc Eo – Ba Thê WebGIS
 * Static GitHub Pages build; no API key required.
 * Ranh giới trong DEMO là hình học minh họa, không phải hồ sơ pháp lý.
 */

const OFFICIAL_CENTER = [105.143333, 10.256667]; // UNESCO tentative-list coordinate
const BA_THE = [105.14540, 10.24628];
const OC_EO_TOWN = [105.15350, 10.25580];
const LINH_SON = [105.15498, 10.24658];

const POIS = [
  {
    id: "ba-the",
    name: "Núi Ba Thê",
    type: "Cảnh quan · khảo cổ",
    coord: BA_THE,
    note: "Điểm cao nổi bật trong toàn cảnh Óc Eo – Ba Thê, dùng làm mốc địa hình chính của mô phỏng.",
    accurate: true
  },
  {
    id: "oc-eo",
    name: "Không gian Óc Eo",
    type: "Khu khảo cổ",
    coord: OFFICIAL_CENTER,
    note: "Tọa độ tham chiếu trung tâm hồ sơ Óc Eo – Ba Thê trên danh sách dự kiến UNESCO.",
    accurate: true
  },
  {
    id: "town",
    name: "Óc Eo",
    type: "Đô thị hiện hữu",
    coord: OC_EO_TOWN,
    note: "Điểm tham chiếu khu dân cư Óc Eo trên nền bản đồ mở.",
    accurate: true
  },
  {
    id: "linh-son",
    name: "Linh Sơn Cổ Tự",
    type: "Di tích / tôn giáo",
    coord: LINH_SON,
    note: "Điểm liên kết giữa sườn Ba Thê và cụm di tích Linh Sơn.",
    accurate: true
  },
  {
    id: "go-cay-thi",
    name: "Gò Cây Thị A – B",
    type: "Khảo cổ",
    coord: [105.1519, 10.2522],
    note: "Vị trí hiển thị phục vụ dẫn chuyện và cần được thay bằng tọa độ khảo sát khi công bố chính thức.",
    accurate: false
  },
  {
    id: "go-ut-tranh",
    name: "Gò Út Trạnh",
    type: "Khảo cổ",
    coord: [105.1492, 10.2609],
    note: "Vị trí minh họa để kết nối với tour VR 360°.",
    accurate: false
  },
  {
    id: "go-giong-cat",
    name: "Gò Giồng Cát",
    type: "Khảo cổ",
    coord: [105.1584, 10.2600],
    note: "Vị trí minh họa để kết nối với tour VR 360°.",
    accurate: false
  },
  {
    id: "go-sau-thuan",
    name: "Gò Sáu Thuận",
    type: "Khảo cổ",
    coord: [105.1510, 10.2442],
    note: "Vị trí minh họa để kết nối với tour VR 360°.",
    accurate: false
  }
];

const PROTECTION = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Khu A – Ba Thê (minh họa)" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [105.1342,10.2668],[105.1488,10.2690],[105.1570,10.2630],
          [105.1592,10.2497],[105.1540,10.2407],[105.1422,10.2382],
          [105.1327,10.2448],[105.1298,10.2562],[105.1342,10.2668]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Khu B – cánh đồng Óc Eo (minh họa)" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [105.1550,10.2620],[105.1778,10.2592],[105.1809,10.2462],
          [105.1719,10.2315],[105.1531,10.2320],[105.1456,10.2444],
          [105.1550,10.2620]
        ]]
      }
    }
  ]
};

const ARCHAEOLOGY = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Cụm sườn núi – Linh Sơn (minh họa)" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [105.1461,10.2584],[105.1548,10.2587],[105.1581,10.2513],
          [105.1538,10.2442],[105.1462,10.2451],[105.1423,10.2511],
          [105.1461,10.2584]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { name: "Cụm cánh đồng khảo cổ (minh họa)" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [105.1580,10.2564],[105.1740,10.2526],[105.1741,10.2383],
          [105.1620,10.2347],[105.1519,10.2425],[105.1580,10.2564]
        ]]
      }
    }
  ]
};

const poiGeoJSON = {
  type: "FeatureCollection",
  features: POIS.map(p => ({
    type: "Feature",
    properties: {
      id: p.id,
      name: p.name,
      type: p.type,
      note: p.note,
      accurate: p.accurate ? "verified_reference" : "illustrative"
    },
    geometry: { type: "Point", coordinates: p.coord }
  }))
};

const style = {
  version: 8,
  glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "© OpenStreetMap contributors"
    }
  },
  layers: [
    { id: "osm", type: "raster", source: "osm", paint: { "raster-saturation": -0.18, "raster-contrast": 0.08, "raster-brightness-min": 0.08, "raster-brightness-max": 0.92 } }
  ]
};

const map = new maplibregl.Map({
  container: "map",
  style,
  center: OFFICIAL_CENTER,
  zoom: 13.15,
  pitch: 56,
  bearing: -28,
  antialias: true,
  maxPitch: 85
});

map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "top-right");
map.addControl(new maplibregl.ScaleControl({ maxWidth: 120, unit: "metric" }), "bottom-right");

let terrainEnabled = true;
let terrainExaggeration = 1.8;
let orbitTimer = null;
let storyIndex = 0;
let pulseFrame = null;
let toastTimer = null;

function addSourcesAndLayers() {
  map.addSource("terrain-dem", {
    type: "raster-dem",
    url: "https://demotiles.maplibre.org/terrain-tiles/tiles.json",
    tileSize: 256
  });

  map.setTerrain({ source: "terrain-dem", exaggeration: terrainExaggeration });

  map.addLayer({
    id: "hillshade",
    type: "hillshade",
    source: "terrain-dem",
    paint: {
      "hillshade-shadow-color": "#27301d",
      "hillshade-highlight-color": "#f2dca0",
      "hillshade-accent-color": "#786433",
      "hillshade-exaggeration": 0.42
    }
  });

  map.addSource("protection", { type: "geojson", data: PROTECTION });
  map.addLayer({
    id: "protection-fill",
    type: "fill",
    source: "protection",
    paint: { "fill-color": "#ff3b32", "fill-opacity": 0.025 }
  });
  map.addLayer({
    id: "protection-line",
    type: "line",
    source: "protection",
    paint: {
      "line-color": "#ff3b32",
      "line-width": 4,
      "line-dasharray": [2, 2],
      "line-opacity": 0.95
    }
  });

  map.addSource("archaeology", { type: "geojson", data: ARCHAEOLOGY });
  map.addLayer({
    id: "archaeology-fill",
    type: "fill",
    source: "archaeology",
    paint: { "fill-color": "#ff42c6", "fill-opacity": 0.035 }
  });
  map.addLayer({
    id: "archaeology-line",
    type: "line",
    source: "archaeology",
    paint: {
      "line-color": "#ff42c6",
      "line-width": 2.6,
      "line-dasharray": [1.4, 1.2],
      "line-opacity": 0.9
    }
  });

  map.addSource("pois", { type: "geojson", data: poiGeoJSON });
  map.addLayer({
    id: "poi-halo",
    type: "circle",
    source: "pois",
    paint: {
      "circle-radius": 11,
      "circle-color": "#e7c46b",
      "circle-opacity": 0.17,
      "circle-blur": 0.5
    }
  });
  map.addLayer({
    id: "poi-points",
    type: "circle",
    source: "pois",
    paint: {
      "circle-radius": 5.5,
      "circle-color": [
        "case",
        ["==", ["get", "accurate"], "verified_reference"], "#f4d77d",
        "#ff9fe1"
      ],
      "circle-stroke-color": "#142018",
      "circle-stroke-width": 2
    }
  });

  addPoiLabels();
  animatePulse();
}

function addPoiLabels() {
  const labels = [
    { name: "Núi Ba Thê", coord: BA_THE, anchor: "left" },
    { name: "Khu di tích Óc Eo", coord: OFFICIAL_CENTER, anchor: "left" },
    { name: "Linh Sơn Cổ Tự", coord: LINH_SON, anchor: "left" }
  ];
  labels.forEach(item => {
    const el = document.createElement("div");
    el.className = "map-label";
    el.textContent = item.name;
    Object.assign(el.style, {
      color: "#182019",
      background: "rgba(248,244,231,.94)",
      border: "1px solid rgba(35,48,39,.28)",
      boxShadow: "0 5px 18px rgba(0,0,0,.20)",
      borderRadius: "8px",
      padding: "5px 8px",
      font: '700 11px Georgia,"Times New Roman",serif',
      whiteSpace: "nowrap",
      pointerEvents: "none"
    });
    new maplibregl.Marker({ element: el, anchor: item.anchor, offset: [9, 0] })
      .setLngLat(item.coord)
      .addTo(map);
  });
}

function animatePulse() {
  let start = performance.now();
  const tick = now => {
    if (!map.getLayer("poi-halo")) return;
    const t = ((now - start) % 1800) / 1800;
    const radius = 8 + t * 14;
    const opacity = 0.24 * (1 - t);
    map.setPaintProperty("poi-halo", "circle-radius", radius);
    map.setPaintProperty("poi-halo", "circle-opacity", opacity);
    pulseFrame = requestAnimationFrame(tick);
  };
  pulseFrame = requestAnimationFrame(tick);
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function popupHTML(p) {
  const reference = p.accurate
    ? "Tọa độ tham chiếu từ nguồn bản đồ / hồ sơ công khai."
    : "Vị trí minh họa – cần thay bằng tọa độ khảo sát chính thức.";
  return `
    <div class="poi-popup">
      <h3>${p.name}</h3>
      <p><b>${p.type}</b><br>${p.note}<br><em>${reference}</em></p>
      <a href="./vr.html" target="_blank" rel="noopener">Mở tour VR 360° ↗</a>
    </div>`;
}

function fly(target, opts = {}) {
  stopOrbit();
  map.flyTo({
    center: target,
    zoom: opts.zoom ?? 14.4,
    pitch: opts.pitch ?? 64,
    bearing: opts.bearing ?? -25,
    speed: opts.speed ?? 0.65,
    curve: 1.45,
    essential: true
  });
}

function startOrbit() {
  if (orbitTimer) return stopOrbit();
  document.getElementById("btnOrbit").classList.add("active");
  document.getElementById("btnOrbit").innerHTML = "<span>■</span><b>Dừng bay</b>";
  showToast("Đang bay mô phỏng quanh không gian Óc Eo – Ba Thê");
  map.easeTo({ center: [105.1490,10.2505], zoom: 13.65, pitch: 64, duration: 1200 });
  orbitTimer = setInterval(() => {
    map.easeTo({ bearing: map.getBearing() + 12, pitch: 64, duration: 950, easing: t => t });
  }, 900);
}

function stopOrbit() {
  if (!orbitTimer) return;
  clearInterval(orbitTimer);
  orbitTimer = null;
  const b = document.getElementById("btnOrbit");
  b.classList.remove("active");
  b.innerHTML = "<span>◉</span><b>Bay tự động</b>";
}

const story = [
  {
    title: "Núi Ba Thê",
    coord: BA_THE, zoom: 14.15, pitch: 72, bearing: 28,
    text: "Khởi đầu từ điểm địa hình nổi bật. Góc nhìn xiên giúp thấy tương quan giữa khối núi và vùng đồng bằng xung quanh."
  },
  {
    title: "Không gian Óc Eo",
    coord: OFFICIAL_CENTER, zoom: 14.1, pitch: 58, bearing: -35,
    text: "Tọa độ tham chiếu trung tâm di sản. Ranh đỏ và hồng trên trang là lớp minh họa để người xem nhận biết cấu trúc không gian."
  },
  {
    title: "Linh Sơn Cổ Tự",
    coord: LINH_SON, zoom: 15.2, pitch: 67, bearing: 75,
    text: "Điểm nối giữa sườn Ba Thê, không gian tín ngưỡng và các dấu tích khảo cổ Linh Sơn."
  },
  {
    title: "Gò Cây Thị A – B",
    coord: [105.1519,10.2522], zoom: 15.1, pitch: 60, bearing: -80,
    text: "Một điểm quan trọng trong tour VR. Marker hiện tại mang tính minh họa và cần được thay bằng dữ liệu đo đạc khi triển khai chính thức."
  },
  {
    title: "Cánh đồng Óc Eo",
    coord: [105.1660,10.2460], zoom: 13.9, pitch: 57, bearing: -35,
    text: "Góc nhìn mở sang vùng đồng bằng để hình dung quan hệ giữa địa hình, thủy hệ, cư trú và các cụm di tích."
  },
  {
    title: "Toàn cảnh di sản",
    coord: [105.1490,10.2505], zoom: 13.35, pitch: 68, bearing: 145,
    text: "Kết thúc bằng góc nhìn toàn cảnh. Có thể chuyển sang VR 360° để đi sâu vào các cảnh thực địa."
  }
];

function openStory(i = 0) {
  storyIndex = (i + story.length) % story.length;
  const s = story[storyIndex];
  const card = document.getElementById("storyCard");
  card.classList.add("show");
  document.getElementById("storyIndex").textContent = `${String(storyIndex + 1).padStart(2,"0")} / ${String(story.length).padStart(2,"0")}`;
  document.getElementById("storyTitle").textContent = s.title;
  document.getElementById("storyText").textContent = s.text;
  fly(s.coord, s);
}

function setVisibility(ids, visible) {
  ids.forEach(id => {
    if (map.getLayer(id)) map.setLayoutProperty(id, "visibility", visible ? "visible" : "none");
  });
}

function updateStatus() {
  const c = map.getCenter();
  document.getElementById("coordStatus").textContent = `${c.lat.toFixed(4)}°N · ${c.lng.toFixed(4)}°E`;
  document.getElementById("zoomStatus").textContent = `Zoom ${map.getZoom().toFixed(1)}`;
  document.getElementById("cameraStatus").textContent = `${terrainEnabled ? "3D" : "2D"} · Pitch ${Math.round(map.getPitch())}°`;
}

map.on("load", () => {
  addSourcesAndLayers();
  updateStatus();
  showToast("WebGIS 3D Óc Eo – Ba Thê đã sẵn sàng");
});

map.on("move", updateStatus);

map.on("click", "poi-points", e => {
  const f = e.features && e.features[0];
  if (!f) return;
  const p = POIS.find(x => x.id === f.properties.id);
  if (!p) return;
  new maplibregl.Popup({ offset: 12, maxWidth: "300px" })
    .setLngLat(p.coord)
    .setHTML(popupHTML(p))
    .addTo(map);
});

map.on("mouseenter", "poi-points", () => map.getCanvas().style.cursor = "pointer");
map.on("mouseleave", "poi-points", () => map.getCanvas().style.cursor = "");

document.getElementById("terrainSwitch").addEventListener("click", e => {
  terrainEnabled = !terrainEnabled;
  e.currentTarget.classList.toggle("is-on", terrainEnabled);
  e.currentTarget.setAttribute("aria-pressed", terrainEnabled ? "true" : "false");
  if (terrainEnabled) {
    map.setTerrain({ source: "terrain-dem", exaggeration: terrainExaggeration });
    map.easeTo({ pitch: 56, duration: 800 });
  } else {
    map.setTerrain(null);
    map.easeTo({ pitch: 0, duration: 800 });
  }
  updateStatus();
});

document.getElementById("terrainRange").addEventListener("input", e => {
  terrainExaggeration = Number(e.target.value);
  document.getElementById("terrainValue").textContent = terrainExaggeration.toFixed(1) + "×";
  if (terrainEnabled) map.setTerrain({ source: "terrain-dem", exaggeration: terrainExaggeration });
});

document.getElementById("boundaryToggle").addEventListener("change", e => setVisibility(["protection-fill","protection-line"], e.target.checked));
document.getElementById("archaeologyToggle").addEventListener("change", e => setVisibility(["archaeology-fill","archaeology-line"], e.target.checked));
document.getElementById("hillshadeToggle").addEventListener("change", e => setVisibility(["hillshade"], e.target.checked));
document.getElementById("labelsToggle").addEventListener("change", e => {
  setVisibility(["poi-halo","poi-points"], e.target.checked);
  document.querySelectorAll(".map-label").forEach(el => el.style.display = e.target.checked ? "" : "none");
});

document.getElementById("btnOverview").addEventListener("click", () => fly([105.1490,10.2505], { zoom:13.2,pitch:62,bearing:-28 }));
document.getElementById("btnMountain").addEventListener("click", () => fly(BA_THE, { zoom:14.35,pitch:72,bearing:32 }));
document.getElementById("btnSite").addEventListener("click", () => fly(OFFICIAL_CENTER, { zoom:14.45,pitch:58,bearing:-42 }));
document.getElementById("btnOrbit").addEventListener("click", startOrbit);
document.getElementById("btnStory").addEventListener("click", () => openStory(0));
document.getElementById("storyPrev").addEventListener("click", () => openStory(storyIndex - 1));
document.getElementById("storyNext").addEventListener("click", () => openStory(storyIndex + 1));
document.getElementById("storyClose").addEventListener("click", () => document.getElementById("storyCard").classList.remove("show"));

document.getElementById("closePanel").addEventListener("click", () => {
  document.getElementById("panel").classList.add("hidden");
  document.getElementById("openPanel").classList.add("show");
});
document.getElementById("openPanel").addEventListener("click", () => {
  document.getElementById("panel").classList.remove("hidden");
  document.getElementById("openPanel").classList.remove("show");
});

const infoDialog = document.getElementById("infoDialog");
document.getElementById("btnInfo").addEventListener("click", () => infoDialog.showModal());
document.getElementById("dialogClose").addEventListener("click", () => infoDialog.close());

window.addEventListener("keydown", e => {
  if (e.key === "Escape") stopOrbit();
  if (e.key.toLowerCase() === "r") fly([105.1490,10.2505], { zoom:13.2,pitch:62,bearing:-28 });
});

window.addEventListener("beforeunload", () => {
  stopOrbit();
  if (pulseFrame) cancelAnimationFrame(pulseFrame);
});
