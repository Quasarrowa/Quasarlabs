// Quasar Labs - all-in-one script (diagnostics + UI + visuals)
// IMPORTANT: uses your Lava NEAR RPC endpoint (already configured here)
const LAVA_RPC = "https://g.w.lavanet.xyz:443/gateway/near/rpc-http/a6e5f4c9ab534914cbf08b66860da55d";

// ------------------ UI helpers ------------------
function openTab(evt, tabId) {
  document.querySelectorAll(".tab-content").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
  document.getElementById(tabId).classList.add("active");
  if (evt && evt.currentTarget) evt.currentTarget.classList.add("active");
}

// small append helper
function safeAppendEl(containerId, html, ok = null) {
  const container = document.getElementById(containerId);
  const el = document.createElement("div");
  if (ok === true) el.innerHTML = `✅ ${html}`;
  else if (ok === false) el.innerHTML = `❌ ${html}`;
  else el.innerHTML = html;
  container.appendChild(el);
  // store last report
  localStorage.setItem('quasar:lastReport', container.innerText);
}

// ------------------ Sound & Visual controls ------------------
let SOUND = true;
function playSound(name){
  if (!SOUND) return;
  try { if (sounds && sounds[name]) sounds[name].play(); } catch(e){}
}

// animate test tube fill (0..1)
function setTubeLevel(fraction){
  const liquid = document.getElementById('liquid');
  if (!liquid) return;
  const pct = Math.max(0, Math.min(1, fraction)) * 100;
  liquid.style.height = pct + '%';
  // small bubble sound if fill > 0
  if (fraction > 0) playSound('bubble');
}

// ------------------ Sound setup (Howler created in index.html) ------------------
// sounds global created in HTML snippet; if not present fallback to no sound.
if (!window.sounds) window.sounds = { scan:{play:()=>{}}, bubble:{play:()=>{}}, click:{play:()=>{}} };

// ------------------ Chart (analytics) ------------------
let balanceChart = null;
function pushBalanceToChart(label, value){
  try {
    if (!balanceChart) {
      const ctx = document.getElementById('balanceChart').getContext('2d');
      balanceChart = new Chart(ctx, {
        type: 'line',
        data: { labels:[label], datasets:[{ label:'Balance (NEAR)', data:[value], borderColor:'#00e6ff', backgroundColor:'rgba(0,230,255,0.12)', tension:0.2 }]},
        options:{responsive:true, scales:{y:{beginAtZero:true}}}
      });
    } else {
      balanceChart.data.labels.push(label);
      balanceChart.data.datasets[0].data.push(value);
      balanceChart.update();
    }
  } catch(e){}
}

// ------------------ RPC helper ------------------
async function rpcPost(body){
  const res = await fetch(LAVA_RPC, {
    method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(body)
  });
  return await res.json();
}

// ------------------ Small tests used in the diagnostic ------------------
async function testRPCReachable(){
  try {
    const d = await rpcPost({ jsonrpc:"2.0", id:"status", method:"status", params:[] });
    if (d && (d.version || d.chain_id || d.sync_info)) return { ok:true, info: d.version || d.chain_id || 'ok' };
    return { ok:false, error:"no status" };
  } catch(e){ return { ok:false, error: e.message || e }; }
}

async function testViewAccount(accountId){
  try {
    const d = await rpcPost({ jsonrpc:"2.0", id:"v1", method:"query", params:{ request_type:"view_account", finality:"final", account_id: accountId }});
    if (d && d.result) return { ok:true, result: d.result };
    return { ok:false, error: d.error || 'no result' };
  } catch(e){ return { ok:false, error: e.message || e }; }
}

async function testViewCode(accountId){
  try {
    const d = await rpcPost({ jsonrpc:"2.0", id:"v2", method:"query", params:{ request_type:"view_code", finality:"final", account_id: accountId }});
    if (d && d.result && d.result.code_base64) return { ok:true, size: d.result.code_base64.length };
    return { ok:false, error: 'no code' };
  } catch(e){ return { ok:false, error: e.message || e }; }
}

async function testViewState(accountId){
  try {
    const d = await rpcPost({ jsonrpc:"2.0", id:"v3", method:"query", params:{ request_type:"view_state", finality:"final", account_id: accountId, prefix_base64: "" }});
    if (d && d.result && Array.isArray(d.result.values)) return { ok:true, keys: d.result.values.length };
    return { ok:false, error: 'no state or blocked' };
  } catch(e){ return { ok:false, error: e.message || e }; }
}

// call a view function
async function testCallFunction(accountId, methodName, args = {}){
  try {
    const d = await rpcPost({ jsonrpc:"2.0", id:"v4", method:"query", params:{ request_type:"call_function", finality:"final", account_id: accountId, method_name: methodName, args_base64: btoa(JSON.stringify(args)) }});
    if (d && d.result && Array.isArray(d.result.result)) {
      const bytes = new Uint8Array(d.result.result);
      const text = new TextDecoder().decode(bytes);
      try { return { ok:true, parsed: JSON.parse(text) }; } catch { return { ok:true, text: text }; }
    }
    return { ok:false, error: d.error || 'empty' };
  } catch(e){ return { ok:false, error: e.message || e }; }
}

// ------------------ UI actions ------------------
async function checkBalance(){
  const acct = (document.getElementById('accountId')||{}).value.trim();
  const out = document.getElementById('balance-result');
  if (!acct){ out.textContent = '⚠️ Enter account id'; return; }
  out.textContent = '⏳ Checking...';
  try {
    const res = await testViewAccount(acct);
    if (res.ok){
      const near = parseFloat(res.result.amount)/1e24;
      out.textContent = `✅ ${acct} balance: ${near.toFixed(5)} NEAR (storage: ${res.result.storage_usage})`;
    } else out.textContent = `❌ ${res.error}`;
  } catch(e){ out.textContent = `❌ ${e.message||e}`; }
}

async function fetchContractFromUI(){
  const contract = (document.getElementById('contract')||{}).value.trim();
  const target = document.getElementById('result');
  const analytics = document.getElementById('analytics');
  if (!contract){ target.textContent='⚠️ Enter contract id'; return; }
  target.textContent = '⏳ Running quick scan...';
  playSound('scan');

  try {
    const res = await rpcPost({ jsonrpc:"2.0", id:"q", method:"query", params:{ request_type:"view_account", finality:"final", account_id: contract }});
    if (res && res.result){
      const bal = (parseFloat(res.result.amount)/1e24).toFixed(4);
      target.textContent = `✅ ${contract} scanned!\nBalance: ${bal} NEAR\nStorage: ${res.result.storage_usage} bytes\n🔬 Via Lava RPC`;
      analytics.textContent = `Last test: ${new Date().toLocaleString()}\nContract: ${contract}\nBalance: ${bal} NEAR`;
      pushBalanceToChart(contract, parseFloat(bal));
      setTubeLevel(Math.min(1, parseFloat(bal)/100)); // visual: scale fill by balance (simple)
      playSound('bubble');
      // save to history
      saveHistory({ time: Date.now(), contract, balance: bal });
    } else target.textContent = '⚠️ Could not fetch contract info.';
  } catch(e){ target.textContent = '❌ RPC error'; }
}

async function callMethod(){
  const contract = (document.getElementById('contract')||{}).value.trim();
  const method = (document.getElementById('method')||{}).value.trim();
  const argsText = (document.getElementById('args')||{}).value.trim();
  const out = document.getElementById('methodResult');
  if (!contract || !method){ out.textContent='⚠️ Enter contract + method'; return; }
  out.textContent = '⏳ Running method...';
  let args={};
  try { args = argsText ? JSON.parse(argsText) : {}; } catch(e){ out.textContent='❌ Invalid JSON args'; return; }

  const r = await testCallFunction(contract, method, args);
  if (r.ok){
    if (r.parsed !== undefined) out.textContent = `✅ Result:\n${JSON.stringify(r.parsed,null,2)}`;
    else out.textContent = `✅ Result:\n${r.text}`;
  } else out.textContent = `❌ ${r.error}`;
}

// presets
async function runPreset(contract){
  document.getElementById('experiments').textContent = `⏳ Testing ${contract}...`;
  try {
    const res = await rpcPost({ jsonrpc:"2.0", id:"p", method:"query", params:{ request_type:"view_account", finality:"final", account_id:contract }});
    if (res && res.result) document.getElementById('experiments').textContent = `✅ ${contract} scanned. Balance: ${(parseFloat(res.result.amount)/1e24).toFixed(4)} NEAR`;
    else document.getElementById('experiments').textContent = '⚠️ Could not fetch';
  } catch(e){ document.getElementById('experiments').textContent='❌ RPC error'; }
}

// ------------------ Full diagnostic ------------------
async function runFullDiagnostic(){
  const contract = (document.getElementById('contract')||{}).value.trim();
  const out = document.getElementById('result');
  if (!contract){ out.textContent='⚠️ Enter a contract address first.'; return; }
  out.innerHTML = '';
  safeAppendEl('result', `Starting full diagnostic for ${contract}...`);

  safeAppendEl('result','• Checking RPC connectivity...');
  const rpc = await testRPCReachable();
  if (rpc.ok) safeAppendEl('result', `RPC reachable (${rpc.info})`, true);
  else safeAppendEl('result', `RPC unreachable: ${rpc.error}`, false);

  safeAppendEl('result','• Checking account (view_account)...');
  const acct = await testViewAccount(contract);
  if (acct.ok){ safeAppendEl('result', `Account exists. Balance: ${(parseFloat(acct.result.amount)/1e24).toFixed(6)} NEAR (storage: ${acct.result.storage_usage})`, true); }
  else safeAppendEl('result', `Account check failed: ${acct.error}`, false);

  safeAppendEl('result','• Checking contract code (view_code)...');
  const code = await testViewCode(contract);
  if (code.ok) safeAppendEl('result', `Contract code found (size ${code.size})`, true);
  else safeAppendEl('result', `No contract code: ${code.error}`, false);

  safeAppendEl('result','• Inspecting storage (view_state)...');
  const state = await testViewState(contract);
  if (state.ok) safeAppendEl('result', `State keys found: ${state.keys}`, true);
  else safeAppendEl('result', `State not accessible / empty: ${state.error}`, false);

  // optionally call provided method
  const methodName = (document.getElementById('method')||{}).value.trim();
  const argsText = (document.getElementById('args')||{}).value.trim();
  if (methodName){
    safeAppendEl('result', `• Running method: ${methodName}()`);
    let args = {};
    try { args = argsText ? JSON.parse(argsText) : {}; } catch(e){ safeAppendEl('result','Invalid JSON args — skipping',false); }
    const call = await testCallFunction(contract, methodName, args);
    if (call.ok){ safeAppendEl('result', `Method returned:`, true); if (call.parsed) safeAppendEl('result', JSON.stringify(call.parsed,null,2)); else safeAppendEl('result', call.text); }
    else safeAppendEl('result', `Method call failed: ${call.error}`, false);
  } else safeAppendEl('result', '• No method supplied to the Method Analyzer. Provide one to test.');

  // analytics header
  document.getElementById('analytics').textContent = `Last test: ${new Date().toLocaleString()}\nContract: ${contract}\nRPC: ${LAVA_RPC}`;

  // save last report for download
  localStorage.setItem('quasar:lastReportRaw', document.getElementById('result').innerText);
  playSound('click');
}

// ------------------ History / utilities ------------------
function saveHistory(item){
  const raw = JSON.parse(localStorage.getItem('quasar:history') || "[]");
  raw.unshift(item);
  localStorage.setItem('quasar:history', JSON.stringify(raw.slice(0,20)));
}
function clearHistory(){ localStorage.removeItem('quasar:history'); alert('History cleared'); }
function downloadReport(){
  const txt = localStorage.getItem('quasar:lastReportRaw') || 'No report';
  const blob = new Blob([txt], {type:'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download='quasar-lab-report.txt'; a.click(); URL.revokeObjectURL(url);
}

// extras: quick RPC check
async function checkRPC(){
  document.getElementById('rpcInfo').textContent = 'checking...';
  const r = await testRPCReachable();
  document.getElementById('rpcInfo').textContent = r.ok ? `OK (${r.info||'v'})` : `Failed: ${r.error||'no response'}`;
}

// init tiny floating bubbles (visual)
document.addEventListener('DOMContentLoaded', () => {
  // create random small bubbles for the tube area
  const tube = document.querySelector('.test-tube');
  for (let i=0;i<10;i++){
    const b = document.createElement('div'); b.className='bubble'; b.style.left = (10 + Math.random()*40) + 'px'; b.style.animationDelay = (Math.random()*3) + 's'; b.style.width = (6+Math.random()*8)+'px'; tube.appendChild(b);
  }
  // initial tube level
  setTubeLevel(0.08);
});
