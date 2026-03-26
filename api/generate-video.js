// AGENTE 05 — EXECUTOR CRIATIVO (vídeos)
// Chama fal.ai para gerar um vídeo por vez a partir de uma imagem
// Engines: "kling" (cenas do empreendimento), "kling3" (Monica apresentadora — Kling 3.0 Pro)

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt, engine, imageUrl, format, duration } = req.body;
  // engine: "kling" (v2.1 cenas), "kling3" (v3 Pro — Monica, melhor pra pessoas)
  // imageUrl: URL da imagem (do Drive ou gerada)
  // format: "9:16" (padrão)
  // duration: "5" ou "10" (kling/kling3)

  if (!prompt || !engine) {
    return res.status(400).json({ error: "prompt and engine required" });
  }

  const falKey = process.env.FAL_KEY;
  if (!falKey) {
    return res.status(500).json({ error: "FAL_KEY not configured" });
  }

  let endpoint, body;

  if (engine === "kling") {
    // Kling v2.1: para animar imagens do Drive (cenas do empreendimento)
    if (!imageUrl) {
      return res.status(400).json({ error: "imageUrl required for kling" });
    }
    endpoint = "https://fal.run/fal-ai/kling-video/v2.1/master/image-to-video";
    body = {
      prompt,
      image_url: imageUrl,
      duration: duration || "5",
      aspect_ratio: "9:16",
    };
  } else if (engine === "kling3") {
    // Kling 3.0 Pro: para a Monica (melhor qualidade para pessoas reais)
    // ~$0.112/s sem áudio — muito mais barato que Veo3 ($0.20/s)
    if (!imageUrl) {
      return res.status(400).json({ error: "imageUrl required for kling3" });
    }
    endpoint = "https://fal.run/fal-ai/kling-video/v3/pro/image-to-video";
    body = {
      prompt,
      image_url: imageUrl,
      duration: duration || "10",
      aspect_ratio: "9:16",
    };
  } else {
    return res.status(400).json({ error: "engine must be 'kling' or 'kling3'" });
  }

  // SEM RETRY — fal.ai cobra por chamada, mesmo em erro. Nunca retentar automaticamente.
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
      return res.status(response.status).json({ error: `fal.ai error (${response.status}): ${errText.substring(0, 200)}` });
    }

    // Parse seguro (sem retry — é só parse, não custa dinheiro)
    const rawBody = await response.text();
    let data;
    try {
      data = JSON.parse(rawBody);
    } catch {
      return res.status(500).json({ error: `fal.ai retornou texto invalido: ${rawBody.substring(0, 200)}` });
    }

    const videoUrl = data.video?.url || data.url || null;

    if (!videoUrl) {
      return res.status(500).json({ error: "fal.ai nao retornou video URL", raw: JSON.stringify(data).substring(0, 300) });
    }

    return res.status(200).json({
      url: videoUrl,
      engine,
      prompt,
      format: format || "9:16",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
