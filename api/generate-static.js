// Gera peça estática via GPT-5 Image (OpenRouter)
// Recebe: prompt + referenceImageUrl (layout Estático.png) + backgroundImageUrl (foto localização)
// GPT-5 gera a imagem combinando fundo real + layout da referência + dados do briefing

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt, referenceImageUrl, backgroundImageUrl } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "prompt required" });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "OPENROUTER_API_KEY not configured" });
  }

  // Helper: baixar imagem e converter pra base64 data URL
  async function toBase64DataUrl(url) {
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(15000) });
      if (!r.ok) return null;
      const buf = await r.arrayBuffer();
      const contentType = r.headers.get('content-type') || 'image/jpeg';
      return `data:${contentType};base64,${Buffer.from(buf).toString('base64')}`;
    } catch {
      return null;
    }
  }

  // Montar content com imagens + prompt
  const content = [];

  // 1. Foto de localização (fundo da peça)
  if (backgroundImageUrl) {
    const bgData = await toBase64DataUrl(backgroundImageUrl);
    if (bgData) {
      content.push({
        type: "image_url",
        image_url: { url: bgData },
      });
    }
  }

  // 2. Referência de layout (Estático.png)
  if (referenceImageUrl) {
    const refData = await toBase64DataUrl(referenceImageUrl);
    if (refData) {
      content.push({
        type: "image_url",
        image_url: { url: refData },
      });
    }
  }

  content.push({
    type: "text",
    text: prompt,
  });

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 100000);

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: "openai/gpt-5-image",
        modalities: ["image", "text"],
        max_tokens: 4096,
        messages: [
          {
            role: "user",
            content,
          },
        ],
      }),
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: `OpenRouter error: ${errText}` });
    }

    const data = await response.json();
    const choice = data.choices?.[0];

    if (!choice) {
      return res.status(500).json({ error: "Sem resposta do GPT-5", raw: data });
    }

    // Extrair imagem — vários formatos possíveis

    // 1. Campo "images" separado
    const images = choice.message?.images;
    if (images && images.length > 0) {
      const url = images[0].image_url?.url || images[0].url;
      if (url) return res.status(200).json({ url, status: "completed", engine: "gpt5-image" });
    }

    // 2. Content como array de parts
    const msgContent = choice.message?.content;
    if (Array.isArray(msgContent)) {
      for (const part of msgContent) {
        if (part.type === "image_url" && part.image_url?.url) {
          return res.status(200).json({ url: part.image_url.url, status: "completed", engine: "gpt5-image" });
        }
      }
    }

    // 3. Content como string (markdown)
    if (typeof msgContent === "string") {
      const mdMatch = msgContent.match(/!\[.*?\]\((data:image\/[^)]+|https?:\/\/[^\s)]+)\)/);
      if (mdMatch) return res.status(200).json({ url: mdMatch[1], status: "completed", engine: "gpt5-image" });
      const urlMatch = msgContent.match(/(data:image\/[^\s"']+|https?:\/\/[^\s"']+\.(?:png|jpg|jpeg|webp))/i);
      if (urlMatch) return res.status(200).json({ url: urlMatch[1], status: "completed", engine: "gpt5-image" });
    }

    return res.status(500).json({
      error: "GPT-5 nao retornou imagem",
      debug: {
        contentType: typeof msgContent,
        contentIsArray: Array.isArray(msgContent),
        preview: typeof msgContent === "string" ? msgContent.substring(0, 300) : JSON.stringify(msgContent)?.substring(0, 300),
      },
    });
  } catch (error) {
    if (error.name === 'AbortError') {
      return res.status(504).json({ error: "Timeout — GPT-5 demorou mais de 100s" });
    }
    return res.status(500).json({ error: error.message });
  }
};
