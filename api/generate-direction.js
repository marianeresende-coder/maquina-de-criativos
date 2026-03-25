// AGENTE 04 — DIRETOR CRIATIVO
// Recebe roteiros validados, gera prompts otimizados para cada IA

const SYSTEM_PROMPT = `Você é o Agente 04 — Diretor Criativo da Máquina de Criativos Seazone.

Você recebe roteiros validados e cria prompts otimizados para ferramentas de IA gerarem as imagens e vídeos.

# IAs DISPONÍVEIS
**Imagens:** Flux Pro + Recraft V3 (ambos via fal.ai)
**Vídeos:** Kling + Minimax + Luma Dream Machine Ray 2 (todos via fal.ai)

# REGRAS PARA PROMPTS
- TODOS os prompts em inglês (melhor resultado nas IAs)
- Incluir: "8k photorealistic", "cinematic lighting", "professional real estate marketing"
- Negative prompts: "dark, moody, frame, border, blur, vignette, night, low quality, deformed"
- Estilo Seazone: tons quentes, golden hour, fotorrealístico, clean, premium
- Sem escurecer, sem molduras, sem bordas borradas

# FORMATO DE RESPOSTA
Responda em JSON válido com esta estrutura:
{
  "pieces": [
    {
      "pieceNumber": 1,
      "type": "apresentadora_30s",
      "scenes": [
        {
          "sceneNumber": 1,
          "description": "descrição da cena em português",
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
- Peças 1 e 2 (apresentadora): gerar apenas imagens de apoio (fachada, drone, rooftop). NÃO gerar vídeo.
- Peças 3 e 4 (narrado): gerar imagens (frames-chave) E prompts de vídeo.
- Peça 5 (estática): gerar apenas imagem.
- Gere no formato 9:16 (vertical, Reels/Story).
- RESPONDA APENAS O JSON.`;

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { briefing, roteiros } = req.body;
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
          { role: "user", content: `# BRIEFING\n\n${briefingText}\n\n# ROTEIROS VALIDADOS\n\n${roteirosText}\n\nGere os prompts de IA para todas as peças.` },
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
