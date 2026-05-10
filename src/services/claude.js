const SYSTEM_PROMPT = `You are a speech fluency coach. Analyze transcripts and return a JSON object (no markdown, raw JSON only).`;

const USER_PROMPT = (transcript) => `Analyze this speech transcript for fluency issues.

Transcript:
"""
${transcript}
"""

Return a raw JSON object with exactly these fields:
{
  "fillerWords": [{ "word": "uh", "count": 3 }, ...],
  "totalFillerCount": 12,
  "falseStarts": 2,
  "pacingNote": "One or two sentences about speaking pace and rhythm.",
  "fluencyScore": 7,
  "highlights": ["uh", "um", "like", "you know", "so"]
}

Rules:
- fillerWords: count every filler detected (um, uh, like, you know, so, basically, literally, actually, right, okay, well, I mean)
- falseStarts: count interrupted or restarted sentences (e.g. "I was- I mean I went")
- fluencyScore: 1–10 where 10 is perfect; deduct for fillers, false starts, and erratic pace
- highlights: the unique filler word strings to highlight in the UI (lowercase, as they appear in transcript)
- Return ONLY valid JSON. No explanation, no markdown fences.`;

export async function analyzeTranscript(transcript) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('VITE_ANTHROPIC_API_KEY is not set');

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: USER_PROMPT(transcript) }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Claude error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const raw = data.content[0].text.trim();

  try {
    return JSON.parse(raw);
  } catch {
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error('Claude returned invalid JSON');
  }
}
