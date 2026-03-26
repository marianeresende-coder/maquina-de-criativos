// Monta vídeo final via Creatomate API
// Recebe: clipes de vídeo (URLs) + áudio (URL) + letterings + duração
// Retorna: renderId para polling do frontend (não faz polling aqui)

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { clips, audioUrl, duration, type } = req.body;
  // clips: [{ url, lettering, duration }] — vídeos em sequência
  // audioUrl: URL do áudio da narração (ElevenLabs) — pode ser data URI ou URL
  // duration: duração total em segundos (15 ou 30)
  // type: "narrado" ou "apresentadora"

  if (!clips || !clips.length) {
    return res.status(400).json({ error: "clips required (array of {url, lettering, duration})" });
  }

  const apiKey = process.env.CREATOMATE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "CREATOMATE_API_KEY not configured" });
  }

  // Se o áudio é base64, salvar no Vercel Blob primeiro (Creatomate precisa de URL)
  let finalAudioUrl = audioUrl;
  if (audioUrl && audioUrl.startsWith('data:')) {
    try {
      const { put } = require('@vercel/blob');
      const base64Data = audioUrl.split(',')[1];
      const audioBuffer = Buffer.from(base64Data, 'base64');
      const blob = await put(`temp/audio-${Date.now()}.mp3`, audioBuffer, {
        access: 'public',
        contentType: 'audio/mpeg',
        addRandomSuffix: true,
      });
      finalAudioUrl = blob.url;
    } catch (e) {
      console.error('Erro ao salvar áudio no Blob:', e);
      // Continua com data URI como fallback
    }
  }

  // Montar RenderScript — elementos na timeline
  const elements = [];
  let currentTime = 0;

  // Track 1: Vídeos em sequência
  for (const clip of clips) {
    const clipDur = clip.duration || 5;

    // Vídeo de fundo
    elements.push({
      type: "video",
      track: 1,
      time: currentTime,
      duration: clipDur,
      source: clip.url,
      fit: "cover",
    });

    // Lettering na tela (se tiver)
    if (clip.lettering) {
      elements.push({
        type: "text",
        track: 2,
        time: currentTime,
        duration: clipDur,
        text: clip.lettering,
        font_family: "Space Grotesk",
        font_weight: "700",
        font_size: "6 vmin",
        fill_color: "#ffffff",
        shadow_color: "rgba(0,0,0,0.6)",
        shadow_blur: "3 vmin",
        x: "50%",
        y: "85%",
        width: "80%",
        x_alignment: "50%",
        y_alignment: "50%",
      });
    }

    currentTime += clipDur;
  }

  // Track 3: Áudio da narração por cima de tudo
  if (finalAudioUrl) {
    elements.push({
      type: "audio",
      track: 3,
      time: 0,
      source: finalAudioUrl,
    });
  }

  const renderScript = {
    output_format: "mp4",
    width: 1080,
    height: 1920,
    duration: duration || currentTime,
    elements,
  };

  try {
    // Criar render — retorna imediatamente
    const response = await fetch("https://api.creatomate.com/v1/renders", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ source: renderScript }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: `Creatomate error: ${errText}` });
    }

    const data = await response.json();
    const render = Array.isArray(data) ? data[0] : data;
    const renderId = render.id;

    // Se já finalizou (improvável mas possível)
    if (render.status === "succeeded" && render.url) {
      return res.status(200).json({ url: render.url, renderId, status: "completed" });
    }

    // Retorna renderId para o frontend fazer polling
    return res.status(200).json({ renderId, status: "processing" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
