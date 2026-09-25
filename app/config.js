export const CENTER = [105.1515, 10.2510];

export const CAMERA = {
  overview: { center: [105.1550, 10.2495], zoom: 13.35, pitch: 58, bearing: -28 },
  ancient:  { center: [105.1600, 10.2470], zoom: 13.75, pitch: 64, bearing: 22 },
  mountain: { center: [105.14540, 10.24628], zoom: 14.45, pitch: 72, bearing: 35 }
};

export const TERRAIN = {
  tiles: ["https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png"],
  encoding: "terrarium",
  tileSize: 256,
  maxzoom: 15,
  attribution: "Elevation: Mapzen/AWS Terrain Tiles"
};

export const BASEMAPS = {
  satellite: {
    tiles: ["https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"],
    attribution: "Imagery © Esri and contributors"
  },
  osm: {
    tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
    attribution: "© OpenStreetMap contributors"
  }
};

export const COLORS = {
  gold: "#e8c66e",
  ancient: "#54d2c5",
  present: "#ffbe55",
  zoneA: "#ff5b4a",
  zoneB: "#ffbd45",
  zoneC: "#52c8ff",
  zoneD: "#c687ff"
};

export const STORY = [
  { type: "poi", id: "ba-the", title: "01 · Núi Ba Thê" },
  { type: "poi", id: "oc-eo-town", title: "02 · Toàn cảnh Óc Eo" },
  { type: "poi", id: "linh-son-bac", title: "03 · Linh Sơn Bắc" },
  { type: "poi", id: "linh-son-co-tu", title: "04 · Linh Sơn Cổ Tự" },
  { type: "poi", id: "museum", title: "05 · Nhà trưng bày" },
  { type: "poi", id: "go-cay-thi", title: "06 · Gò Cây Thị A – B" },
  { type: "poi", id: "go-giong-cat", title: "07 · Gò Giồng Cát" }
];
