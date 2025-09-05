async function testContract() {
    const contractAddress = document.getElementById('contractAddress').value || 'ref-finance-101.testnet';
    const testResult = document.getElementById('testResult');
    const analyticsResult = document.getElementById('analytics');
    const experimentResults = document.getElementById('experiments');
    testResult.innerHTML = 'Testing...';
    analyticsResult.innerHTML = 'Analyzing...';
    experimentResults.innerHTML = '';

    try {
        const deployCheck = await fetch(LAVA_RPC, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 1,
                method: 'query',
                params: { request_type: 'view_code', finality: 'final', account_id: contractAddress }
            })
        });
        const deployData = await deployCheck.json();

        let results = [];
        if (deployData.result && deployData.result.code_base64) {
            results.push('✅ Contract Deployed: Code hash found.');
            testResult.innerHTML = '✅ Contract Active';

            // Test get_messages (suitable for guest-book.testnet)
            const viewCheck = await fetch(LAVA_RPC, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    id: 2,
                    method: 'query',
                    params: {
                        request_type: 'call_function',
                        finality: 'final',
                        account_id: contractAddress,
                        method_name: 'get_messages',
                        args_base64: btoa(JSON.stringify({}))
                    }
                })
            });
            const viewData = await viewCheck.json();

            if (viewData.result && viewData.result.result) {
                results.push('✅ Function Call (get_messages): Success.');
            } else {
                results.push('❌‼️⚠️ Function Call (get_messages): Failed or not supported.');
                results.push('👀 Potential Issue: Function may be missing or restricted.');
            }
        } else {
            testResult.innerHTML = '❌‼️⚠️ Contract Not Found';
            results.push('❌‼️⚠️ Deployment Check: Contract not deployed or invalid address.');
            results.push('👀 Potential Issue: Verify contract address.');
        }

        analyticsResult.innerHTML = `Contract: ${contractAddress}`;
        results.forEach(result => {
            const li = document.createElement('li');
            li.textContent = result;
            experimentResults.appendChild(li);
        });
    } catch (error) {
        testResult.innerHTML = '❌‼️⚠️ Test Failed';
        analyticsResult.innerHTML = 'Error during analysis.';
        const li = document.createElement('li');
        li.textContent = `❌‼️⚠️ Error: ${error.message}. 👀 Potential network issue.`;
        experimentResults.appendChild(li);
    }
}
