// AGENTE 05 — EXECUTOR CRIATIVO (imagens)
// Chama fal.ai para gerar uma imagem por vez
// Suporta text-to-image e image-to-image (com referência do Drive)

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

  const { prompt, engine, format, referenceImageUrl, referenceStrength, negativePrompt } = req.body;

  if (!prompt || !engine) {
    return res.status(400).json({ error: "prompt and engine required" });
  }

  const falKey = process.env.FAL_KEY;
  if (!falKey) {
    return res.status(500).json({ error: "FAL_KEY not configured" });
  }

  // Flux Pro uses specific dimension objects for best results
  const fluxSizes = {
    "9:16": { width: 768, height: 1344 },
    "4:5": { width: 864, height: 1080 },
    "1:1": { width: 1024, height: 1024 },
  };
  const recraftSizes = { "9:16": "portrait_16_9", "4:5": "portrait_4_3", "1:1": "square_hd" };

  const defaultNegative = "dark, moody, frame, border, blur, vignette, night, low quality, deformed, ugly, distorted, cartoon, illustration, painting, unrealistic, oversaturated, text, watermark";
  const fullNegative = negativePrompt ? `${defaultNegative}, ${negativePrompt}` : defaultNegative;

  let endpoint, body;
  const useReference = !!referenceImageUrl;

  if (engine === "flux") {
    endpoint = "https://fal.run/fal-ai/flux-pro/v1.1";
    body = {
      prompt: `${prompt}. --no ${fullNegative}`,
      image_size: fluxSizes[format] || fluxSizes["9:16"],
      num_images: 1,
      safety_tolerance: "5",
      guidance_scale: 7.5,
      num_inference_steps: 28,
    };
    if (useReference) {
      body.image_url = referenceImageUrl;
      body.strength = referenceStrength || 0.45;
    }
  } else if (engine === "recraft") {
    endpoint = useReference
      ? "https://fal.run/fal-ai/recraft/v3/image-to-image"
      : "https://fal.run/fal-ai/recraft/v3/text-to-image";
    body = {
      prompt,
      image_size: recraftSizes[format] || "portrait_16_9",
      style: "realistic_image",
      // NO colors array — brand colors distort photorealistic renders
    };
    if (useReference) {
      body.image_url = referenceImageUrl;
    }
  } else {
    return res.status(400).json({ error: "engine must be 'flux' or 'recraft'" });
  }

  try {
    const response = await fetchWithRetry(endpoint, {
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
    const imageUrl = data.images?.[0]?.url || data.image?.url || null;

    if (!imageUrl) {
      return res.status(500).json({ error: "No image URL in response", raw: data });
    }

    return res.status(200).json({
      url: imageUrl,
      engine,
      prompt,
      format,
      usedReference: useReference,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
