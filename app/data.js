const JSON_FILES = {
  scenes: "./data/registry/scene-registry.json",
  pois: "./data/registry/poi-registry.json",
  timeline: "./data/registry/timeline-registry.json",
  zones: "./data/gis/zones-abcd.geojson",
  canals: "./data/gis/ancient-canals.geojson",
  reconstruction: "./data/gis/reconstruction.geojson"
};

async function getJSON(url) {
  const res = await fetch(url, { cache: "no-cache" });
  if (!res.ok) throw new Error("Không tải được " + url + ": " + res.status);
  return res.json();
}

export async function loadTwinData() {
  const entries = await Promise.all(
    Object.entries(JSON_FILES).map(async function(entry) {
      return [entry[0], await getJSON(entry[1])];
    })
  );
  return Object.fromEntries(entries);
}

export function asPointCollection(items, kind) {
  kind = kind || "poi";
  return {
    type: "FeatureCollection",
    features: items.map(function(item) {
      return {
        type: "Feature",
        properties: {
          id: item.id,
          name: item.name || item.title,
          title: item.title || item.name,
          group: item.group || "",
          category: item.category || kind,
          accuracy: item.accuracy || item.anchorAccuracy || "unknown",
          zone: item.zone || ""
        },
        geometry: { type: "Point", coordinates: item.coordinates }
      };
    })
  };
}
