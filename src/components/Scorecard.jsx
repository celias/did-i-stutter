export function Scorecard({ analysis }) {
  if (!analysis) return null;

  const { fillerWords, totalFillerCount, falseStarts, pacingNote, fluencyScore } = analysis;

  const scoreColor =
    fluencyScore >= 8 ? '#22c55e' : fluencyScore >= 5 ? '#f59e0b' : '#ef4444';

  return (
    <div className="scorecard">
      <h2>Scorecard</h2>
      <div className="score-grid">
        <div className="score-card main-score">
          <div className="score-number" style={{ color: scoreColor }}>
            {fluencyScore}
            <span className="score-denom">/10</span>
          </div>
          <div className="score-label">Fluency Score</div>
        </div>

        <div className="score-card">
          <div className="score-number">{totalFillerCount}</div>
          <div className="score-label">Filler Words</div>
        </div>

        <div className="score-card">
          <div className="score-number">{falseStarts}</div>
          <div className="score-label">False Starts</div>
        </div>
      </div>

      {fillerWords && fillerWords.length > 0 && (
        <div className="filler-breakdown">
          <h3>Filler Breakdown</h3>
          <div className="filler-chips">
            {fillerWords
              .sort((a, b) => b.count - a.count)
              .map(({ word, count }) => (
                <span key={word} className="filler-chip">
                  "{word}" <strong>×{count}</strong>
                </span>
              ))}
          </div>
        </div>
      )}

      {pacingNote && (
        <div className="pacing-note">
          <h3>Pacing</h3>
          <p>{pacingNote}</p>
        </div>
      )}
    </div>
  );
}
