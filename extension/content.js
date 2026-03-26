// Links to check in the background
const signatures = [
    'sbi', 'hdfc', 'icici', 'axis', 'paytm', 'phonepe', 'gpay', 'amazon', 'flipkart', 'otp', 'kyc'
];

// Quick check for brand impersonation
function checkLinks() {
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        const href = link.href.toLowerCase();
        const text = link.innerText.toLowerCase();
        
        signatures.forEach(sig => {
            if (href.includes(sig) || text.includes(sig)) {
                // If it contains a signature but the domain is suspicious
                const domain = new URL(href).hostname;
                if (!domain.includes(sig)) {
                  link.style.border = "1px dashed #ff3f57";
                  link.title = "PhishShield AI: Suspicious link detected. Domain does not match brand.";
                }
            }
        });
    });
}

// Check on load
setTimeout(checkLinks, 2000);
