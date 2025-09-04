/* Quasar Labs - neon sci-fi theme (simple + resilient) */
:root{
  --bg1:#071022;
  --bg2:#0f2030;
  --neon-a:#00e6ff;
  --neon-b:#ff00ff;
  --panel: rgba(255,255,255,0.06);
}

*{box-sizing:border-box}
body{
  margin:0;
  min-height:100vh;
  font-family:Inter,Segoe UI,system-ui,Arial;
  background: radial-gradient(circle at 20% 10%, #07122b 0%, #071022 20%, #071022 100%), linear-gradient(180deg,var(--bg1),var(--bg2));
  color:#e6f7ff;
  -webkit-font-smoothing:antialiased;
  padding:18px;
}

/* header */
.header{ text-align:center; margin-bottom:14px }
.brand{ font-size:28px; color:var(--neon-a); text-shadow:0 0 12px rgba(0,230,255,0.25) }
.subtitle{ color:#bcd; margin-top:6px }

/* nav */
.nav{ display:flex; gap:8px; justify-content:center; margin-bottom:18px }
.tab-btn{
  background:linear-gradient(90deg,var(--neon-a),var(--neon-b));
  border:none; color:#041523; padding:8px 12px; border-radius:8px; cursor:pointer;
  font-weight:700; box-shadow:0 6px 20px rgba(0,0,0,0.4);
}
.tab-btn.active{ outline:3px solid rgba(255,255,255,0.06); transform:translateY(-2px) }

/* tabs */
.tab-content{ display:none; max-width:900px; margin:0 auto }
.tab-content.active{ display:block }

/* panels */
.panel{ background:var(--panel); border-radius:12px; padding:14px; margin-bottom:14px; box-shadow:0 6px 20px rgba(0,0,0,0.6); border:1px solid rgba(0,0,0,0.2)}
.panel h2{ color:var(--neon-b); margin:0 0 10px 0 }
label{ display:block; margin-bottom:8px; color:#cfeff7}
input[type="text"], textarea{ width:100%; padding:10px; border-radius:8px; border:none; background:rgba(255,255,255,0.03); color:inherit; margin-bottom:8px; font-size:14px}
.btn-row{display:flex; gap:8px; margin-bottom:8px}
button{ cursor:pointer; }

/* output boxes */
.output{ background:rgba(0,0,0,0.25); padding:10px; border-radius:8px; color:#dff; white-space:pre-wrap; font-size:13px }

/* analytics canvas */
canvas{ width:100%; max-width:100%; display:block; margin-top:10px; border-radius:6px; background:rgba(0,0,0,0.15); }

/* footer */
.footer{ text-align:center; margin-top:20px; color:#9fb; font-size:13px }

/* responsive */
@media (max-width:600px){
  .nav{ flex-wrap:wrap }
  .brand{ font-size:20px }
}
