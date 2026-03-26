document.addEventListener('DOMContentLoaded', async () => {
    const scanBtn = document.getElementById('scanBtn');
    const textBtn = document.getElementById('textBtn');
    const resultDiv = document.getElementById('result');
    const resBadge = document.getElementById('resBadge');
    const resTxt = document.getElementById('resTxt');
    const urlBox = document.getElementById('currentUrl');
    const manualTxt = document.getElementById('manualTxt');

    let currentUrl = '';

    // 1. Get current URL
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        currentUrl = tab.url;
        urlBox.textContent = currentUrl;
    } catch (e) {
        urlBox.textContent = "Error: Use Chrome toolbar to scan";
    }

    scanBtn.onclick = () => analyze(currentUrl, scanBtn);
    textBtn.onclick = () => analyze(manualTxt.value, textBtn);

    async function analyze(content, btn) {
        if (!content || content.length < 3) return;
        
        btn.disabled = true;
        btn.textContent = 'Analyzing...';
        resultDiv.style.display = 'none';

        try {
            const res = await fetch('http://localhost:3000/api/analyze/text', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: content })
            });

            const d = await res.json();
            const p = d.success ? d.result : d;

            resBadge.className = `badge ${p.riskLevel === 'HIGH_RISK' ? 'high' : 'safe'}`;
            resBadge.textContent = p.riskLevel.replace('_', ' ');
            resTxt.textContent = p.summary || 'Scan complete.';
            resultDiv.style.display = 'block';

        } catch (e) {
            resBadge.className = 'badge high';
            resBadge.textContent = 'Error';
            resTxt.textContent = 'Backend server (localhost:3000) not reachable.';
            resultDiv.style.display = 'block';
        } finally {
            btn.disabled = false;
            btn.textContent = btn.id === 'scanBtn' ? 'Scan Website →' : 'Analyze Text →';
        }
    }
});
