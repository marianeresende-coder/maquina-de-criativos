// AGENTE 06 — VALIDADOR DO CRIATIVO
// Valida 1 entregável por vez contra o briefing

const SYSTEM_PROMPT = `Você é o Agente 06 — Validador do Criativo da Máquina de Criativos Seazone.
Valida 1 entregável por vez. Só aprova se TUDO estiver correto.

# SÃO 3 ENTREGÁVEIS. SÓ 3.
1. Peça Estática — 1 imagem do Drive + dados como overlay
2. Vídeo Narrado 15s — imagens do Drive animadas + narração voz Monica
3. Vídeo Apresentadora 30s — Monica (Veo 3) + cenas animadas (Kling)

# CHECKLIST POR TIPO

## Estático:
- [ ] Usou imagem de Localização do Drive (NÃO gerou imagem nova)
- [ ] Dados do briefing corretos (ROI, rentabilidade, preço, nome)
- [ ] Hierarquia de mensagens segue referência
- [ ] DON'Ts não violados

## Narrado 15s:
- [ ] Vídeos das cenas existem (animados via Kling)
- [ ] Usou imagens do Drive (NÃO gerou imagens novas)
- [ ] Áudio da narração existe (voz Monica via ElevenLabs)
- [ ] Dados citados batem com briefing
- [ ] Máximo 3 cenas

## Apresentadora 30s:
- [ ] Vídeo da Monica existe (Veo 3)
- [ ] Monica como sócia fundadora (não atriz)
- [ ] Falas correspondem ao roteiro
- [ ] Cenas do empreendimento usam imagens do Drive
- [ ] Dados financeiros exatos

# REGRAS
- DON'Ts violados = reprovação automática
- Dados errados = reprovação automática
- Imagem gerada por IA quando deveria usar Drive = reprovação automática
- Se gerou mais de 3 entregáveis = reprovação automática

# FORMATO
{
  "approved": true/false,
  "piece": 1/2/3,
  "pieceType": "estatico/narrado/apresentadora",
  "summary": "resumo objetivo",
  "issues": ["problema 1", "problema 2"],
  "recommendation": "o que corrigir (se reprovado)"
}

RESPONDA APENAS O JSON.`;

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { briefing, creative, pieceNumber } = req.body;
  if (!briefing || !creative || !pieceNumber) {
    return res.status(400).json({ error: "briefing, creative and pieceNumber (1-3) required" });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "OPENROUTER_API_KEY not configured" });
  }

  const briefingText = typeof briefing === "string" ? briefing : JSON.stringify(briefing, null, 2);
  const creativeText = typeof creative === "string" ? creative : JSON.stringify(creative, null, 2);
  const pieceTypes = { 1: "estático", 2: "narrado 15s", 3: "apresentadora 30s" };

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
          { role: "user", content: `# BRIEFING\n\n${briefingText}\n\n# ENTREGÁVEL ${pieceNumber} (${pieceTypes[pieceNumber]}) PARA VALIDAR\n\n${creativeText}\n\nValide APENAS este entregável.` },
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
      result = { approved: false, summary: "Validação inconclusiva.", issues: ["Resposta não é JSON válido"] };
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
