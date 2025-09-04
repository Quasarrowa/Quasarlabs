const LAVA_RPC = "https://g.w.lavanet.xyz:443/gateway/neart/rpc-http/a6e5f4c9ab534914cbf08b66860da55d";

const scannerSound = document.getElementById("scanner");
const bubblesSound = document.getElementById("bubbles");
const liquid = document.getElementById("liquid");

// Chart setup
const ctx = document.getElementById("balanceChart").getContext("2d");
const balanceChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [{
      label: "Balance (NEAR)",
      data: [],
      borderColor: "#00e6ff",
      backgroundColor: "rgba(0,230,255,0.2)",
      tension: 0.3
    }]
  },
  options: {
    responsive: true,
    scales: {
      x: { title: { display: true, text: "Experiment Run" } },
      y: { title: { display: true, text: "Balance (NEAR)" } }
    }
  }
});

async function checkContract() {
  const contract = document.getElementById("contract").value.trim();
  if (!contract) {
    document.getElementById("result").textContent = "❌ Please enter a contract name.";
    return;
  }
  scannerSound.play();
  animateTube();
  await fetchContract(contract, "result", "analytics");
}

async function runPreset(contract) {
  document.getElementById("experiments").textContent = `⏳ Testing ${contract}...`;
  scannerSound.play();
  animateTube();
  await fetchContract(contract, "experiments", "analytics");
}

async function fetchContract(contract, targetDivId, analyticsDivId) {
  const targetDiv = document.getElementById(targetDivId);
  const analyticsDiv = document.getElementById(analyticsDivId);
  targetDiv.textContent = "⏳ Running experiment...";

  try {
    const response = await fetch(LAVA_RPC, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "dontcare",
        method: "query",
        params: {
          request_type: "view_account",
          finality: "final",
          account_id: contract
        }
      })
    });

    const data = await response.json();
    if (data.result) {
      const balance = (data.result.amount / 1e24).toFixed(4);
      const storage = data.result.storage_usage;
      targetDiv.textContent =
        `✅ ${contract} scanned!\nBalance: ${balance} NEAR\nStorage: ${storage} bytes\n🔬 Via Lava RPC`;

      analyticsDiv.textContent =
        `🥽 Analytics Report:\n- Contract: ${contract}\n- Balance: ${balance} NEAR\n- Storage: ${storage} bytes`;

      // update chart
      balanceChart.data.labels.push(contract);
      balanceChart.data.datasets[0].data.push(balance);
      balanceChart.update();

      bubblesSound.play();
    } else {
      targetDiv.textContent = "⚠️ Could not fetch contract info.";
    }
  } catch (err) {
    targetDiv.textContent = "❌ Error connecting to Lava RPC.";
  }
}

function animateTube() {
  liquid.style.height = "0%";
  liquid.style.animation = "fill 3s forwards";
}
async function checkNearBalance() {
  const acct = "YOURACCOUNT.testnet"; // Replace with your account
  const resp = await fetch("https://g.w.lavanet.xyz:443/gateway/near/rpc-http/a6e5f4c9ab534914cbf08b66860da55d", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "dontcare",
      method: "query",
      params: {
        request_type: "view_account",
        finality: "final",
        account_id: acct
      }
    })
  });
  const data = await resp.json();
  if (data.result && data.result.amount) {
    const NEAR = (data.result.amount / 1e24).toFixed(4);
    document.getElementById("near-balance").innerText = `${acct} Balance: ${NEAR} NEAR`;
  } else {
    document.getElementById("near-balance").innerText = `Error fetching data for ${acct}`;
  }
}
async function checkBalance() {
  const acct = document.getElementById("accountInput").value;
  const resultBox = document.getElementById("result");

  if (!acct) {
    resultBox.innerText = "⚠️ Please enter an account.";
    return;
  }

  try {
    const response = await fetch("https://g.w.lavanet.xyz:443/gateway/near/rpc-http/a6e5f4c9ab534914cbf08b66860da55d", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "dontcare",
        method: "query",
        params: {
          request_type: "view_account",
          account_id: acct,
          finality: "final"
        }
      })
    });

    const data = await response.json();

    if (data.result) {
      let balance = parseFloat(data.result.amount) / 1e24; // convert yoctoNEAR → NEAR
      resultBox.innerText = `✅ ${acct} balance: ${balance.toFixed(5)} NEAR`;
    } else {
      resultBox.innerText = `❌ Error: ${JSON.stringify(data)}`;
    }
  } catch (err) {
    resultBox.innerText = `❌ Failed: ${err.message}`;
  }
}
