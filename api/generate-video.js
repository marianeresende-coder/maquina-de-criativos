// AGENTE 05 — EXECUTOR CRIATIVO (vídeos)
// Chama fal.ai para gerar um vídeo por vez a partir de uma imagem

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt, engine, imageUrl, format } = req.body;
  // engine: "kling", "minimax", or "luma"
  // imageUrl: URL da imagem frame-chave gerada anteriormente

  if (!prompt || !engine || !imageUrl) {
    return res.status(400).json({ error: "prompt, engine and imageUrl required" });
  }

  const falKey = process.env.FAL_KEY;
  if (!falKey) {
    return res.status(500).json({ error: "FAL_KEY not configured" });
  }

  let endpoint, body;

  if (engine === "kling") {
    endpoint = "https://fal.run/fal-ai/kling-video/v2/master";
    body = {
      prompt,
      image_url: imageUrl,
      duration: "5",
      aspect_ratio: format === "4:5" ? "4:5" : "9:16",
    };
  } else if (engine === "minimax") {
    endpoint = "https://fal.run/fal-ai/minimax-video";
    body = {
      prompt,
      image_url: imageUrl,
    };
  } else if (engine === "luma") {
    endpoint = "https://fal.run/fal-ai/luma-dream-machine/ray-2/image-to-video";
    body = {
      prompt,
      image_url: imageUrl,
      aspect_ratio: format === "4:5" ? "3:4" : "9:16",
    };
  } else {
    return res.status(400).json({ error: "engine must be 'kling', 'minimax', or 'luma'" });
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
      format,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
