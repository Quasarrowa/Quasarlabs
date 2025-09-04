// ===== TAB SWITCHING =====
function openTab(tabId) {
  const tabs = document.querySelectorAll(".tab-content");
  const buttons = document.querySelectorAll(".tab-btn");

  tabs.forEach(tab => tab.classList.remove("active"));
  buttons.forEach(btn => btn.classList.remove("active"));

  document.getElementById(tabId).classList.add("active");
  event.target.classList.add("active");
}

// ===== BALANCE CHECKER =====
async function checkBalance() {
  const accountId = document.getElementById("accountId").value;
  const resultEl = document.getElementById("balance-result");

  if (!accountId) {
    resultEl.textContent = "⚠️ Please enter an account ID.";
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
          finality: "final",
          account_id: accountId
        }
      })
    });

    const data = await response.json();
    if (data.result) {
      let balance = parseFloat(data.result.amount) / 1e24;
      resultEl.textContent = `✅ Balance: ${balance.toFixed(5)} NEAR`;
    } else {
      resultEl.textContent = "❌ Account not found or RPC error.";
    }
  } catch (err) {
    resultEl.textContent = "❌ Failed to fetch balance.";
  }
}

// ===== LAB TESTS =====
async function runLabTests() {
  const contractId = document.getElementById("contractId").value;
  const resultsEl = document.getElementById("test-results");
  resultsEl.innerHTML = "";

  if (!contractId) {
    addTestResult("⚠️ Please enter a contract ID.");
    return;
  }

  // Test 1: RPC Reachability
  try {
    const response = await fetch("https://g.w.lavanet.xyz:443/gateway/near/rpc-http/a6e5f4c9ab534914cbf08b66860da55d", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "ping",
        method: "status",
        params: []
      })
    });
    const data = await response.json();
    if (data && data.result) {
      addTestResult("✅ RPC is reachable.");
    } else {
      addTestResult("❌ RPC did not respond correctly.");
    }
  } catch (err) {
    addTestResult("❌ RPC request failed.");
  }

  // Test 2: Contract Existence
  try {
    const response = await fetch("https://g.w.lavanet.xyz:443/gateway/near/rpc-http/a6e5f4c9ab534914cbf08b66860da55d", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "contract-check",
        method: "query",
        params: {
          request_type: "view_account",
          finality: "final",
          account_id: contractId
        }
      })
    });
    const data = await response.json();
    if (data.result && data.result.code_hash !== "11111111111111111111111111111111") {
      addTestResult("✅ Contract is deployed.");
    } else {
      addTestResult("❌ Contract not deployed on this account.");
    }
  } catch (err) {
    addTestResult("❌ Could not verify contract.");
  }
}

// Helper function to add results
function addTestResult(message) {
  const resultsEl = document.getElementById("test-results");
  const li = document.createElement("li");
  li.textContent = message;
  resultsEl.appendChild(li);
}
