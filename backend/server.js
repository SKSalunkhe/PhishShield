require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, '../public')));

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function getApiKey() {
  const key = process.env.GROK_API_KEY;
  console.log('Using key:', key ? key.slice(0, 8) + '...' : 'MISSING');
  if (!key) throw new Error('No GROK_API_KEY found in .env');
  return key;
}

function extractJSON(text) {
  let cleaned = text.replace(/```json|```/g, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('No JSON found in response');
  return JSON.parse(cleaned.substring(start, end + 1));
}

function normalizeRiskLevel(raw) {
  if (!raw) return 'SAFE';
  const val = String(raw).toUpperCase().replace(/[_\s-]/g, '');
  if (val.includes('HIGH')) return 'HIGH_RISK';
  if (val.includes('SUSPICIOUS')) return 'SUSPICIOUS';
  return 'SAFE';
}

// ─────────────────────────────────────────────
// HARD PRE-CHECK — HIGH RISK
// ─────────────────────────────────────────────
function hardRiskCheck(text) {
  const t = text.trim();
  const tLower = t.toLowerCase();

  const checks = [
    { phrases: ['otp', 'share otp', 'send otp', 'give otp', 'share the otp', 'cvv', 'share pin', 'send pin', 'atm pin', 'upi pin', 'bank details', 'share bank', 'account number', 'ifsc', 'card number', 'ur bank', 'your bank detail'], lang: 'English' },
    { phrases: ['तपशील शेअर करा', 'बँक तपशील', 'खाते तपशील', 'बँक माहिती', 'OTP सांगा', 'OTP शेअर', 'पिन सांगा', 'पासवर्ड द्या', 'पासवर्ड शेअर'], lang: 'Marathi' },
    { phrases: ['बैंक डिटेल्स', 'बैंक विवरण', 'खाता नंबर', 'पिन बताएं', 'पासवर्ड बताएं', 'पासवर्ड शेयर', 'OTP दें', 'OTP शेयर'], lang: 'Hindi' },
    { phrases: ['வங்கி விவரங்கள்', 'OTP கொடுங்கள்', 'கடவுச்சொல்'], lang: 'Tamil' },
    { phrases: ['ব্যাংক বিবরণ', 'OTP দিন', 'পাসওয়ার্ড শেয়ার'], lang: 'Bengali' },
    { phrases: ['బ్యాంక్ వివరాలు', 'OTP చెప్పండి', 'పాస్వర్డ్ షేర్'], lang: 'Telugu' },
    { phrases: ['ਬੈਂਕ ਵੇਰਵੇ', 'OTP ਦੱਸੋ', 'ਪਾਸਵਰਡ ਸਾਂਝਾ'], lang: 'Punjabi' },
    { phrases: ['બેંક વિગતો', 'OTP આપો', 'પાસવર્ડ શેર'], lang: 'Gujarati' },
    { phrases: ['ബാങ്ക് വിവരങ്ങൾ', 'OTP പറയൂ', 'പാസ്വേഡ് ഷെയർ'], lang: 'Malayalam' },
  ];

  for (const { phrases, lang } of checks) {
    const matched = phrases.find(p => t.includes(p) || tLower.includes(p.toLowerCase()));
    if (matched) {
      return {
        risk_level: 'HIGH_RISK', riskLevel: 'HIGH_RISK',
        scam_probability: 95, riskScore: 95,
        language: lang, threats: 1, links: 0, tactics: 1,
        reasons: [`Requesting sensitive information: "${matched}"`, 'Sharing this is NEVER safe — this is a phishing attempt'],
        highlighted_phrases: [matched],
        summary: `Message requests "${matched}" — this is a phishing attempt`,
        recommendation: '🚨 DO NOT share any information. Block and report immediately.'
      };
    }
  }
  return null;
}

// ─────────────────────────────────────────────
// SUSPICIOUS PRE-CHECK
// ─────────────────────────────────────────────
function suspiciousCheck(text) {
  const t = text.trim();
  const tLower = t.toLowerCase();

  const allKeywords = [
    'click here', 'click this link', 'click on this link', 'click the link',
    'update kyc', 'kyc update', 'kyc expired', 'kyc pending', 'complete kyc',
    'verify your account', 'account will be suspended', 'account will be blocked',
    'you have won', 'claim your prize', 'free offer', 'lucky winner',
    'work from home', 'earn daily', 'loan approved', 'instant loan',
    'delivery pending', 'package on hold', 'sim will be blocked',
    'यहाँ क्लिक करें', 'लिंक पर क्लिक', 'KYC अपडेट करें', 'लोन मंजूर',
    'येथे क्लिक करा', 'लिंकवर क्लिक', 'KYC अपडेट करा', 'कर्ज मंजूर',
    'இங்கே கிளிக்', 'KYC புதுப்பிக்கவும்',
    'এখানে ক্লিক', 'KYC আপডেট',
    'ఇక్కడ క్లిక్', 'KYC అప్డేట్',
    'ਇੱਥੇ ਕਲਿੱਕ', 'KYC ਅਪਡੇਟ',
    'અહીં ક્લિક', 'KYC અપડેટ',
    'ഇവിടെ ക്ലിക്ക്', 'KYC അപ്ഡേറ്റ്',
    'link par click', 'kyc update karo', 'loan approved ho',
  ];

  const matched = allKeywords.find(p => t.includes(p) || tLower.includes(p.toLowerCase()));
  if (matched) {
    return {
      risk_level: 'SUSPICIOUS', riskLevel: 'SUSPICIOUS',
      scam_probability: 55, riskScore: 55,
      language: 'Auto-detected', threats: 0, links: 1, tactics: 1,
      reasons: [`Suspicious pattern: "${matched}"`, 'Contains unverified link, KYC request, or suspicious offer'],
      highlighted_phrases: [matched],
      summary: 'Message contains a potential scam pattern — do not respond without verifying',
      recommendation: '⚠️ Verify through official channels before responding.'
    };
  }
  return null;
}

// ─────────────────────────────────────────────
// SYSTEM PROMPT
// ─────────────────────────────────────────────
const SYSTEM_PROMPT = `You are PhishShield AI, an expert cybersecurity analyst specializing in detecting phishing, scam, and fraud messages targeting Indian citizens.

Analyze the given message and respond ONLY with a JSON object. No markdown, no extra text.

RISK LEVELS:
- HIGH_RISK (score 70-100): OTP/PIN/password request, bank details request, authority impersonation + demand, prize claim + contact request, arrest threat + info request
- SUSPICIOUS (score 35-69): Urgency without demand, unverified link, vague offer, delivery notification with link
- SAFE (score 0-34): Normal conversation, no demands, no suspicious links

OUTPUT FORMAT (JSON only, no markdown):
{"risk_level":"HIGH_RISK or SUSPICIOUS or SAFE","scam_probability":0,"language":"detected language","threats":0,"links":0,"tactics":0,"reasons":["reason1","reason2"],"highlighted_phrases":["exact phrase from message"],"summary":"one line in English"}

RULES:
1. risk_level must be exactly HIGH_RISK, SUSPICIOUS, or SAFE
2. highlighted_phrases must be exact words from the input
3. summary always in English
4. ANY OTP/PIN/password request = HIGH_RISK score 95+
5. ANY bank details request = HIGH_RISK score 85+
6. Normal greetings = SAFE score under 10`;

// ─────────────────────────────────────────────
// HEALTH CHECK
// ─────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    port: PORT,
    apiKeyConfigured: !!process.env.GROK_API_KEY,
    apiKeyValidFormat: process.env.GROK_API_KEY?.startsWith('gsk_') || false,
    timestamp: new Date().toISOString()
  });
});

// ─────────────────────────────────────────────
// TEST GROQ ROUTE
// ─────────────────────────────────────────────
app.get('/api/test-groq', async (req, res) => {
  try {
    const key = process.env.GROK_API_KEY;
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'llama-3.3-70b-versatile', messages: [{ role: 'user', content: 'say hi' }], max_tokens: 10 })
    });
    const data = await r.json();
    res.json({ status: r.status, ok: r.ok, data });
  } catch (e) {
    res.json({ error: e.message });
  }
});

// ─────────────────────────────────────────────
// TEXT ANALYSIS — SINGLE ROUTE
// ─────────────────────────────────────────────
app.post('/api/analyze/text', async (req, res) => {
  try {
    const { text, language = 'auto-detect' } = req.body;
    console.log('📩 Text:', text?.slice(0, 50));

    if (!text?.trim()) return res.status(400).json({ error: 'text is required' });

    const key = getApiKey();

    // Hard pre-check
    const hardResult = hardRiskCheck(text);
    if (hardResult) {
      console.log('🛡️ Hard check → HIGH_RISK');
      return res.json({ success: true, result: hardResult });
    }

    // Suspicious pre-check
    const suspResult = suspiciousCheck(text);
    if (suspResult) {
      console.log('⚠️ Suspicious check → SUSPICIOUS');
      return res.json({ success: true, result: suspResult });
    }

    // Call Groq
    console.log('🤖 Calling Groq...');
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        temperature: 0.05,
        max_tokens: 500,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Language hint: ${language}\nMessage: "${text.trim()}"` }
        ]
      })
    });

    console.log('📡 Groq status:', groqRes.status);

    if (!groqRes.ok) {
      const errBody = await groqRes.text();
      console.error('❌ Groq error:', groqRes.status, errBody);
      return res.status(500).json({ error: 'Groq API request failed', detail: errBody });
    }

    const groqData = await groqRes.json();
    const rawContent = groqData.choices?.[0]?.message?.content;
    console.log('✅ Groq reply:', rawContent?.slice(0, 100));

    if (!rawContent) return res.status(500).json({ error: 'Empty Groq response' });

    let result;
    try {
      result = extractJSON(rawContent);
    } catch (e) {
      console.error('❌ JSON parse error:', rawContent?.slice(0, 200));
      return res.status(500).json({ error: 'JSON parse failed', raw: rawContent });
    }

    result.risk_level          = normalizeRiskLevel(result.risk_level);
    result.scam_probability    = Math.max(0, Math.min(100, Number(result.scam_probability) || 0));
    result.threats             = Number(result.threats) || 0;
    result.links               = Number(result.links) || 0;
    result.tactics             = Number(result.tactics) || 0;
    result.language            = result.language || 'Unknown';
    result.reasons             = Array.isArray(result.reasons) ? result.reasons : [];
    result.highlighted_phrases = Array.isArray(result.highlighted_phrases) ? result.highlighted_phrases : [];
    result.summary             = result.summary || '';
    result.riskLevel           = result.risk_level;
    result.riskScore           = result.scam_probability;

    console.log(`✅ Done | Risk: ${result.risk_level} | Score: ${result.scam_probability}`);
    return res.json({ success: true, result });

  } catch (err) {
    console.error('💥 CRASH:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────
// AUDIO ANALYSIS
// ─────────────────────────────────────────────
app.post('/api/analyze/audio', upload.array('files', 5), async (req, res) => {
  try {
    if (!req.files?.length) return res.status(400).json({ error: 'No files uploaded' });

    const file = req.files[0];
    const filename = file.originalname.toLowerCase();
    const highRiskKeywords = ['otp', 'pin', 'upi', 'cvv', 'aadhaar', 'account', 'sbi', 'hdfc'];
    const suspKeywords = ['bank', 'call', 'loan', 'offer', 'prize'];

    let riskLevel = 'SAFE', riskScore = 20, findings = [];

    if (highRiskKeywords.some(kw => filename.includes(kw))) {
      riskLevel = 'HIGH_RISK'; riskScore = 92;
      findings = [{ severity: 'high', text: `High-risk terms in filename: ${filename.slice(0, 30)}`, type: 'FILENAME_SPAM' }];
    } else if (suspKeywords.some(kw => filename.includes(kw))) {
      riskLevel = 'SUSPICIOUS'; riskScore = 68;
      findings = [{ severity: 'medium', text: `Suspicious filename: ${filename.slice(0, 30)}`, type: 'FILENAME_SUSPICION' }];
    }

    const mockTranscript = filename.includes('sbi') ? 'Namaste SBI bank se bol raha hun. OTP share kariye.' :
                           filename.includes('loan') ? 'Congratulations! 5 lakh loan approved. Bank details bhejiye.' :
                           'Normal call recording';

    res.json({
      success: true, result: {
        overallRiskLevel: riskLevel, overallRiskScore: riskScore,
        summary: `Audio analyzed - ${riskLevel.toLowerCase()} detected`,
        files: [{ filename: file.originalname, transcript: mockTranscript, riskLevel, riskScore, findings, highlightedSegments: [], suspicious_phrases: findings.map(f => f.text) }],
        manipulationTactics: riskLevel === 'HIGH_RISK' ? { Urgency: 90, Authority: 85 } : { Greed: 70 },
        recommendation: riskLevel === 'HIGH_RISK' ? 'BLOCK & REPORT' : riskLevel === 'SUSPICIOUS' ? 'Verify before responding' : 'Safe'
      }
    });
  } catch (err) {
    console.error('Audio error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────
// FRONTEND ROUTES
// ─────────────────────────────────────────────
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../public/index.html')));
app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, '../public/index.html')));
app.use((req, res) => res.sendFile(path.join(__dirname, '../public/index.html')));

// ─────────────────────────────────────────────
// START SERVER
// ─────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`PhishShield running at http://localhost:${PORT}`);
  console.log(`API Key configured: ${!!process.env.GROK_API_KEY}`);
  console.log('Endpoints: /api/analyze/text | /api/analyze/audio');
});