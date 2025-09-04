/* Quasar Labs - Neon sci-fi interior */
:root{
  --bg1:#020217;
  --bg2:#071028;
  --neon-c:#00e6ff;
  --neon-p:#ff00ff;
  --panel: rgba(255,255,255,0.04);
}

*{box-sizing:border-box}
body{ margin:0; font-family:Inter, 'Segoe UI', system-ui, Arial; color:#dff; background: radial-gradient( circle at 10% 10%, #0a1530 0%, #041026 30%, #020217 100%); -webkit-font-smoothing:antialiased; overflow-x:hidden; }
.wrap{ max-width:1100px; margin:0 auto; padding:18px; position:relative; }

/* header */
.header{ text-align:center; margin-bottom:12px }
.brand{ font-size:28px; color:var(--neon-c); text-shadow:0 0 16px rgba(0,230,255,0.15); font-weight:800 }
.subtitle{ color:#9fc; margin-top:4px; font-size:13px }

/* nav */
.nav{ display:flex; gap:8px; justify-content:center; margin:20px 0 }
.tab-btn{ background:linear-gradient(90deg,var(--neon-c),var(--neon-p)); border:none; color:#021523; padding:10px 14px; border-radius:10px; cursor:pointer; font-weight:700; box-shadow:0 8px 30px rgba(0,0,0,0.6) }
.tab-btn.active{ transform:translateY(-3px); box-shadow:0 16px 40px rgba(0,0,0,0.5); outline:2px solid rgba(255,255,255,0.03) }

/* background holo */
#sci-bg{ position:fixed; inset:0; z-index:-2; pointer-events:none; }
.holo-grid{ position:absolute; inset:0; background:
  radial-gradient(ellipse at center, rgba(0,230,255,0.02) 0%, transparent 40%),
  linear-gradient(180deg, rgba(255,0,255,0.02), rgba(0,230,255,0.02));
  mix-blend-mode:screen;
  animation: slowShift 12s linear infinite;
}
@keyframes slowShift{ 0%{transform:translateY(0)}50%{transform:translateY(-20px)}100%{transform:translateY(0)} }

/* floating small icons */
.floating-icons{ position:fixed; right:12px; top:90px; display:flex; flex-direction:column; gap:18px; transform:rotate(10deg); opacity:0.9 }
.floating-icons .icon{ font-size:26px; filter:drop-shadow(0 6px 18px rgba(0,0,0,0.6)); animation: float 6s infinite ease-in-out }
@keyframes float{ 0%{transform:translateY(0)}50%{transform:translateY(-18px)}100%{transform:translateY(0)} }

/* test tube */
.test-tube{ position:fixed; left:24px; bottom:30px; width:72px; height:220px; border:4px solid rgba(0,230,255,0.25); border-radius:40px; overflow:hidden; box-shadow:0 12px 40px rgba(0,230,255,0.08), inset 0 0 30px rgba(255,0,255,0.03) }
.liquid{ position:absolute; bottom:0; left:0; right:0; height:0%; background:linear-gradient(180deg,#ff5ad7,#00e6ff); transition:height 1.6s cubic-bezier(.2,.9,.3,1); mix-blend-mode:screen }
.tube-glow{ position:absolute; inset:-6px; box-shadow:0 0 40px rgba(0,230,255,0.06); pointer-events:none }

/* content panels */
.tab-content{ display:none; max-width:980px; margin:0 auto; z-index:2 }
.tab-content.active{ display:block }
.panel{ background:var(--panel); border-radius:12px; padding:14px; margin-bottom:14px; border:1px solid rgba(255,255,255,0.03); box-shadow:0 8px 30px rgba(0,0,0,0.6) }
.panel h2{ color:var(--neon-p); margin:0 0 8px 0 }
label{ color:#cfeff7; display:block; margin-bottom:8px }
input[type="text"], textarea{ width:100%; padding:12px; border-radius:8px; border:none; background:rgba(255,255,255,0.02); color:inherit; margin-bottom:10px; font-size:14px }
.btn-row{ display:flex; gap:10px; margin-bottom:8px; flex-wrap:wrap }
button{ padding:10px 14px; border-radius:10px; border:none; cursor:pointer; background:linear-gradient(90deg,var(--neon-c),var(--neon-p)); color:#021523; font-weight:700; box-shadow:0 8px 20px rgba(0,0,0,0.5) }

/* outputs */
.output{ background:rgba(1,1,1,0.2); padding:10px; border-radius:8px; color:#dff; white-space:pre-wrap; font-size:14px; min-height:40px; }

/* analytics chart */
canvas{ width:100%; margin-top:10px; border-radius:8px; background:rgba(0,0,0,0.12) }

/* footer */
.footer{ text-align:center; margin-top:20px; color:#9fb; font-size:13px }

/* responsive */
@media (max-width:700px){
  .wrap{ padding:12px }
  .test-tube{ left:8px; bottom:10px; transform:scale(0.8) }
}
