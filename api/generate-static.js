// Gera peça estática via FLUX.1 Kontext Pro (fal.ai)
// Recebe: prompt + imageUrl (foto de localização como base)
// FLUX Kontext adiciona o layout de marketing por cima da foto

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt, imageUrl } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "prompt required" });
  }
  if (!imageUrl) {
    return res.status(400).json({ error: "imageUrl required" });
  }

  const falKey = process.env.FAL_KEY;
  if (!falKey) {
    return res.status(500).json({ error: "FAL_KEY not configured" });
  }

  // SEM RETRY — fal.ai cobra por chamada
  try {
    const response = await fetch("https://fal.run/fal-ai/flux-pro/kontext", {
      method: "POST",
      headers: {
        "Authorization": `Key ${falKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        image_url: imageUrl,
        output_format: "png",
        guidance_scale: 4.5,
        num_images: 1,
        safety_tolerance: "5",
        aspect_ratio: "3:4",
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: `fal.ai error (${response.status}): ${errText.substring(0, 300)}` });
    }

    const rawBody = await response.text();
    let data;
    try {
      data = JSON.parse(rawBody);
    } catch {
      return res.status(500).json({ error: `fal.ai retornou texto invalido: ${rawBody.substring(0, 200)}` });
    }

    const imageResult = data.images?.[0]?.url || null;

    if (!imageResult) {
      return res.status(500).json({ error: "FLUX Kontext nao retornou imagem", raw: JSON.stringify(data).substring(0, 300) });
    }

    return res.status(200).json({
      url: imageResult,
      status: "completed",
      engine: "flux-kontext-pro",
      width: data.images[0].width,
      height: data.images[0].height,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
