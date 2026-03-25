// AGENTE 06 — VALIDADOR DO CRIATIVO
// Valida se os criativos gerados atendem ao briefing

const SYSTEM_PROMPT = `Você é o Agente 06 — Validador do Criativo da Máquina de Criativos Seazone.

Você recebe informações sobre os criativos gerados (prompts usados, peças, formatos) e valida contra o briefing.

# CHECKLIST
- Todas as 5 peças foram geradas
- Formatos corretos (9:16 para vídeos, múltiplos para estática)
- Prompts alinhados com identidade visual Seazone
- Dados financeiros do briefing refletidos nos roteiros
- DO's respeitados, DON'Ts não violados
- Imagens geradas em múltiplas IAs (Flux Pro + Recraft)
- Vídeos gerados em múltiplas IAs (Kling + Minimax + Luma) — para peças narradas

# FORMATO DE RESPOSTA
Responda em JSON:
{
  "approved": true/false,
  "summary": "resumo da validação",
  "pieces": [
    {"piece": 1, "status": "ok", "notes": "..."},
    ...
  ],
  "recommendation": "recomendação final"
}

RESPONDA APENAS O JSON.`;

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { briefing, creatives } = req.body;
  if (!briefing || !creatives) {
    return res.status(400).json({ error: "briefing and creatives required" });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "OPENROUTER_API_KEY not configured" });
  }

  const briefingText = typeof briefing === "string" ? briefing : JSON.stringify(briefing, null, 2);
  const creativesText = typeof creatives === "string" ? creatives : JSON.stringify(creatives, null, 2);

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
        max_tokens: 1500,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `# BRIEFING\n\n${briefingText}\n\n# CRIATIVOS GERADOS\n\n${creativesText}\n\nValide os criativos.` },
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
      result = { approved: true, summary: text };
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
