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

  // Montar content com imagens + prompt
  // IMPORTANTE: passa URLs diretas pro OpenRouter (sem base64)
  // Isso reduz o request de ~10MB pra ~200 bytes e evita timeouts
  const content = [];

  // 1. Foto de localização (fundo da peça)
  if (backgroundImageUrl) {
    content.push({
      type: "image_url",
      image_url: { url: backgroundImageUrl },
    });
  }

  // 2. Referência de layout (Estático.png)
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

  const MAX_RETRIES = 2;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 280000);

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
        // Retry em erros 5xx (transientes)
        if (response.status >= 500 && attempt < MAX_RETRIES - 1) {
          await new Promise(r => setTimeout(r, 3000));
          continue;
        }
        return res.status(response.status).json({ error: `OpenRouter error: ${errText}` });
      }

      // Ler body como texto primeiro (evita crash se não for JSON)
      const rawBody = await response.text();
      let data;
      try {
        data = JSON.parse(rawBody);
      } catch {
        // OpenRouter retornou texto em vez de JSON — retry
        if (attempt < MAX_RETRIES - 1) {
          await new Promise(r => setTimeout(r, 3000));
          continue;
        }
        return res.status(500).json({ error: `OpenRouter retornou texto invalido: ${rawBody.substring(0, 200)}` });
      }

      const choice = data.choices?.[0];

      if (!choice) {
        if (attempt < MAX_RETRIES - 1) {
          await new Promise(r => setTimeout(r, 3000));
          continue;
        }
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
          // Formato alternativo: inline_data
          if (part.type === "image" && part.url) {
            return res.status(200).json({ url: part.url, status: "completed", engine: "gpt5-image" });
          }
        }
      }

      // 3. Content como string (markdown ou URL inline)
      if (typeof msgContent === "string") {
        const mdMatch = msgContent.match(/!\[.*?\]\((data:image\/[^)]+|https?:\/\/[^\s)]+)\)/);
        if (mdMatch) return res.status(200).json({ url: mdMatch[1], status: "completed", engine: "gpt5-image" });
        const urlMatch = msgContent.match(/(data:image\/[^\s"']+|https?:\/\/[^\s"']+\.(?:png|jpg|jpeg|webp))/i);
        if (urlMatch) return res.status(200).json({ url: urlMatch[1], status: "completed", engine: "gpt5-image" });
      }

      // 4. Campo output_images (formato alternativo OpenRouter)
      if (data.output_images && data.output_images.length > 0) {
        return res.status(200).json({ url: data.output_images[0], status: "completed", engine: "gpt5-image" });
      }

      // Não encontrou imagem — retry ou retorna debug
      if (attempt < MAX_RETRIES - 1) {
        await new Promise(r => setTimeout(r, 3000));
        continue;
      }

      return res.status(500).json({
        error: "GPT-5 nao retornou imagem",
        debug: {
          contentType: typeof msgContent,
          contentIsArray: Array.isArray(msgContent),
          preview: typeof msgContent === "string" ? msgContent.substring(0, 500) : JSON.stringify(msgContent)?.substring(0, 500),
          keys: Object.keys(data),
          choiceKeys: choice ? Object.keys(choice.message || {}) : [],
        },
      });
    } catch (error) {
      if (error.name === 'AbortError') {
        return res.status(504).json({ error: "Timeout — GPT-5 demorou mais de 100s" });
      }
      if (attempt < MAX_RETRIES - 1) {
        await new Promise(r => setTimeout(r, 3000));
        continue;
      }
      return res.status(500).json({ error: error.message });
    }
  }
};
