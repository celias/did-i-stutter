# Did I Stutter?

A speech fluency analyzer built with React, Deepgram, and Claude. Record yourself speaking, get instant feedback on filler words, false starts, pacing, and an overall fluency score.

## What it does

1. Click **Record** and speak for 30–60 seconds
2. Click **Stop** — your audio is sent to Deepgram for transcription
3. The transcript is analyzed by Claude for fluency issues
4. You get back:
   - **Fluency score** (1–10)
   - **Filler word count** broken down by word (um, uh, like, you know, etc.)
   - **False start count** (interrupted or restarted sentences)
   - **Pacing note** describing your speaking rhythm
   - **Annotated transcript** with filler words highlighted

## Stack

- **React + Vite** — frontend, no backend required
- **Deepgram nova-2** — speech-to-text via pre-recorded REST API
- **Claude Sonnet** — fluency analysis via Anthropic API
- **MediaRecorder API** — browser mic capture (webm/opus)
- **AWS Amplify** — hosting with CI/CD on push to main
- **Route 53** — custom domain DNS

## Deepgram integration

Audio is captured via the browser's `MediaRecorder` API and sent as a binary blob to Deepgram's pre-recorded endpoint with the following parameters:

```
model=nova-2        — highest accuracy for English speech
smart_format=true   — normalizes numbers, dates, and punctuation
punctuate=true      — adds sentence-level punctuation for cleaner Claude input
```

Nova-2 was chosen over Nova or Base for its accuracy on natural, conversational speech — exactly the kind of unscripted audio this app analyzes. The cleaner the transcript, the more reliable the downstream fluency analysis.

**Potential extensions with Deepgram:**
- **Streaming STT** — swap pre-recorded for the WebSocket API to show live word-by-word transcription while the user speaks
- **Diarization** — speaker separation for multi-person fluency analysis (e.g. interview practice with a partner)
- **Language detection** — auto-detect spoken language for non-English speakers
- **Custom vocabulary** — domain-specific filler word lists (e.g. technical jargon used as fillers in sales calls)
- **Utterance detection** — use Deepgram's utterance segmentation instead of sentence-splitting for more accurate false-start detection

## Local setup

1. Copy the example env file:
   ```
   cp .env.example .env
   ```

2. Fill in your API keys in `.env`:
   ```
   VITE_DEEPGRAM_API_KEY=your_deepgram_api_key
   VITE_ANTHROPIC_API_KEY=your_anthropic_api_key
   ```
   - Deepgram key: [console.deepgram.com](https://console.deepgram.com) (free tier available)
   - Anthropic key: [console.anthropic.com](https://console.anthropic.com) (~$0.001 per analysis)

3. Install and run:
   ```
   npm install
   npm run dev
   ```

4. Open `http://localhost:5173`
