import { BASEMAPS, CAMERA, CENTER, TERRAIN, COLORS } from "./config.js";
import { asPointCollection } from "./data.js";

export class HeritageTwinMap {
  constructor(container, data) {
    this.data = data;
    this.handlers = {};
    this.terrainEnabled = true;
    this.terrainExaggeration = 1.35;
    this.timelineValue = 100;

    this.map = new maplibregl.Map({
      container: container,
      center: CENTER,
      zoom: CAMERA.overview.zoom,
      pitch: CAMERA.overview.pitch,
      bearing: CAMERA.overview.bearing,
      maxPitch: 85,
      antialias: true,
      style: {
        version: 8,
        glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
        sources: {
          satellite: {
            type: "raster",
            tiles: BASEMAPS.satellite.tiles,
            tileSize: 256,
            attribution: BASEMAPS.satellite.attribution
          },
          osm: {
            type: "raster",
            tiles: BASEMAPS.osm.tiles,
            tileSize: 256,
            attribution: BASEMAPS.osm.attribution
          }
        },
        layers: [
          { id: "satellite", type: "raster", source: "satellite", paint: { "raster-opacity": 0.88, "raster-saturation": -0.12, "raster-contrast": 0.08 } },
          { id: "osm", type: "raster", source: "osm", layout: { visibility: "none" }, paint: { "raster-opacity": 0.86, "raster-saturation": -0.2 } }
        ]
      }
    });

    this.map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "top-right");
    this.map.addControl(new maplibregl.ScaleControl({ maxWidth: 130, unit: "metric" }), "bottom-right");
  }

  on(name, handler) { this.handlers[name] = handler; }

  async init() {
    await new Promise(resolve => this.map.once("load", resolve));

    this.map.addSource("terrain-dem", {
      type: "raster-dem",
      tiles: TERRAIN.tiles,
      tileSize: TERRAIN.tileSize,
      maxzoom: TERRAIN.maxzoom,
      encoding: TERRAIN.encoding,
      attribution: TERRAIN.attribution
    });
    this.map.setTerrain({ source: "terrain-dem", exaggeration: this.terrainExaggeration });

    this.map.addLayer({
      id: "hillshade",
      type: "hillshade",
      source: "terrain-dem",
      paint: {
        "hillshade-shadow-color": "#07110d",
        "hillshade-highlight-color": "#fff1b4",
        "hillshade-accent-color": "#806738",
        "hillshade-exaggeration": 0.38
      }
    });

    this.map.addSource("zones", { type: "geojson", data: this.data.zones });
    this.map.addLayer({
      id: "zones-fill", type: "fill", source: "zones",
      paint: {
        "fill-color": ["match", ["get","zone"], "A", COLORS.zoneA, "B", COLORS.zoneB, "C", COLORS.zoneC, "D", COLORS.zoneD, "#ffffff"],
        "fill-opacity": 0.08
      }
    });
    this.map.addLayer({
      id: "zones-line", type: "line", source: "zones",
      paint: {
        "line-color": ["match", ["get","zone"], "A", COLORS.zoneA, "B", COLORS.zoneB, "C", COLORS.zoneC, "D", COLORS.zoneD, "#ffffff"],
        "line-width": 3,
        "line-dasharray": [2, 1.5],
        "line-opacity": 0.9
      }
    });
    this.map.addLayer({
      id: "zones-label", type: "symbol", source: "zones",
      layout: {
        "text-field": ["concat", "KHU ", ["get","zone"]],
        "text-size": 18,
        "text-font": ["Open Sans Bold"],
        "text-letter-spacing": 0.12
      },
      paint: {
        "text-color": "#fff6da",
        "text-halo-color": "rgba(4,12,8,.85)",
        "text-halo-width": 2
      }
    });

    this.map.addSource("ancient-canals", { type: "geojson", data: this.data.canals });
    this.map.addLayer({
      id: "ancient-canals-glow", type: "line", source: "ancient-canals",
      paint: { "line-color": COLORS.ancient, "line-width": 9, "line-opacity": 0.16, "line-blur": 5 }
    });
    this.map.addLayer({
      id: "ancient-canals", type: "line", source: "ancient-canals",
      paint: { "line-color": COLORS.ancient, "line-width": 3.1, "line-opacity": 0.78, "line-dasharray": [3, 1.5] }
    });

    this.map.addSource("reconstruction", { type: "geojson", data: this.data.reconstruction });
    this.map.addLayer({
      id: "reconstruction-ancient",
      type: "fill-extrusion",
      source: "reconstruction",
      filter: ["==", ["get","kind"], "ancient"],
      paint: {
        "fill-extrusion-color": "#45cfc0",
        "fill-extrusion-height": ["get","height"],
        "fill-extrusion-base": 0,
        "fill-extrusion-opacity": 0.14
      }
    });
    this.map.addLayer({
      id: "reconstruction-present",
      type: "fill-extrusion",
      source: "reconstruction",
      filter: ["==", ["get","kind"], "present"],
      paint: {
        "fill-extrusion-color": "#e8b95d",
        "fill-extrusion-height": ["get","height"],
        "fill-extrusion-base": 0,
        "fill-extrusion-opacity": 0.74
      }
    });

    this.map.addSource("heritage-pois", { type: "geojson", data: asPointCollection(this.data.pois) });
    this.map.addLayer({
      id: "poi-halo", type: "circle", source: "heritage-pois",
      paint: { "circle-radius": 15, "circle-color": COLORS.gold, "circle-opacity": 0.14, "circle-blur": 0.6 }
    });
    this.map.addLayer({
      id: "poi-points", type: "circle", source: "heritage-pois",
      paint: {
        "circle-radius": ["interpolate",["linear"],["zoom"],11,4,15,7],
        "circle-color": ["match",["get","accuracy"],"reference","#f2d37e","curated","#ffd965","#ff9bca"],
        "circle-stroke-color": "#07120d",
        "circle-stroke-width": 2
      }
    });
    this.map.addLayer({
      id: "poi-labels", type: "symbol", source: "heritage-pois",
      minzoom: 12.6,
      layout: {
        "text-field": ["get","name"],
        "text-size": 12,
        "text-font": ["Open Sans Semibold"],
        "text-offset": [0, 1.3],
        "text-anchor": "top",
        "text-allow-overlap": false
      },
      paint: {
        "text-color": "#fff9e8",
        "text-halo-color": "rgba(4,12,8,.88)",
        "text-halo-width": 1.7
      }
    });

    this.map.addSource("vr-scenes", { type: "geojson", data: asPointCollection(this.data.scenes, "scene") });
    this.map.addLayer({
      id: "scene-points", type: "circle", source: "vr-scenes",
      layout: { visibility: "none" },
      paint: {
        "circle-radius": 4,
        "circle-color": "#8be7ff",
        "circle-opacity": 0.78,
        "circle-stroke-color": "#06100d",
        "circle-stroke-width": 1.5
      }
    });

    this.map.on("click", "poi-points", e => {
      const id = e.features && e.features[0] && e.features[0].properties.id;
      const poi = this.data.pois.find(p => p.id === id);
      if (poi && this.handlers.poi) this.handlers.poi(poi);
    });
    this.map.on("click", "scene-points", e => {
      const id = e.features && e.features[0] && e.features[0].properties.id;
      const scene = this.data.scenes.find(s => s.id === id);
      if (scene && this.handlers.scene) this.handlers.scene(scene);
    });
    ["poi-points","scene-points"].forEach(layer => {
      this.map.on("mouseenter", layer, () => this.map.getCanvas().style.cursor = "pointer");
      this.map.on("mouseleave", layer, () => this.map.getCanvas().style.cursor = "");
    });

    this.map.on("move", () => {
      if (this.handlers.camera) this.handlers.camera(this.cameraState());
    });
    this.applyTimeline(100);
    this.flyCamera(CAMERA.overview, 0);
  }

  cameraState() {
    const c = this.map.getCenter();
    return { lng:c.lng, lat:c.lat, zoom:this.map.getZoom(), pitch:this.map.getPitch(), bearing:this.map.getBearing() };
  }

  flyCamera(camera, duration) {
    this.map.flyTo(Object.assign({}, camera, { duration: duration === undefined ? 1800 : duration, essential:true, curve:1.35 }));
  }

  focusPoi(poi) {
    const mountain = poi.id === "ba-the";
    this.flyCamera({ center:poi.coordinates, zoom:mountain?14.55:15.2, pitch:mountain?72:62, bearing:mountain?38:-24 });
  }

  focusScene(scene) {
    this.flyCamera({ center:scene.coordinates, zoom:scene.viewType==="aerial"?14.35:16.2, pitch:scene.viewType==="aerial"?68:54, bearing:scene.viewType==="aerial"?-35:12 });
  }

  setBasemap(name) {
    const sat = name === "satellite";
    this.map.setLayoutProperty("satellite","visibility",sat?"visible":"none");
    this.map.setLayoutProperty("osm","visibility",sat?"none":"visible");
  }

  setTerrain(enabled) {
    this.terrainEnabled = enabled;
    this.map.setTerrain(enabled ? { source:"terrain-dem", exaggeration:this.terrainExaggeration } : null);
    if (!enabled) this.map.easeTo({pitch:0,duration:700});
  }

  setTerrainExaggeration(value) {
    this.terrainExaggeration = Number(value);
    if (this.terrainEnabled) this.map.setTerrain({ source:"terrain-dem", exaggeration:this.terrainExaggeration });
  }

  setLayer(name, visible) {
    const groups = {
      zones:["zones-fill","zones-line","zones-label"],
      canals:["ancient-canals-glow","ancient-canals"],
      reconstruction:["reconstruction-ancient","reconstruction-present"],
      scenes:["scene-points"],
      hillshade:["hillshade"],
      pois:["poi-halo","poi-points","poi-labels"]
    };
    (groups[name] || []).forEach(id => {
      if (this.map.getLayer(id)) this.map.setLayoutProperty(id,"visibility",visible?"visible":"none");
    });
  }

  applyTimeline(value) {
    this.timelineValue = Number(value);
    if (!this.map.getLayer("satellite")) return;
    const t = this.timelineValue / 100;
    const ancient = 1 - t;
    const middle = 1 - Math.abs(this.timelineValue - 50) / 50;
    this.map.setPaintProperty("satellite","raster-opacity",0.25 + 0.65*t);
    this.map.setPaintProperty("ancient-canals","line-opacity",0.2 + 0.78*ancient);
    this.map.setPaintProperty("ancient-canals-glow","line-opacity",0.04 + 0.22*ancient);
    this.map.setPaintProperty("reconstruction-ancient","fill-extrusion-opacity",0.08 + 0.76*ancient);
    this.map.setPaintProperty("reconstruction-present","fill-extrusion-opacity",0.18 + 0.62*t);
    this.map.setPaintProperty("zones-fill","fill-opacity",0.035 + 0.12*middle);
    this.map.setPaintProperty("zones-line","line-opacity",0.35 + 0.6*Math.max(middle,.35));
    this.map.setPaintProperty("poi-points","circle-opacity",0.42 + 0.58*t);
    this.map.setPaintProperty("poi-labels","text-opacity",0.36 + 0.64*t);
    if (this.timelineValue < 28) this.flyCamera(CAMERA.ancient,1100);
  }

  queryElevation(coord) {
    try {
      const v = this.map.queryTerrainElevation({lng:coord[0],lat:coord[1]}, {exaggerated:false});
      return Number.isFinite(v) ? v : null;
    } catch (e) { return null; }
  }
}
