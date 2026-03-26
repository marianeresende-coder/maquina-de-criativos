// Monta vídeo final via Creatomate API
// Recebe: clipes de vídeo (URLs) + áudio (URL) + letterings + duração
// Retorna: URL do vídeo final montado (MP4)

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { clips, audioUrl, duration, type } = req.body;
  // clips: [{ url, lettering, duration }] — vídeos em sequência
  // audioUrl: URL do áudio da narração (ElevenLabs)
  // duration: duração total em segundos (15 ou 30)
  // type: "narrado" ou "apresentadora"

  if (!clips || !clips.length) {
    return res.status(400).json({ error: "clips required (array of {url, lettering, duration})" });
  }

  const apiKey = process.env.CREATOMATE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "CREATOMATE_API_KEY not configured" });
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
  if (audioUrl) {
    elements.push({
      type: "audio",
      track: 3,
      time: 0,
      source: audioUrl,
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
    // Criar render
    const response = await fetch("https://api.creatomate.com/v2/renders", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(renderScript),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: `Creatomate error: ${errText}` });
    }

    const data = await response.json();

    // Creatomate retorna array de renders
    const render = Array.isArray(data) ? data[0] : data;
    const renderId = render.id;

    if (render.status === "succeeded" && render.url) {
      return res.status(200).json({ url: render.url, renderId, status: "completed" });
    }

    // Polling — aguardar render finalizar
    const maxAttempts = 60; // 60 × 3s = 180s máximo
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise(r => setTimeout(r, 3000));

      const pollRes = await fetch(`https://api.creatomate.com/v2/renders/${renderId}`, {
        headers: { "Authorization": `Bearer ${apiKey}` },
      });
      const pollData = await pollRes.json();

      if (pollData.status === "succeeded" && pollData.url) {
        return res.status(200).json({ url: pollData.url, renderId, status: "completed" });
      }
      if (pollData.status === "failed") {
        return res.status(500).json({ error: "Creatomate render falhou", renderId, details: pollData.error_message });
      }
    }

    return res.status(504).json({ error: "Timeout aguardando Creatomate", renderId });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
