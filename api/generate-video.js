// AGENTE 05 — EXECUTOR CRIATIVO (vídeos)
// Chama fal.ai para gerar um vídeo por vez a partir de uma imagem
// Engines: "kling" (cenas do empreendimento), "kling3" (Monica apresentadora — Kling 3.0 Pro)
// Usa fal.ai queue API (assíncrona) para evitar timeout na Vercel

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt, engine, imageUrl, format, duration } = req.body;

  if (!prompt || !engine) {
    return res.status(400).json({ error: "prompt and engine required" });
  }

  const falKey = process.env.FAL_KEY;
  if (!falKey) {
    return res.status(500).json({ error: "FAL_KEY not configured" });
  }

  let falModel, body;

  if (engine === "kling") {
    if (!imageUrl) {
      return res.status(400).json({ error: "imageUrl required for kling" });
    }
    falModel = "fal-ai/kling-video/v2.1/master/image-to-video";
    body = {
      prompt,
      image_url: imageUrl,
      duration: duration || "5",
      aspect_ratio: "9:16",
    };
  } else if (engine === "kling3") {
    if (!imageUrl) {
      return res.status(400).json({ error: "imageUrl required for kling3" });
    }
    falModel = "fal-ai/kling-video/v3/pro/image-to-video";
    body = {
      prompt,
      image_url: imageUrl,
      duration: duration || "10",
      aspect_ratio: "9:16",
    };
  } else {
    return res.status(400).json({ error: "engine must be 'kling' or 'kling3'" });
  }

  // SEM RETRY — fal.ai cobra por chamada, mesmo em erro.
  try {
    // Usar queue API: submete o job e retorna request_id imediatamente
    const submitResponse = await fetch(`https://queue.fal.run/${falModel}`, {
      method: "POST",
      headers: {
        "Authorization": `Key ${falKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!submitResponse.ok) {
      const errText = await submitResponse.text();
      return res.status(submitResponse.status).json({ error: `fal.ai error (${submitResponse.status}): ${errText.substring(0, 200)}` });
    }

    const submitData = await submitResponse.json();
    const requestId = submitData.request_id;

    if (!requestId) {
      return res.status(500).json({ error: "fal.ai nao retornou request_id", raw: JSON.stringify(submitData).substring(0, 300) });
    }

    // Poll até completar (com timeout de 270s para ficar dentro do limite da Vercel)
    const startTime = Date.now();
    const maxWait = 270000; // 270s (margem de 30s antes do timeout de 300s)
    const pollInterval = 5000; // 5s entre checks

    while (Date.now() - startTime < maxWait) {
      await new Promise(r => setTimeout(r, pollInterval));

      const statusResponse = await fetch(`https://queue.fal.run/${falModel}/requests/${requestId}/status`, {
        headers: { "Authorization": `Key ${falKey}` },
      });

      if (!statusResponse.ok) continue;

      const statusData = await statusResponse.json();

      if (statusData.status === "COMPLETED") {
        // Buscar resultado
        const resultResponse = await fetch(`https://queue.fal.run/${falModel}/requests/${requestId}`, {
          headers: { "Authorization": `Key ${falKey}` },
        });

        if (!resultResponse.ok) {
          return res.status(500).json({ error: "Falha ao buscar resultado do fal.ai" });
        }

        const resultData = await resultResponse.json();
        const videoUrl = resultData.video?.url || resultData.url || null;

        if (!videoUrl) {
          return res.status(500).json({ error: "fal.ai nao retornou video URL", raw: JSON.stringify(resultData).substring(0, 300) });
        }

        return res.status(200).json({
          url: videoUrl,
          engine,
          prompt,
          format: format || "9:16",
        });
      }

      if (statusData.status === "FAILED") {
        return res.status(500).json({ error: `fal.ai job failed: ${JSON.stringify(statusData).substring(0, 300)}` });
      }

      // IN_QUEUE ou IN_PROGRESS — continuar polling
    }

    // Timeout — retorna request_id pro frontend tentar depois
    return res.status(202).json({
      status: "processing",
      requestId,
      falModel,
      engine,
      message: "Video ainda processando. Use poll-video para verificar.",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
