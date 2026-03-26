// Gera peça estática via GPT-5 Image (OpenRouter)
// Envia a referência (Estático.png) como input visual + prompt com dados do briefing
// GPT-5 replica o layout da referência com dados novos

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt, referenceImageUrl } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "prompt required" });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "OPENROUTER_API_KEY not configured" });
  }

  // Montar content com referência visual + prompt de texto
  const content = [];

  if (referenceImageUrl) {
    content.push({
      type: "image_url",
      image_url: { url: referenceImageUrl },
    });
  }

  content.push({
    type: "text",
    text: prompt,
  });

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
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

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: `OpenRouter error: ${errText}` });
    }

    const data = await response.json();
    const choice = data.choices?.[0];

    if (!choice) {
      return res.status(500).json({ error: "Sem resposta do GPT-5", raw: data });
    }

    // GPT-5 Image retorna imagens no campo "images" como base64 data URLs
    const images = choice.message?.images;
    if (images && images.length > 0) {
      const imageUrl = images[0].image_url?.url || images[0].url;
      if (imageUrl) {
        return res.status(200).json({ url: imageUrl, status: "completed", engine: "gpt5-image" });
      }
    }

    // Fallback: tentar extrair do content (caso venha como array de parts)
    const msgContent = choice.message?.content;
    if (Array.isArray(msgContent)) {
      for (const part of msgContent) {
        if (part.type === "image_url" && part.image_url?.url) {
          return res.status(200).json({ url: part.image_url.url, status: "completed", engine: "gpt5-image" });
        }
      }
    }

    // Fallback: tentar extrair URL de imagem do texto (markdown)
    if (typeof msgContent === "string") {
      const mdMatch = msgContent.match(/!\[.*?\]\((data:image\/[^)]+|https?:\/\/[^\s)]+)\)/);
      if (mdMatch) {
        return res.status(200).json({ url: mdMatch[1], status: "completed", engine: "gpt5-image" });
      }
      const urlMatch = msgContent.match(/(data:image\/[^\s"']+|https?:\/\/[^\s"']+\.(?:png|jpg|jpeg|webp))/i);
      if (urlMatch) {
        return res.status(200).json({ url: urlMatch[1], status: "completed", engine: "gpt5-image" });
      }
    }

    return res.status(500).json({
      error: "GPT-5 não retornou imagem",
      content: typeof msgContent === "string" ? msgContent.substring(0, 500) : JSON.stringify(msgContent)?.substring(0, 500),
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
