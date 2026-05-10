export function RecordButton({ isRecording, duration, onStart, onStop, disabled }) {
  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="record-section">
      <button
        className={`record-btn ${isRecording ? 'recording' : ''}`}
        onClick={isRecording ? onStop : onStart}
        disabled={disabled}
      >
        <span className="record-icon">{isRecording ? '⏹' : '⏺'}</span>
        <span>{isRecording ? 'Stop' : 'Record'}</span>
      </button>
      {isRecording && (
        <div className="timer">
          <span className="pulse" />
          {fmt(duration)}
        </div>
      )}
      {!isRecording && duration === 0 && (
        <p className="hint">Speak for 30–60 seconds, then click Stop</p>
      )}
    </div>
  );
}
