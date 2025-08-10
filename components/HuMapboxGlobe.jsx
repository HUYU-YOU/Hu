import React, { useEffect, useMemo, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";

// Fallback public token so the globe renders without a local token
const PUBLIC_TOKEN =
  "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.V_B6CdrQywqlOg6IaUBjbg";
mapboxgl.accessToken =
  process.env.NEXT_PUBLIC_MAPBOX_TOKEN || PUBLIC_TOKEN;

// Palette d’humeurs (hex + emotion + emoji)
const HU_COLORS = {
  yellow: { hex: "#FFD400", emotion: "joie & créativité", emoji: "😊" },
  blue: { hex: "#2F80ED", emotion: "curiosité & apprendre", emoji: "🧠" },
  red: { hex: "#EB5757", emotion: "colère & révolution", emoji: "🔥" },
  green: { hex: "#27AE60", emotion: "nature & apaisement", emoji: "🌿" },
  orange: { hex: "#F2994A", emotion: "énergie", emoji: "⚡" },
  black: { hex: "#111111", emotion: "besoin d'aide urgente", emoji: "🆘" },
};

// Bornes géographiques de quelques pays (pour le zoom)
const COUNTRY_BOUNDS = {
  France: [-5.5, 41.0, 9.9, 51.5],
  Ukraine: [22.0, 44.0, 40.5, 52.5],
  Gaza: [34.2, 31.2, 34.6, 31.7],
  Chine: [73.0, 18.0, 135.1, 53.6],
  "États-Unis": [-125.0, 24.5, -66.5, 49.5],
  Canada: [-141.0, 41.7, -52.6, 83.1],
  Brésil: [-74.0, -34.0, -34.7, 5.4],
  Espagne: [-9.5, 36.0, 3.3, 43.9],
  Italie: [6.6, 36.0, 18.8, 47.1],
  Allemagne: [5.9, 47.2, 15.1, 55.1],
  "Royaume-Uni": [-8.7, 49.8, 1.8, 60.9],
  Pologne: [14.1, 49.0, 24.2, 55.2],
  Turquie: [25.7, 35.8, 44.8, 42.1],
  Maroc: [-13.2, 27.6, -1.0, 35.9],
  Nigéria: [2.7, 4.0, 14.7, 13.9],
  "Afrique du Sud": [16.0, -35.0, 33.0, -22.1],
  Inde: [68.0, 6.5, 97.5, 35.6],
  Pakistan: [60.9, 23.5, 77.8, 37.1],
  Bangladesh: [88.0, 20.6, 92.7, 26.6],
  Japon: [123.0, 24.0, 146.2, 45.6],
  "Corée du Sud": [124.5, 33.0, 131.0, 38.9],
  Indonésie: [95.0, -11.0, 141.0, 6.0],
  Philippines: [116.0, 4.0, 127.0, 21.0],
  Australie: [112.0, -44.0, 154.0, -10.0],
  Mexique: [-118.5, 14.4, -86.5, 32.8],
  Argentine: [-73.6, -55.1, -53.6, -21.8],
  Colombie: [-79.1, -4.2, -66.8, 13.4],
  Égypte: [24.7, 22.0, 36.9, 31.7],
  "Arabie saoudite": [34.5, 16.4, 55.7, 32.2],
  "Émirats arabes unis": [51.5, 22.6, 56.6, 26.4],
};

// Capitales (avec poids démographique) pour générer des exemples de points
const CAPITALS = [
  { country: "France", city: "Paris", lat: 48.8566, lng: 2.3522, pop: 11.0 },
  { country: "Ukraine", city: "Kyiv", lat: 50.4501, lng: 30.5234, pop: 3.0 },
  { country: "Gaza", city: "Gaza City", lat: 31.522, lng: 34.451, pop: 0.7 },
  { country: "Chine", city: "Beijing", lat: 39.9042, lng: 116.4074, pop: 21.0 },
  { country: "Chine", city: "Shanghai", lat: 31.2304, lng: 121.4737, pop: 25.0 },
  { country: "États-Unis", city: "New York", lat: 40.7128, lng: -74.006, pop: 20.0 },
  { country: "États-Unis", city: "Los Angeles", lat: 34.0522, lng: -118.2437, pop: 13.0 },
  { country: "Brésil", city: "São Paulo", lat: -23.5558, lng: -46.6396, pop: 22.0 },
  { country: "Brésil", city: "Rio", lat: -22.9068, lng: -43.1729, pop: 13.0 },
  { country: "Italie", city: "Rome", lat: 41.9028, lng: 12.4964, pop: 4.2 },
  { country: "Allemagne", city: "Berlin", lat: 52.52, lng: 13.405, pop: 6.2 },
  { country: "Espagne", city: "Madrid", lat: 40.4168, lng: -3.7038, pop: 6.7 },
  { country: "Royaume-Uni", city: "Londres", lat: 51.5074, lng: -0.1278, pop: 9.5 },
  { country: "Pologne", city: "Varsovie", lat: 52.2297, lng: 21.0122, pop: 3.1 },
  { country: "Turquie", city: "Istanbul", lat: 41.0082, lng: 28.9784, pop: 15.5 },
  { country: "Maroc", city: "Casablanca", lat: 33.5731, lng: -7.5898, pop: 3.7 },
  { country: "Nigéria", city: "Lagos", lat: 6.5244, lng: 3.3792, pop: 21.0 },
  { country: "Afrique du Sud", city: "Johannesburg", lat: -26.2041, lng: 28.0473, pop: 6.1 },
  { country: "Inde", city: "Delhi", lat: 28.6139, lng: 77.209, pop: 32.0 },
  { country: "Pakistan", city: "Karachi", lat: 24.8607, lng: 67.0011, pop: 16.0 },
  { country: "Bangladesh", city: "Dhaka", lat: 23.8103, lng: 90.4125, pop: 22.0 },
  { country: "Japon", city: "Tokyo", lat: 35.6762, lng: 139.6503, pop: 37.0 },
  { country: "Corée du Sud", city: "Seoul", lat: 37.5665, lng: 126.978, pop: 25.0 },
  { country: "Indonésie", city: "Jakarta", lat: -6.2088, lng: 106.8456, pop: 34.0 },
  { country: "Philippines", city: "Manille", lat: 14.5995, lng: 120.9842, pop: 13.0 },
  { country: "Australie", city: "Sydney", lat: -33.8688, lng: 151.2093, pop: 5.3 },
  { country: "Canada", city: "Toronto", lat: 43.6532, lng: -79.3832, pop: 6.5 },
  { country: "Mexique", city: "Mexico", lat: 19.4326, lng: -99.1332, pop: 21.0 },
  { country: "Argentine", city: "Buenos Aires", lat: -34.6037, lng: -58.3816, pop: 15.0 },
  { country: "Colombie", city: "Bogotá", lat: 4.711, lng: -74.0721, pop: 10.7 },
  { country: "Égypte", city: "Le Caire", lat: 30.0444, lng: 31.2357, pop: 20.0 },
  { country: "Arabie saoudite", city: "Riyad", lat: 24.7136, lng: 46.6753, pop: 7.7 },
  { country: "Émirats arabes unis", city: "Dubaï", lat: 25.2048, lng: 55.2708, pop: 3.5 },
];

// Pondérations spéciales pour certaines zones
const EUROPE = new Set([
  "France",
  "Royaume-Uni",
  "Espagne",
  "Italie",
  "Allemagne",
  "Pologne",
  "Ukraine",
]);
const COUNTRY_COLOR_WEIGHTS = {
  Ukraine: { black: 8, red: 3, blue: 1, yellow: 1 },
  Gaza: { black: 10, red: 4 },
  Chine: { blue: 8, yellow: 2, orange: 1 },
  "États-Unis": { yellow: 5, orange: 5, red: 2 },
  Canada: { yellow: 3, orange: 2 },
  Brésil: { orange: 4, yellow: 2 },
};

function weightsFor(country) {
  const base = {
    yellow: 2,
    blue: 2,
    red: 2,
    green: 2,
    orange: 2,
    black: 1,
  };
  if (EUROPE.has(country)) base.green += 4;
  const o = COUNTRY_COLOR_WEIGHTS[country];
  if (o) for (const k in o) base[k] = (base[k] || 0) + o[k];
  return base;
}

function pickWeightedColor(weights) {
  const entries = Object.entries(weights);
  const total = entries.reduce((sum, [, w]) => sum + w, 0);
  let r = Math.random() * total;
  for (const [id, weight] of entries) {
    r -= weight;
    if (r <= 0) return id;
  }
  return "yellow";
}

const TITLES_BY_COLOR = {
  yellow: ["Sketch", "Impro", "Danse", "Beatmaking", "Peinture"],
  blue: ["Cours", "Tuto", "Histoire", "Vulgarisation", "Explication"],
  red: ["Coup de gueule", "Appel", "Débat", "Manif", "Tribune"],
  green: ["Animaux", "Jardin", "Nature", "Forêt", "Océan"],
  orange: ["Entraînement", "Sport", "Projet", "Bricolage", "Travail"],
  black: ["Aide urgente", "SOS", "Danger", "Soutien", "Signalement"],
};

const randChoice = (xs) => xs[Math.floor(Math.random() * xs.length)];

function jitterAround(lat, lng) {
  const deg = Math.random() * 1.2 + 0.1;
  return { lat: lat + (Math.random() - 0.5) * deg, lng: lng + (Math.random() - 0.5) * deg };
}

function generateFeatures(n = 700, bias = true) {
  const totalPop = CAPITALS.reduce((sum, c) => sum + c.pop, 0);
  const feats = [];
  let id = 1;
  for (const c of CAPITALS) {
    const share = Math.max(1, Math.round((c.pop / totalPop) * n));
    for (let i = 0; i < share; i++) {
      const { lat, lng } = jitterAround(c.lat, c.lng);
      const color = pickWeightedColor(bias ? weightsFor(c.country) : weightsFor(""));
      const type = Math.random() < 0.75 ? "video" : "live";
      const base = randChoice(TITLES_BY_COLOR[color]);
      feats.push({
        type: "Feature",
        geometry: { type: "Point", coordinates: [lng, lat] },
        properties: {
          id: "p" + id,
          title: `${base} ${id}`,
          color,
          colorHex: HU_COLORS[color].hex,
          type,
          country: c.country,
          city: c.city,
        },
      });
      id += 1;
    }
  }
  return feats;
}

function dayFactorLocal() {
  const d = new Date();
  const t = d.getHours() + d.getMinutes() / 60;
  const k = Math.cos(((t - 12) * Math.PI) / 12);
  return Math.max(0, 1 - (k + 1) / 2);
}

export default function HuMapboxGlobe() {
  const mapRef = useRef(null);
  const mapContainer = useRef(null);

  const [showVideo, setShowVideo] = useState(true);
  const [showLive, setShowLive] = useState(true);
  const [selectedColors, setSelectedColors] = useState(
    new Set(Object.keys(HU_COLORS))
  );
  const [biasOn, setBiasOn] = useState(true);

  const [allFeats, setAllFeats] = useState(() => generateFeatures(700, true));
  const [feed, setFeed] = useState([]);
  const [feedPage, setFeedPage] = useState(0);
  const PAGE = 36;
  const [loading, setLoading] = useState(false);

  const filteredFeats = useMemo(() => {
    return allFeats.filter((f) => {
      const p = f.properties;
      if (!selectedColors.has(p.color)) return false;
      if (p.type === "video" && !showVideo) return false;
      if (p.type === "live" && !showLive) return false;
      return true;
    });
  }, [allFeats, selectedColors, showVideo, showLive]);

  useEffect(() => {
    setAllFeats(generateFeatures(700, biasOn));
  }, [biasOn]);

  function loadMore() {
    if (loading) return;
    setLoading(true);
    setTimeout(() => {
      const start = feedPage * PAGE;
      const next = filteredFeats.slice(start, start + PAGE).map((f) => ({
        id: f.properties.id,
        title: f.properties.title,
        type: f.properties.type,
        color: f.properties.color,
        country: f.properties.country,
        city: f.properties.city,
        coordinates: f.geometry.coordinates,
      }));
      setFeed((prev) => [...prev, ...next]);
      setFeedPage((p) => p + 1);
      setLoading(false);
    }, 150);
  }

  useEffect(() => {
    setFeed([]);
    setFeedPage(0);
    loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredFeats]);

  useEffect(() => {
    if (mapRef.current) return;
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      projection: { name: "globe" },
      center: [0, 20],
      zoom: 1.8,
      bearing: 0,
      pitch: 0,
      antialias: true,
    });
    mapRef.current = map;

    map.on("style.load", () => {
      map.setFog({
        "horizon-blend": 0.4,
        range: [0.7, 8],
        color: "rgb(255, 245, 235)",
        "high-color": "rgb(255, 255, 255)",
        "space-color": "rgb(15, 25, 40)",
        "star-intensity": 0.6,
      });

      map.addSource("points", {
        type: "geojson",
        data: { type: "FeatureCollection", features: filteredFeats },
        cluster: true,
        clusterRadius: 50,
        clusterMaxZoom: 6,
      });

      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "points",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": "#9bd2ff",
          "circle-radius": [
            "step",
            ["get", "point_count"],
            12,
            50,
            18,
            200,
            26,
          ],
          "circle-opacity": 0.9,
        },
      });

      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "points",
        filter: ["has", "point_count"],
        layout: { "text-field": ["get", "point_count_abbreviated"], "text-size": 12 },
        paint: { "text-color": "#003355" },
      });

      map.addLayer({
        id: "unclustered",
        type: "circle",
        source: "points",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": ["get", "colorHex"],
          "circle-radius": 5,
          "circle-stroke-width": 1.6,
          "circle-stroke-color": "#ffffff",
        },
      });

      map.on("click", "unclustered", (e) => {
        const f = e.features[0];
        const [lng, lat] = f.geometry.coordinates;
        map.flyTo({ center: [lng, lat], zoom: 5, speed: 0.9, curve: 1.6 });
      });

      map.on("click", "clusters", (e) => {
        const features = map.queryRenderedFeatures(e.point, { layers: ["clusters"] });
        const clusterId = features[0].properties.cluster_id;
        map.getSource("points").getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err) return;
          map.easeTo({ center: features[0].geometry.coordinates, zoom });
        });
      });

      map.on("mouseenter", "unclustered", () => (map.getCanvas().style.cursor = "pointer"));
      map.on("mouseleave", "unclustered", () => (map.getCanvas().style.cursor = ""));

      let start = performance.now();
      const baseBearing =
        -(new Date().getUTCHours() * 15 + new Date().getUTCMinutes() * 0.25);
      let raf;
      function animate(t) {
        const elapsed = (t - start) / 1000;
        const omega = 360 / 86400;
        const bearing = baseBearing + omega * elapsed;
        if (!map.isMoving()) map.setBearing(bearing);

        const d = dayFactorLocal();
        const starIntensity = 0.2 + (1 - d) * 0.8;
        const sunIntensity = 10 + d * 25;
        map.setFog({
          "horizon-blend": 0.45 + d * 0.1,
          range: [0.7, 8],
          color: d > 0.5 ? "rgb(255, 245, 235)" : "rgb(220, 230, 255)",
          "high-color": "rgb(255, 255, 255)",
          "space-color": "rgb(15, 25, 40)",
          "star-intensity": starIntensity,
        });
        if (map.getLayer("sky")) {
          map.setPaintProperty("sky", "sky-atmosphere-sun-intensity", sunIntensity);
        }
        raf = requestAnimationFrame(animate);
      }
      raf = requestAnimationFrame(animate);
      map.once("remove", () => cancelAnimationFrame(raf));
    });

    return () => {
      if (map) map.remove();
    };
  }, [filteredFeats]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.getSource("points")) return;
    const feats = filteredFeats.map((f) => ({
      ...f,
      properties: { ...f.properties, colorHex: HU_COLORS[f.properties.color].hex },
    }));
    map.getSource("points").setData({ type: "FeatureCollection", features: feats });
  }, [filteredFeats]);

  function zoomToCountry(name) {
    const map = mapRef.current;
    if (!map || !name) return;
    const b = COUNTRY_BOUNDS[name];
    if (!b) return;
    map.fitBounds(b, { padding: 50, duration: 950 });
  }

  function onCountrySelect(e) {
    const name = e.target.value;
    if (name) zoomToCountry(name);
  }

  function toggleColor(id) {
    const s = new Set(selectedColors);
    if (s.has(id)) s.delete(id);
    else s.add(id);
    if (s.size === 0) return;
    setSelectedColors(s);
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 320px",
        height: "100vh",
        background: "#0b1220",
        color: "#fff",
        fontFamily: "sans-serif",
      }}
    >
      <div ref={mapContainer} />

      <div
        style={{
          padding: 12,
          display: "grid",
          gridTemplateRows: "auto auto 1fr",
          gap: 12,
          background: "rgba(10,14,22,0.75)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => setShowVideo((v) => !v)}
              style={{
                padding: "8px 14px",
                borderRadius: 8,
                border: "1px solid #3a89ff",
                background: showVideo ? "#2962ff" : "transparent",
                color: "#fff",
              }}
            >
              VIDÉO
            </button>
            <button
              onClick={() => setShowLive((v) => !v)}
              style={{
                padding: "8px 14px",
                borderRadius: 8,
                border: "1px solid #3a89ff",
                background: showLive ? "#2962ff" : "transparent",
                color: "#fff",
              }}
            >
              LIVE
            </button>
          </div>
          <div style={{ fontSize: 14, opacity: 0.8 }}>Visibles : {filteredFeats.length}</div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <label style={{ fontSize: 12, opacity: 0.8 }}>Pays</label>
            <select
              defaultValue=""
              onChange={onCountrySelect}
              style={{
                padding: "6px 10px",
                borderRadius: 8,
                background: "#0f172a",
                color: "#fff",
                border: "1px solid #334155",
              }}
            >
              <option value="">— choisir —</option>
              {Object.keys(COUNTRY_BOUNDS)
                .sort()
                .map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
            </select>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <label style={{ fontSize: 12, opacity: 0.8 }}>Actu</label>
            <div style={{ display: "flex", gap: 4 }}>
              <button
                onClick={() => setBiasOn(true)}
                style={{
                  padding: "6px 10px",
                  borderRadius: 8,
                  border: "1px solid #3a89ff",
                  background: biasOn ? "#2962ff" : "transparent",
                  color: "#fff",
                }}
              >
                Biais On
              </button>
              <button
                onClick={() => setBiasOn(false)}
                style={{
                  padding: "6px 10px",
                  borderRadius: 8,
                  border: "1px solid #3a89ff",
                  background: !biasOn ? "#2962ff" : "transparent",
                  color: "#fff",
                }}
              >
                Biais Off
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateRows: "auto 1fr", minHeight: 0 }}>
          <div style={{ marginBottom: 8 }}>
            <div style={{ marginBottom: 6, fontWeight: 700 }}>Humeurs</div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2,1fr)",
                gap: 6,
              }}
            >
              {Object.entries(HU_COLORS).map(([id, c]) => (
                <div
                  key={id}
                  onClick={() => toggleColor(id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px",
                    borderRadius: 8,
                    border: selectedColors.has(id)
                      ? `1px solid ${c.hex}`
                      : "1px solid transparent",
                    background: "rgba(255,255,255,0.08)",
                    cursor: "pointer",
                  }}
                >
                  <span style={{ fontSize: 18 }}>{c.emoji}</span>
                  <span
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      background: c.hex,
                    }}
                  />
                  <span style={{ fontSize: 12 }}>{c.emotion}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateRows: "auto 1fr", minHeight: 0 }}>
            <div style={{ marginBottom: 6, fontWeight: 700 }}>Contenus visibles</div>
            <div
              style={{ overflowY: "auto", paddingRight: 4 }}
              onScroll={(e) => {
                const el = e.currentTarget;
                if (el.scrollTop + el.clientHeight >= el.scrollHeight - 80)
                  loadMore();
              }}
            >
              {feed.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    const [lng, lat] = p.coordinates;
                    mapRef.current.flyTo({
                      center: [lng, lat],
                      zoom: 5,
                      speed: 0.9,
                    });
                  }}
                  style={{
                    marginBottom: 8,
                    padding: "6px 8px",
                    borderLeft: `4px solid ${HU_COLORS[p.color].hex}`,
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: 8,
                    cursor: "pointer",
                  }}
                >
                  <div style={{ fontWeight: 700 }}>{p.title}</div>
                  <div style={{ fontSize: 12, opacity: 0.8 }}>
                    {p.city}, {p.country} • {p.type}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ opacity: 0.7, padding: 8 }}>Chargement…</div>
              )}
              {feed.length === 0 && !loading && (
                <div style={{ opacity: 0.7, padding: 8 }}>Aucun contenu.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

