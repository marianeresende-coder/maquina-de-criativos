// AGENTE 05 — EXECUTOR CRIATIVO (vídeos)
// Submete job no fal.ai queue e retorna requestId imediatamente
// Frontend faz polling via /api/poll-video
// Engines: "kling" (cenas do empreendimento), "kling3" (Monica — Kling 3.0 Pro)

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
    // Submete na queue e retorna imediatamente
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

    // Retorna requestId pro frontend fazer polling
    return res.status(200).json({
      status: "queued",
      requestId,
      falModel,
      engine,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
