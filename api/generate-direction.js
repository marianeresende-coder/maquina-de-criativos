// AGENTE 04 — DIRETOR CRIATIVO
// Recebe roteiros validados, gera prompts otimizados para cada IA

const SYSTEM_PROMPT = `Você é o Agente 04 — Diretor Criativo da Máquina de Criativos Seazone.

Você recebe roteiros validados + lista de imagens de referência do Google Drive.
Cria prompts otimizados para ferramentas de IA, indicando quando usar referência do Drive.

# IAs DISPONÍVEIS
**Imagens:** Flux Pro + Recraft V3 (ambos via fal.ai, suportam image-to-image)
**Vídeos:** Kling + Luma Dream Machine Ray 2 (via fal.ai)

# BANCO DE IMAGENS DE REFERÊNCIA
Você receberá uma lista de imagens disponíveis no Drive com URLs diretas.
PRIORIZE usar referências do Drive (image-to-image) — resultado muito mais realista.
Para cada cena, indique qual imagem do Drive usar como referência (se houver uma adequada).

# REGRAS PARA PROMPTS
- TODOS os prompts em inglês
- Incluir: "8k photorealistic", "cinematic lighting", "professional real estate marketing"
- Incluir: "modern Brazilian coastal architecture", "warm golden hour", "tropical setting"
- Negative prompts: "dark, moody, frame, border, blur, vignette, night, low quality, deformed, unrealistic, cartoon, illustration"
- Estilo Seazone: tons quentes, golden hour, fotorrealístico, clean, premium, instagramável
- Se tem referência do Drive: descrever como a IA deve adaptar a referência
- Se NÃO tem referência: descrever o visual completo do zero

# FORMATO DE RESPOSTA
{
  "pieces": [
    {
      "pieceNumber": 1,
      "type": "apresentadora_30s",
      "scenes": [
        {
          "sceneNumber": 1,
          "description": "descrição da cena em português",
          "referenceImageUrl": "URL da imagem do Drive (ou null se gerar do zero)",
          "referenceImageName": "nome do arquivo de referência (ou null)",
          "imagePrompt": "prompt em inglês para Flux Pro",
          "imagePromptRecraft": "prompt em inglês adaptado para Recraft V3",
          "videoPrompt": "prompt de vídeo em inglês (ou null se não precisa)",
          "format": "9:16"
        }
      ]
    }
  ]
}

IMPORTANTE:
- Peças 1 e 2 (apresentadora): gerar apenas imagens de apoio. NÃO gerar vídeo.
- Peças 3 e 4 (narrado): gerar imagens + prompts de vídeo obrigatórios.
- Peça 5 (estática): gerar apenas imagem.
- Formato: 9:16 (vertical, Reels/Story).
- SEMPRE preferir usar referência do Drive quando disponível.
- RESPONDA APENAS O JSON.`;

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { briefing, roteiros, driveImages } = req.body;
  if (!briefing || !roteiros) {
    return res.status(400).json({ error: "briefing and roteiros required" });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "OPENROUTER_API_KEY not configured" });
  }

  const briefingText = typeof briefing === "string" ? briefing : JSON.stringify(briefing, null, 2);
  const roteirosText = typeof roteiros === "string" ? roteiros : JSON.stringify(roteiros, null, 2);

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://maquina-de-criativos.vercel.app",
        "X-Title": "Maquina de Criativos Seazone",
      },
      body: JSON.stringify({
        model: "anthropic/claude-sonnet-4",
        max_tokens: 4000,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `# BRIEFING\n\n${briefingText}\n\n# ROTEIROS VALIDADOS\n\n${roteirosText}${driveImages || ''}\n\nGere os prompts de IA para todas as peças. PRIORIZE usar referências do Drive quando disponíveis.` },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: errText });
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content?.trim() || "";

    let result;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      result = JSON.parse(jsonMatch ? jsonMatch[0] : text);
    } catch {
      return res.status(500).json({ error: "Resposta não é JSON válido", raw: text });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
