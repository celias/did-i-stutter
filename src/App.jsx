import { useState } from 'react';
import { useRecorder } from './hooks/useRecorder';
import { transcribeAudio } from './services/deepgram';
import { analyzeTranscript } from './services/claude';
import { RecordButton } from './components/RecordButton';
import { Transcript } from './components/Transcript';
import { Scorecard } from './components/Scorecard';
import './App.css';

const PHASE = {
  IDLE: 'idle',
  RECORDING: 'recording',
  TRANSCRIBING: 'transcribing',
  ANALYZING: 'analyzing',
  DONE: 'done',
  ERROR: 'error',
};

export default function App() {
  const { isRecording, duration, start, stop } = useRecorder();
  const [phase, setPhase] = useState(PHASE.IDLE);
  const [transcript, setTranscript] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');

  async function handleStart() {
    setError('');
    setTranscript('');
    setAnalysis(null);
    setPhase(PHASE.RECORDING);
    await start();
  }

  async function handleStop() {
    try {
      const blob = await stop();
      if (!blob) return;

      setPhase(PHASE.TRANSCRIBING);
      const text = await transcribeAudio(blob);
      setTranscript(text);

      setPhase(PHASE.ANALYZING);
      const result = await analyzeTranscript(text);
      setAnalysis(result);

      setPhase(PHASE.DONE);
    } catch (err) {
      setError(err.message);
      setPhase(PHASE.ERROR);
    }
  }

  function handleReset() {
    setPhase(PHASE.IDLE);
    setTranscript('');
    setAnalysis(null);
    setError('');
  }

  const busy = phase === PHASE.TRANSCRIBING || phase === PHASE.ANALYZING;

  return (
    <div className="app">
      <header className="app-header">
        <h1>Did I Stutter?</h1>
        <p className="subtitle">Record yourself speaking, get instant fluency feedback</p>
      </header>

      <main className="app-main">
        <RecordButton
          isRecording={isRecording}
          duration={duration}
          onStart={handleStart}
          onStop={handleStop}
          disabled={busy}
        />

        {busy && (
          <div className="status-message">
            <span className="spinner" />
            {phase === PHASE.TRANSCRIBING ? 'Transcribing with Deepgram…' : 'Analyzing with Claude…'}
          </div>
        )}

        {phase === PHASE.ERROR && (
          <div className="error-box">
            <strong>Error:</strong> {error}
            <button className="retry-btn" onClick={handleReset}>
              Try again
            </button>
          </div>
        )}

        {phase === PHASE.DONE && (
          <>
            <Scorecard analysis={analysis} />
            <Transcript text={transcript} highlights={analysis?.highlights} />
            <button className="reset-btn" onClick={handleReset}>
              Record again
            </button>
          </>
        )}
      </main>
    </div>
  );
}
