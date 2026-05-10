export async function transcribeAudio(audioBlob) {
  const apiKey = import.meta.env.VITE_DEEPGRAM_API_KEY;
  if (!apiKey) throw new Error('VITE_DEEPGRAM_API_KEY is not set');

  const response = await fetch(
    'https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true&punctuate=true',
    {
      method: 'POST',
      headers: {
        Authorization: `Token ${apiKey}`,
        'Content-Type': audioBlob.type || 'audio/webm',
      },
      body: audioBlob,
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Deepgram error ${response.status}: ${err}`);
  }

  const data = await response.json();
  return data.results.channels[0].alternatives[0].transcript;
}
