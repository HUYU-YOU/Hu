// components/HuMap.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import SettingsPanel from "./SettingsPanel";

// ------------- CONFIG -------------
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

// Couleurs / émotions
const HU_COLORS = {
  yellow: { hex: "#FFD400", label: "joie", emoji: "😊" },
  blue:   { hex: "#2F80ED", label: "curiosité", emoji: "🧠" },
  red:    { hex: "#EB5757", label: "colère", emoji: "🔥" },
  green:  { hex: "#27AE60", label: "apaisement", emoji: "🌿" },
  orange: { hex: "#F2994A", label: "énergie", emoji: "⚡" },
  black:  { hex: "#111111", label: "aide urgente", emoji: "🆘" }
};

// Bounds pour zoom pays
const COUNTRY_BOUNDS = {
  France: [-5.5,41.0, 9.9,51.5],
  Ukraine: [22.0,44.0, 40.5,52.5],
  Gaza: [34.2,31.2, 34.6,31.7],
  Chine: [73.0,18.0, 135.1,53.6],
  "États-Unis": [-125.0,24.5, -66.5,49.5],
  Canada: [-141.0,41.7, -52.6,83.1],
  Brésil: [-74.0,-34.0, -34.7,5.4],
  Espagne: [-9.5,36.0, 3.3,43.9],
  Italie: [6.6,36.0, 18.8,47.1],
  Allemagne: [5.9,47.2, 15.1,55.1],
  "Royaume-Uni": [-8.7,49.8, 1.8,60.9],
  Pologne: [14.1,49.0, 24.2,55.2],
  Turquie: [25.7,35.8, 44.8,42.1],
  Maroc: [-13.2,27.6, -1.0,35.9],
  Nigéria: [2.7,4.0, 14.7,13.9],
  "Afrique du Sud":[16.0,-35.0, 33.0,-22.1],
  Inde:[68.0,6.5, 97.5,35.6],
  Pakistan:[60.9,23.5, 77.8,37.1],
  Bangladesh:[88.0,20.6, 92.7,26.6],
  Japon:[123.0,24.0, 146.2,45.6],
  "Corée du Sud":[124.5,33.0, 131.0,38.9],
  Indonésie:[95.0,-11.0, 141.0,6.0],
  Philippines:[116.0,4.0, 127.0,21.0],
  Australie:[112.0,-44.0, 154.0,-10.0],
  Mexique:[-118.5,14.4, -86.5,32.8],
  Argentine:[-73.6,-55.1, -53.6,-21.8],
  Colombie:[-79.1,-4.2, -66.8,13.4],
  Égypte:[24.7,22.0, 36.9,31.7],
  "Arabie saoudite":[34.5,16.4, 55.7,32.2],
  "Émirats arabes unis":[51.5,22.6, 56.6,26.4],
};

// Données synthétiques (capitals + génération de points)
const CAPITALS = [
  { country:"France", city:"Paris", lat:48.8566, lng:2.3522, pop:11.0 },
  { country:"Ukraine", city:"Kyiv", lat:50.4501, lng:30.5234, pop:3.0 },
  { country:"Gaza", city:"Gaza City", lat:31.522, lng:34.451, pop:0.7 },
  { country:"Chine", city:"Beijing", lat:39.9042, lng:116.4074, pop:21.0 },
  { country:"Chine", city:"Shanghai", lat:31.2304, lng:121.4737, pop:25.0 },
  { country:"États-Unis", city:"New York", lat:40.7128, lng:-74.0060, pop:20.0 },
  { country:"États-Unis", city:"Los Angeles", lat:34.0522, lng:-118.2437, pop:13.0 },
  { country:"Brésil", city:"São Paulo", lat:-23.5558, lng:-46.6396, pop:22.0 },
  { country:"Brésil", city:"Rio", lat:-22.9068, lng:-43.1729, pop:13.0 },
  { country:"Italie", city:"Rome", lat:41.9028, lng:12.4964, pop:4.2 },
  { country:"Allemagne", city:"Berlin", lat:52.52, lng:13.405, pop:6.2 },
  { country:"Espagne", city:"Madrid", lat:40.4168, lng:-3.7038, pop:6.7 },
  { country:"Royaume-Uni", city:"Londres", lat:51.5074, lng:-0.1278, pop:9.5 },
  { country:"Pologne", city:"Varsovie", lat:52.2297, lng:21.0122, pop:3.1 },
  { country:"Turquie", city:"Istanbul", lat:41.0082, lng:28.9784, pop:15.5 },
  { country:"Maroc", city:"Casablanca", lat:33.5731, lng:-7.5898, pop:3.7 },
  { country:"Nigéria", city:"Lagos", lat:6.5244, lng:3.3792, pop:21.0 },
  { country:"Afrique du Sud", city:"Johannesburg", lat:-26.2041, lng:28.0473, pop:6.1 },
  { country:"Inde", city:"Delhi", lat:28.6139, lng:77.2090, pop:32.0 },
  { country:"Pakistan", city:"Karachi", lat:24.8607, lng:67.0011, pop:16.0 },
  { country:"Bangladesh", city:"Dhaka", lat:23.8103, lng:90.4125, pop:22.0 },
  { country:"Japon", city:"Tokyo", lat:35.6762, lng:139.6503, pop:37.0 },
  { country:"Corée du Sud", city:"Seoul", lat:37.5665, lng:126.9780, pop:25.0 },
  { country:"Indonésie", city:"Jakarta", lat:-6.2088, lng:106.8456, pop:34.0 },
  { country:"Philippines", city:"Manille", lat:14.5995, lng:120.9842, pop:13.0 },
  { country:"Australie", city:"Sydney", lat:-33.8688, lng:151.2093, pop:5.3 },
  { country:"Canada", city:"Toronto", lat:43.6532, lng:-79.3832, pop:6.5 },
  { country:"Mexique", city:"Mexico", lat:19.4326, lng:-99.1332, pop:21.0 },
  { country:"Argentine", city:"Buenos Aires", lat:-34.6037, lng:-58.3816, pop:15.0 },
  { country:"Colombie", city:"Bogotá", lat:4.7110, lng:-74.0721, pop:10.7 },
  { country:"Égypte", city:"Le Caire", lat:30.0444, lng:31.2357, pop:20.0 },
  { country:"Arabie saoudite", city:"Riyad", lat:24.7136, lng:46.6753, pop:7.7 },
  { country:"Émirats arabes unis", city:"Dubaï", lat:25.2048, lng:55.2708, pop:3.5 },
];

const TITLES_BY_COLOR = {
  yellow: ["Sketch","Impro","Danse","Beatmaking","Peinture"],
  blue:   ["Cours","Tuto","Histoire","Vulgarisation","Explication"],
  red:    ["Coup de gueule","Appel","Débat","Manif","Tribune"],
  green:  ["Animaux","Jardin","Nature","Forêt","Océan"],
  orange: ["Entraînement","Sport","Projet","Bricolage","Travail"],
  black:  ["Aide urgente","SOS","Danger","Soutien","Signalement"],
};

// Helpers
const choice = (xs) => xs[Math.floor(Math.random() * xs.length)];
const jitter = (lat,lng) => {
  const deg = Math.random()*1.2 + 0.1;
  return { lat: lat + (Math.random()-0.5)*deg, lng: lng + (Math.random()-0.5)*deg };
};
function generateFeatures(n=700) {
  const total = CAPITALS.reduce((s,c)=>s+c.pop,0);
  const feats = [];
  let id=1;
  for (const c of CAPITALS) {
    const share = Math.max(1, Math.round((c.pop/total)*n));
    for (let i=0;i<share;i++){
      const {lat,lng} = jitter(c.lat,c.lng);
      const ids = Object.keys(HU_COLORS);
      const color = choice(ids);
      const type = Math.random()<0.75 ? "video" : "live";
      const title = `${choice(TITLES_BY_COLOR[color])} ${id+1}`;
      feats.push({
        type: "Feature",
        geometry: { type:"Point", coordinates:[lng,lat] },
        properties: {
          id: "p"+(id++),
          title, color, type, country: c.country, city: c.city
        }
      });
    }
  }
  return feats;
}

// Jour/nuit (0..1)
function dayFactor() {
  const d = new Date();
  const t = d.getHours() + d.getMinutes()/60;
  const k = Math.cos((t-12)*Math.PI/12);
  return Math.max(0, 1 - (k+1)/2);
}
// ------------- /CONFIG -------------

export default function HuMap() {
  const mapRef = useRef(null);
  const mapEl = useRef(null);
  const rafRef = useRef(null);
  const rotationEnabledRef = useRef(true);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mapStyle, setMapStyle] = useState("outdoors"); // "outdoors" | "satellite"
  const [theme, setTheme] = useState("light"); // "light" | "dark"

  // UI
  const [showVideo, setShowVideo] = useState(true);
  const [showLive, setShowLive] = useState(true);
  const [selectedColors, setSelectedColors] = useState(new Set(Object.keys(HU_COLORS)));
  const [biasOn] = useState(true); // placeholder (pour ton switch Actu)
  const [countrySelect, setCountrySelect] = useState("");

  // Data
  const [allFeats] = useState(()=> generateFeatures(700));

  const filteredFeats = useMemo(() => {
    return allFeats.filter(f=>{
      const p=f.properties;
      if (!selectedColors.has(p.color)) return false;
      if (p.type==="video" && !showVideo) return false;
      if (p.type==="live" && !showLive) return false;
      return true;
    });
  }, [allFeats, selectedColors, showVideo, showLive]);

  const liveCount = useMemo(
    ()=> filteredFeats.filter(f=>f.properties.type==="live").length,
    [filteredFeats]
  );

  // Feed (grand, façon V13)
  const [feed, setFeed] = useState([]);
  const [page, setPage] = useState(0);
  const PAGE = 36;
  const [loading, setLoading] = useState(false);

  const loadMore = () => {
    if (loading) return;
    setLoading(true);
    setTimeout(()=>{
      const start = page*PAGE;
      const next = filteredFeats.slice(start, start+PAGE).map(f=>({
        id:f.properties.id,
        title:f.properties.title,
        type:f.properties.type,
        color:f.properties.color,
        country:f.properties.country,
        city:f.properties.city,
        coordinates:f.geometry.coordinates,
      }));
      setFeed(prev=>[...prev, ...next]);
      setPage(p=>p+1);
      setLoading(false);
    },120);
  };
  useEffect(()=>{
    setFeed([]); setPage(0); loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[filteredFeats]);

  // Init Mapbox
  useEffect(()=>{
    if (mapRef.current) return;
    const map = new mapboxgl.Map({
      container: mapEl.current,
      style: mapStyle === "outdoors"
        ? "mapbox://styles/mapbox/outdoors-v12"
        : "mapbox://styles/mapbox/satellite-streets-v12",
      projection: { name:"globe" },
      center: [0,20],
      zoom: 1.8,
      bearing: 0,
      pitch: 0,
      antialias: true
    });
    mapRef.current = map;

    map.on("style.load", ()=>{
      // Eau bleue claire
      const w = map.getStyle().layers.find(l=>l.type==="fill" && l.id==="water");
      if (w) map.setPaintProperty("water","fill-color","#78c9ff");
      // Fond vert pâle
      const bg = map.getStyle().layers.find(l=>l.type==="background");
      if (bg) map.setPaintProperty(bg.id,"background-color","#e6f5d0");

      // Atmosphère + jour/nuit progressif
      map.setFog({ "horizon-blend":0.5, range:[0.7,8], color:"rgb(255,246,236)", "high-color":"rgb(255,255,255)", "space-color":"rgb(16,22,38)", "star-intensity":0.5 });

      // Relief léger
      map.addSource("terrain-dem", { type:"raster-dem", url:"mapbox://mapbox.mapbox-terrain-dem-v1", tileSize:512, maxzoom:14 });
      const before = map.getStyle().layers.find(l=>/label/i.test(l.id))?.id;
      map.addLayer({ id:"hillshade", type:"hillshade", source:"terrain-dem", paint:{ "hillshade-exaggeration":0.5 } }, before);

      // Points + clusters
      const seed = filteredFeats.map(f=>({
        ...f,
        properties: { ...f.properties, colorHex: HU_COLORS[f.properties.color].hex }
      }));
      map.addSource("points", {
        type:"geojson",
        data:{ type:"FeatureCollection", features: seed },
        cluster:true, clusterRadius:50, clusterMaxZoom:6
      });
      map.addLayer({
        id:"clusters", type:"circle", source:"points", filter:["has","point_count"],
        paint:{
          "circle-color":"#9bd2ff",
          "circle-radius":["step",["get","point_count"],12,50,18,200,26],
          "circle-opacity":0.9
        }
      });
      map.addLayer({
        id:"cluster-count", type:"symbol", source:"points", filter:["has","point_count"],
        layout:{ "text-field":["get","point_count_abbreviated"], "text-size":12 },
        paint:{ "text-color":"#003355" }
      });
      map.addLayer({
        id:"unclustered", type:"circle", source:"points", filter:["!",["has","point_count"]],
        paint:{
          "circle-color":["get","colorHex"],
          "circle-radius":5,
          "circle-stroke-width":1.6,
          "circle-stroke-color":"#ffffff"
        }
      });

      // Click -> fly
      map.on("click","unclustered",(e)=>{
        const [lng,lat] = e.features[0].geometry.coordinates;
        map.flyTo({ center:[lng,lat], zoom:5, speed:0.9, curve:1.6 });
      });
      map.on("click","clusters",(e)=>{
        const f = map.queryRenderedFeatures(e.point,{ layers:["clusters"] })[0];
        const cid = f.properties.cluster_id;
        map.getSource("points").getClusterExpansionZoom(cid,(err,zoom)=>{
          if (err) return;
          map.easeTo({ center:f.geometry.coordinates, zoom });
        });
      });

      // Rotation douce (24h) + MAJ jour/nuit
      let start = performance.now();
      const baseBearing = -(new Date().getUTCHours()*15 + new Date().getUTCMinutes()*0.25);
      const animate = (t)=>{
        const elapsed = (t-start)/1000;
        const bearing = baseBearing + (360/86400)*elapsed;
        const d = dayFactor();
        const starIntensity = 0.2 + (1-d)*0.8;
        const sunIntensity = 10 + d*25;

        map.setFog({
          "horizon-blend":0.45 + d*0.1,
          range:[0.7,8],
          color: d>0.5 ? "rgb(255,246,236)" : "rgb(220,230,255)",
          "high-color":"rgb(255,255,255)",
          "space-color":"rgb(16,22,38)",
          "star-intensity":starIntensity
        });
        if (rotationEnabledRef.current && !map.isMoving()) map.setBearing(bearing);
        rafRef.current = requestAnimationFrame(animate);
      };
      rafRef.current = requestAnimationFrame(animate);

      // Stop rotation à la 1ère interaction
      const stop = ()=>{ rotationEnabledRef.current=false; };
      ["dragstart","rotatestart","zoomstart","pitchstart","mousedown","touchstart","wheel"].forEach(ev=> map.on(ev, stop));
    });

    return ()=> {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      map.remove();
    };
  }, [filteredFeats]);

  useEffect(()=>{
    const map = mapRef.current;
    if (!map) return;
    const center = map.getCenter();
    const zoom = map.getZoom();
    const bearing = map.getBearing();
    const pitch = map.getPitch();

    const styleUrl = mapStyle === "outdoors"
      ? "mapbox://styles/mapbox/outdoors-v12"
      : "mapbox://styles/mapbox/satellite-streets-v12";

    map.setStyle(styleUrl);
    map.once("styledata", ()=>{
      map.jumpTo({ center, zoom, bearing, pitch });
      // re-crée la source + calques points
      const feats = filteredFeats.map(f=>({
        ...f,
        properties:{ ...f.properties, colorHex: HU_COLORS[f.properties.color].hex }
      }));
      if (!map.getSource("points")){
        map.addSource("points", { type:"geojson", data:{ type:"FeatureCollection", features:feats }, cluster:true, clusterRadius:50, clusterMaxZoom:6 });
      } else {
        map.getSource("points").setData({ type:"FeatureCollection", features:feats });
      }
      if (!map.getLayer("clusters")) {
        map.addLayer({ id:"clusters", type:"circle", source:"points", filter:["has","point_count"],
          paint:{ "circle-color":"#9bd2ff","circle-radius":["step",["get","point_count"],12,50,18,200,26],"circle-opacity":0.9 }});
      }
      if (!map.getLayer("cluster-count")) {
        map.addLayer({ id:"cluster-count", type:"symbol", source:"points", filter:["has","point_count"],
          layout:{ "text-field":["get","point_count_abbreviated"], "text-size":12 }, paint:{ "text-color":"#003355" }});
      }
      if (!map.getLayer("unclustered")) {
        map.addLayer({ id:"unclustered", type:"circle", source:"points", filter:["!",["has","point_count"]],
          paint:{ "circle-color":["get","colorHex"], "circle-radius":5,"circle-stroke-width":1.6,"circle-stroke-color":"#ffffff" }});
      }
    });
  }, [mapStyle, filteredFeats]);

  // MAJ source quand filtres changent (sans recréer la map)
  useEffect(()=>{
    const map = mapRef.current;
    if (!map) return;
    const src = map.getSource("points");
    if (!src) return;
    const feats = filteredFeats.map(f=>({
      ...f,
      properties: { ...f.properties, colorHex: HU_COLORS[f.properties.color].hex }
    }));
    src.setData({ type:"FeatureCollection", features:feats });
  }, [filteredFeats]);

  // UI helpers
  const toggleColor = (id)=>{
    const s = new Set(selectedColors);
    s.has(id) ? s.delete(id) : s.add(id);
    if (s.size===0) return;
    setSelectedColors(s);
  };
  const zoomToCountry = (name)=>{
    const map = mapRef.current;
    if (!map || !name) return;
    const b = COUNTRY_BOUNDS[name];
    if (!b) return;
    map.fitBounds(b, { padding: 50, duration: 950 });
  };

  // Ma position (bottom-right)
  const locateMe = ()=>{
    const map = mapRef.current;
    if (!map || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos)=>{
      const { latitude, longitude } = pos.coords;
      map.flyTo({ center:[longitude, latitude], zoom: 8, speed: 1 });
    });
  };

  return (
    <div className={`app ${theme === "dark" ? "theme-dark" : "theme-light"}`}>
      <div className="mapWrap"><div id="map" ref={mapEl} /></div>

      {/* Top center: VIDEO / LIVE + compteur */}
      <div className="overlayTop">
        <div className="bigSwitch">
          <button className={showVideo ? "active":""} onClick={()=>setShowVideo(v=>!v)}>VIDÉO</button>
          <button className={showLive ? "active":""} onClick={()=>setShowLive(v=>!v)}>LIVE {showLive ? `(${liveCount})`:""}</button>
        </div>
        <div className="kpi">Visibles : {filteredFeats.length}</div>
      </div>

      {/* Top left: logo hu. (menu principal) */}
      <div className="overlayTopLeft">
        <a href="#" className="logoLink">hu.</a>
      </div>

      {/* Top right: réglages (placeholder) */}
      <div className="overlayTopRight">
        <button className="btn" onClick={()=>setSettingsOpen(true)}>⚙️</button>
      </div>

      {/* Left panel: pays + biais */}
      <div className="overlayLeft panel">
        <label>Pays</label>
        <select className="select" value={countrySelect} onChange={e=>{ setCountrySelect(e.target.value); zoomToCountry(e.target.value); }}>
          <option value="">— choisir —</option>
          {Object.keys(COUNTRY_BOUNDS).sort().map(n=> <option key={n} value={n}>{n}</option>)}
        </select>

        <label style={{marginTop:8}}>Actu</label>
        <div className="bigSwitch">
          <button className={biasOn ? "active":""}>Biais on</button>
          <button className={!biasOn ? "active":""} disabled>Biais off</button>
        </div>
      </div>

      {/* Right panel: Humeurs (petit) + Feed (grand, façon V13) */}
      <div className="overlayRight">
        <div className="panel small">
          <div className="header"><div className="title">Humeurs</div></div>
          {Object.entries(HU_COLORS).map(([id,c])=>{
            const count = filteredFeats.filter(f=>f.properties.color===id).length;
            return (
              <div key={id} className="colorRow" onClick={()=>toggleColor(id)}>
                <span className="swatch" style={{background:c.hex}}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:20, marginBottom:2}}>{c.emoji}</div>
                  <div style={{fontSize:12, opacity:0.8}}>{c.label}</div>
                </div>
                <span className="badge">{count}</span>
                <input type="checkbox" readOnly checked={selectedColors.has(id)} />
              </div>
            );
          })}
        </div>

        <div className="panel large">
          <div className="header">
            <div className="title">Contenu visible</div>
            <span className="hint">filtré par tes choix</span>
          </div>
          <div className="scroller" onScroll={e=>{
            const el = e.currentTarget;
            if (el.scrollTop + el.clientHeight >= el.scrollHeight - 80) loadMore();
          }}>
            {feed.map(p=>(
              <div key={p.id} className="card" style={{ borderLeft:`4px solid ${HU_COLORS[p.color].hex}` }}
                   onClick={()=>{
                     const [lng,lat] = p.coordinates;
                     mapRef.current?.flyTo({ center:[lng,lat], zoom:5, speed:0.9 });
                   }}>
                <div style={{fontWeight:800}}>{HU_COLORS[p.color].emoji} {p.title}</div>
                <div className="badge">{p.city}, {p.country} • {p.type}</div>
              </div>
            ))}
            {loading && <div className="card" style={{height:60, opacity:0.4}}>Chargement…</div>}
            {feed.length===0 && !loading && <div className="hint">Aucun contenu.</div>}
          </div>
        </div>
      </div>

      {/* Bottom-right: Ma position */}
      <button className="locateBtn" onClick={locateMe}>📍 Ma position</button>
      <SettingsPanel
        open={settingsOpen}
        onClose={()=>setSettingsOpen(false)}
        mapStyle={mapStyle}
        setMapStyle={setMapStyle}
        theme={theme}
        setTheme={setTheme}
        onLogout={()=>alert("Déconnexion (à brancher)")}
      />
    </div>
  );
}
