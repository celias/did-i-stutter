export function Transcript({ text, highlights }) {
  if (!text) return null;

  const annotated = buildAnnotatedText(text, highlights || []);

  return (
    <div className="transcript-section">
      <h2>Transcript</h2>
      <div className="transcript-box">{annotated}</div>
      <p className="transcript-legend">
        <span className="filler-highlight">highlighted</span> = filler word
      </p>
    </div>
  );
}

function buildAnnotatedText(text, highlights) {
  if (!highlights.length) return text;

  // Build a regex that matches any filler word (whole word, case-insensitive)
  const escaped = highlights.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const pattern = new RegExp(`\\b(${escaped.join('|')})\\b`, 'gi');

  const parts = [];
  let last = 0;
  let match;
  let key = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(text.slice(last, match.index));
    }
    parts.push(
      <mark key={key++} className="filler-highlight">
        {match[0]}
      </mark>
    );
    last = match.index + match[0].length;
  }

  if (last < text.length) parts.push(text.slice(last));
  return parts;
}
