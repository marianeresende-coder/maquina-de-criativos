// AGENTE 05 — EXECUTOR CRIATIVO (vídeos)
// Chama fal.ai para gerar um vídeo por vez a partir de uma imagem
// Engines: "kling" (cenas do empreendimento), "veo3" (Monica apresentadora — mais realista)

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt, engine, imageUrl, format, duration, generateAudio } = req.body;
  // engine: "kling" ou "veo3"
  // imageUrl: URL da imagem (do Drive ou gerada)
  // format: "9:16" (padrão)
  // duration: duração do vídeo (veo3: "4s"/"6s"/"8s", kling: "5"/"10")
  // generateAudio: boolean (só veo3 — gera áudio junto com o vídeo)

  if (!prompt || !engine) {
    return res.status(400).json({ error: "prompt and engine required" });
  }

  const falKey = process.env.FAL_KEY;
  if (!falKey) {
    return res.status(500).json({ error: "FAL_KEY not configured" });
  }

  let endpoint, body;

  if (engine === "kling") {
    // Kling: para animar imagens do Drive (cenas do empreendimento)
    if (!imageUrl) {
      return res.status(400).json({ error: "imageUrl required for kling" });
    }
    endpoint = "https://fal.run/fal-ai/kling-video/v2/master";
    body = {
      prompt,
      image_url: imageUrl,
      duration: duration || "5",
      aspect_ratio: "9:16",
    };
  } else if (engine === "veo3" && imageUrl) {
    // Veo 3 image-to-video: para a Monica (mais realista pra pessoas)
    endpoint = "https://fal.run/fal-ai/veo3/image-to-video";
    body = {
      prompt,
      image_url: imageUrl,
      duration: duration || "8s",
      aspect_ratio: "9:16",
      resolution: "720p",
      generate_audio: generateAudio ?? false,
      safety_tolerance: 5,
    };
  } else if (engine === "veo3") {
    // Veo 3 text-to-video: gerar a Monica do zero (sem imagem base)
    endpoint = "https://fal.run/fal-ai/veo3";
    body = {
      prompt,
      duration: duration || "8s",
      aspect_ratio: "9:16",
      resolution: "720p",
      generate_audio: generateAudio ?? false,
      safety_tolerance: 5,
    };
  } else {
    return res.status(400).json({ error: "engine must be 'kling' or 'veo3'" });
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Key ${falKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: `fal.ai error: ${errText}` });
    }

    const data = await response.json();

    // Extract video URL
    const videoUrl = data.video?.url || data.url || null;

    if (!videoUrl) {
      return res.status(500).json({ error: "No video URL in response", raw: data });
    }

    return res.status(200).json({
      url: videoUrl,
      engine,
      prompt,
      format: format || "9:16",
      hasAudio: engine === "veo3" && (generateAudio ?? false),
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
