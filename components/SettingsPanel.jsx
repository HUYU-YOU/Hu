import { useEffect, useRef } from "react";

export default function SettingsPanel({
  open, onClose,
  mapStyle, setMapStyle,      // "outdoors" | "satellite"
  theme, setTheme,            // "light" | "dark"
  onLogout
}) {
  const panelRef = useRef(null);

  // fermer au clic hors panneau
  useEffect(() => {
    function onDocClick(e){
      if (!open) return;
      if (panelRef.current && !panelRef.current.contains(e.target)) onClose?.();
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div style={styles.overlay}>
      <div ref={panelRef} style={styles.panel}>
        <div style={styles.header}>
          <div style={{fontWeight:900}}>Réglages</div>
          <button onClick={onClose} style={styles.xbtn}>✕</button>
        </div>

        <div style={styles.row}>
          <div style={styles.label}>Style de carte</div>
          <div style={styles.group}>
            <button
              onClick={()=>setMapStyle("outdoors")}
              style={{...styles.toggle, ...(mapStyle==="outdoors"?styles.active:{})}}
            >Carte</button>
            <button
              onClick={()=>setMapStyle("satellite")}
              style={{...styles.toggle, ...(mapStyle==="satellite"?styles.active:{})}}
            >Satellite</button>
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.label}>Thème interface</div>
          <div style={styles.group}>
            <button
              onClick={()=>setTheme("light")}
              style={{...styles.toggle, ...(theme==="light"?styles.active:{})}}
            >Clair</button>
            <button
              onClick={()=>setTheme("dark")}
              style={{...styles.toggle, ...(theme==="dark"?styles.active:{})}}
            >Sombre</button>
          </div>
        </div>

        <div style={{height:8}} />

        <button onClick={onLogout} style={styles.logout}>Se déconnecter</button>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position:"fixed", inset:0, zIndex:100, background:"rgba(0,0,0,.15)", display:"flex", justifyContent:"flex-end" },
  panel: { width:320, background:"#fff", border:"1px solid #e5e7eb", borderRadius:16, margin:12, padding:12, boxShadow:"0 20px 40px rgba(0,0,0,.15)" },
  header: { display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 },
  xbtn: { border:"1px solid #e5e7eb", background:"#fff", borderRadius:8, padding:"6px 10px", cursor:"pointer" },
  row: { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 0", borderTop:"1px solid #f1f5f9" },
  label: { fontWeight:700 },
  group: { display:"flex", gap:8 },
  toggle: { border:"1px solid #e5e7eb", background:"#f8fafc", borderRadius:10, padding:"8px 12px", cursor:"pointer", fontWeight:800 },
  active: { background:"#111", color:"#fff", borderColor:"#111" },
  logout: { width:"100%", border:"1px solid #ef4444", color:"#ef4444", background:"#fff", borderRadius:10, padding:"10px 12px", fontWeight:800, cursor:"pointer" }
};
