// AGENTE 05 — EXECUTOR CRIATIVO (imagens)
// Chama fal.ai para gerar uma imagem por vez

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt, engine, format } = req.body;
  // engine: "flux" or "recraft"
  // format: "9:16", "4:5", "1:1"

  if (!prompt || !engine) {
    return res.status(400).json({ error: "prompt and engine required" });
  }

  const falKey = process.env.FAL_KEY;
  if (!falKey) {
    return res.status(500).json({ error: "FAL_KEY not configured" });
  }

  // Map format to API-specific size params
  const fluxSizes = { "9:16": "portrait_16_9", "4:5": "portrait_4_5", "1:1": "square" };
  const recraftSizes = { "9:16": "portrait_16_9", "4:5": "portrait_4_3", "1:1": "square_hd" };

  let endpoint, body;

  if (engine === "flux") {
    endpoint = "https://fal.run/fal-ai/flux-pro/v1.1";
    body = {
      prompt,
      image_size: fluxSizes[format] || "portrait_16_9",
      num_images: 1,
      safety_tolerance: "5",
    };
  } else if (engine === "recraft") {
    endpoint = "https://fal.run/fal-ai/recraft/v3/text-to-image";
    body = {
      prompt,
      image_size: recraftSizes[format] || "portrait_16_9",
      style: "realistic_image",
      colors: [
        { r: 1, g: 19, b: 55 },
        { r: 241, g: 96, b: 93 },
        { r: 255, g: 255, b: 255 },
      ],
    };
  } else {
    return res.status(400).json({ error: "engine must be 'flux' or 'recraft'" });
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

    // Extract image URL (both Flux and Recraft return images array)
    const imageUrl = data.images?.[0]?.url || data.image?.url || null;

    if (!imageUrl) {
      return res.status(500).json({ error: "No image URL in response", raw: data });
    }

    return res.status(200).json({
      url: imageUrl,
      engine,
      prompt,
      format,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
