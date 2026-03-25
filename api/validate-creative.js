// AGENTE 06 — VALIDADOR DO CRIATIVO
// Valida se os criativos gerados atendem ao briefing

const SYSTEM_PROMPT = `Você é o Agente 06 — Validador do Criativo da Máquina de Criativos Seazone.
Você é EXTREMAMENTE RIGOROSO. Só aprova se TUDO estiver perfeito.

# CHECKLIST OBRIGATÓRIO — REPROVAR se qualquer item falhar:

1. COMPLETUDE: todas as 5 peças devem ter imagens geradas (Flux Pro + Recraft)
2. VÍDEOS: peças 3 e 4 (narradas) DEVEM ter vídeos gerados (Kling + Luma). Se não tem → REPROVAR
3. DON'Ts: verificar se os prompts NÃO mencionam itens proibidos (vista mar nas unidades, pé na areia, ticket baixo, distância exata)
4. HIERARQUIA: ROI e localização devem ter mais destaque que outros pontos
5. DADOS: ROI deve ser 16,40% (não 16%). Rendimento deve ser R$ 5.500/mês. Valorização 81%. EXATOS.
6. VISUAL: prompts devem incluir estilo Seazone (clean, premium, golden hour, sem escurecer)
7. MONICA: peças 1 e 2 devem posicionar Monica como sócia fundadora (não atriz)

# SEJA DURO
- Se faltam vídeos → "REPROVADO: vídeos não foram gerados para peças narradas"
- Se dados estão arredondados → "REPROVADO: dados financeiros imprecisos"
- Se DON'T foi violado → "REPROVADO: DON'T violado"
- Só aprove se TUDO estiver correto

# FORMATO
{
  "approved": true/false,
  "summary": "resumo objetivo",
  "issues": ["problema 1", "problema 2"],
  "pieces": [{"piece": 1, "status": "ok/fail", "notes": "..."}],
  "recommendation": "o que precisa ser corrigido (se reprovado)"
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
      result = { approved: false, summary: "Validação inconclusiva. Revisão manual necessária.", issues: ["Resposta do validador não foi JSON válido"] };
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
