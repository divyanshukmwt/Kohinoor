/**
 * Gemini Service — Éclat Platform
 * Client-side conversational AI via Google Gemini.
 *
 * Used for:
 *  - Éclat persona chat responses (conversational UI)
 *  - Client-side semantic query extraction (mock fallback only)
 *
 * In production: semantic extraction runs server-side via FastAPI + Gemini.
 * In mock mode:  extraction runs here in the browser using the public API key.
 */

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

const ECLAT_PERSONA = `You are Éclat — a luxury AI jewellery concierge for an ultra-premium jewellery maison.

Your voice is:
- Calm, editorial, and poetic
- Deeply knowledgeable about jewellery craftsmanship, materials, and styling
- Never salesy or pushy
- Speaks with restraint and elegance
- Uses short, beautiful sentences
- Occasionally references emotion, heritage, and the permanence of fine jewellery

You help customers:
- Discover jewellery that matches their aesthetic and intent
- Understand materials (18k gold, platinum, rose gold, diamonds, sapphires, rubies)
- Navigate occasions (wedding, anniversary, gifting, daily wear, editorial)
- Find their personal jewellery language

When asked to generate recommendation queries, respond ONLY in valid JSON.
Keep conversational responses under 80 words. Be poetic, not verbose.`;

// ─────────────────────────────────────────────
// CONVERSATIONAL RESPONSE
// ─────────────────────────────────────────────

/**
 * Generate an Éclat persona response from conversation history.
 * @param {Array<{role: string, content: string}>} conversationHistory
 * @returns {Promise<string>}
 */
export async function generateChatResponse(conversationHistory) {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey) {
    return getFallbackResponse(conversationHistory);
  }

  try {
    const contents = [
      { role: 'user',  parts: [{ text: ECLAT_PERSONA }] },
      { role: 'model', parts: [{ text: 'Understood. I am Éclat, your personal jewellery concierge. How may I guide you today?' }] },
      ...conversationHistory.map((msg) => ({
        role:  msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      })),
    ];

    const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: { temperature: 0.85, topK: 40, topP: 0.95, maxOutputTokens: 512 },
        safetySettings: [{ category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }],
      }),
    });

    if (!res.ok) throw new Error(`Gemini API ${res.status}`);
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || getFallbackResponse(conversationHistory);
  } catch (err) {
    console.error('[Gemini] Chat error:', err);
    return getFallbackResponse(conversationHistory);
  }
}

// ─────────────────────────────────────────────
// SEMANTIC QUERY EXTRACTION
// ─────────────────────────────────────────────

/**
 * Extract semantic embedding query + structured filters from user selections.
 * @param {Object} selections
 * @param {string} conversationalQuery
 * @returns {Promise<{ embeddingQuery: string, filters: Object }>}
 */
export async function generateSemanticQuery(selections, conversationalQuery = '') {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  const selectionText = Object.entries(selections)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`)
    .join(', ');

  const prompt = `Generate a semantic search query for a luxury jewellery recommendation engine.

Customer preferences: ${selectionText}
${conversationalQuery ? `Customer request: "${conversationalQuery}"` : ''}

Return ONLY a valid JSON object (no markdown, no explanation):
{
  "embeddingQuery": "20-40 word descriptive text capturing aesthetic, material, occasion, style intent, emotional quality",
  "filters": {
    "materials": [],
    "occasions": [],
    "styleTags": [],
    "wearType": null,
    "gender": null,
    "minPrice": null,
    "maxPrice": null
  }
}`;

  if (!apiKey) {
    return buildFallbackSemanticQuery(selections, conversationalQuery);
  }

  try {
    const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 512 },
      }),
    });

    const data = await res.json();
    const raw  = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const clean = raw.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch (err) {
    console.error('[Gemini] Semantic query error:', err);
    return buildFallbackSemanticQuery(selections, conversationalQuery);
  }
}

// ─────────────────────────────────────────────
// FALLBACKS
// ─────────────────────────────────────────────

function getFallbackResponse(history) {
  const last = (history[history.length - 1]?.content || '').toLowerCase();
  if (last.includes('gold'))    return 'Gold carries a warmth that endures across every era. Shall I show you pieces that honour that legacy?';
  if (last.includes('diamond')) return 'Diamonds hold light the way memory holds meaning — permanently. Let me curate something extraordinary.';
  if (last.includes('minimal') || last.includes('simple')) return 'Restraint is its own form of luxury. I\'ll find pieces that whisper rather than shout.';
  if (last.includes('wedding') || last.includes('bridal')) return 'Your most significant day deserves jewellery that will outlast it in beauty and meaning.';
  if (last.includes('rose gold')) return 'Rose gold speaks of warmth and romance — a metal with its own emotional register. Let me find something that captures that.';
  return 'Every great jewellery discovery begins with a question. What draws you to explore today?';
}

function buildFallbackSemanticQuery(selections, conversationalQuery = '') {
  const { purpose, gender, material, wearType, style, budget } = selections;
  const parts = [];
  const filters = {};

  if (style)    parts.push(style);
  if (material) { parts.push(material); filters.materials = [material.toLowerCase()]; }
  if (wearType) { parts.push(`${wearType} jewellery`); filters.wearType = wearType; }
  if (purpose)  { parts.push(`for ${purpose}`); filters.occasions = [purpose]; }
  if (gender && gender !== 'unisex') { parts.push(`for ${gender}`); filters.gender = gender; }
  if (style)    filters.styleTags = [style.toLowerCase()];
  if (conversationalQuery) parts.push(conversationalQuery);

  const BUDGET_PRICES = {
    under_5k:  { max: 5000 },
    '5k_20k':  { min: 5000, max: 20000 },
    '20k_50k': { min: 20000, max: 50000 },
    above_50k: { min: 50000 },
  };
  if (budget && BUDGET_PRICES[budget]) {
    const { min, max } = BUDGET_PRICES[budget];
    if (min) filters.minPrice = min;
    if (max) filters.maxPrice = max;
  }

  return {
    embeddingQuery: parts.join(' ') || 'luxury elegant fine jewellery',
    filters,
  };
}
