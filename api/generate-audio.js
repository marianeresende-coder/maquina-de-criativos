// AGENTE 05 — EXECUTOR CRIATIVO (áudio/narração)
// Chama ElevenLabs para gerar narração em off das peças 3 e 4

async function fetchWithRetry(url, options, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, options);
      if (res.ok || i === retries) return res;
      if (res.status === 429) {
        await new Promise(r => setTimeout(r, 2000 * (i + 1)));
        continue;
      }
      return res;
    } catch (err) {
      if (i === retries) throw err;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text, voiceId, modelId, speed, stability, similarityBoost } = req.body;
  // text: texto exato da narração em off
  // voiceId: ID da voz no ElevenLabs (default: Monica Medeiros — ELEVENLABS_VOICE_ID)
  // modelId: modelo TTS (default: eleven_multilingual_v2 — suporta português)
  // speed: velocidade da fala (default: 1.0)
  // stability: estabilidade da voz (0-1, default: 0.5)
  // similarityBoost: fidelidade à voz original (0-1, default: 0.75)

  if (!text) {
    return res.status(400).json({ error: "text required" });
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "ELEVENLABS_API_KEY not configured" });
  }

  const voice = voiceId || process.env.ELEVENLABS_VOICE_ID;
  if (!voice) {
    return res.status(500).json({ error: "voiceId not provided and ELEVENLABS_VOICE_ID not configured" });
  }

  const model = modelId || "eleven_multilingual_v2";
  const outputFormat = "mp3_44100_128";

  const endpoint = `https://api.elevenlabs.io/v1/text-to-speech/${voice}?output_format=${outputFormat}`;

  const body = {
    text,
    model_id: model,
    voice_settings: {
      stability: stability ?? 0.5,
      similarity_boost: similarityBoost ?? 0.75,
      style: 0.3,
      use_speaker_boost: true,
      speed: speed ?? 1.0,
    },
  };

  try {
    const response = await fetchWithRetry(endpoint, {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: `ElevenLabs error: ${errText}` });
    }

    // ElevenLabs returns raw audio bytes
    const audioBuffer = Buffer.from(await response.arrayBuffer());
    const base64Audio = audioBuffer.toString("base64");

    return res.status(200).json({
      audio: base64Audio,
      format: "mp3",
      model,
      voiceId: voice,
      textLength: text.length,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
