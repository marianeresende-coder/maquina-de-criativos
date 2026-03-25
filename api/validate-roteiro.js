const Anthropic = require("@anthropic-ai/sdk");

const SYSTEM_PROMPT = `Você é o Agente 03 — Validador de Roteiro da Máquina de Criativos Seazone.

Sua tarefa é validar UM roteiro de peça criativa contra o briefing original.

# CHECKLIST DE VALIDAÇÃO
Aplique TODOS os checks:

[A] PONTOS FORTES OBRIGATÓRIOS — cada ponto forte do briefing deve aparecer
[B] HIERARQUIA — pontos fortes de maior posição devem ter mais destaque
[C] DO's — cada DO deve estar reforçado em pelo menos uma cena
[D] DON'Ts — TOLERÂNCIA ZERO. Qualquer violação = reprovação imediata
[E] INSTRUÇÕES VISUAIS — sem escurecer, sem molduras, sem borrar, pin de SPOT presente
[F] FORMATO — campos corretos (Cena/Lettering/Roteiro para vídeos, Headline/Subtexto/Visual para estática)
[G] DADOS FINANCEIROS — números EXATOS do briefing, sem arredondar, sem inventar
[H] MONICA — (só peças 1 e 2) posicionada como sócia fundadora, tom de autoridade
[I] DURAÇÃO — 15s máx 3 cenas, 30s entre 3-6 cenas

# FORMATO DE RESPOSTA
Responda em JSON válido:

Se aprovada:
{"approved": true, "checks": {"A": "ok", "B": "ok", ...}, "summary": "Peça aprovada. [breve comentário]"}

Se reprovada:
{"approved": false, "checks": {"A": "ok", "B": "ok", "D": "FALHA: [descrição]", ...}, "errors": ["erro 1", "erro 2"], "fixes": ["correção 1", "correção 2"], "summary": "Peça reprovada. [motivos]"}

RESPONDA APENAS O JSON, sem markdown, sem texto antes ou depois.`;

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { briefing, roteiro, pieceNumber } = req.body;

  if (!briefing || !roteiro || !pieceNumber) {
    return res.status(400).json({ error: "briefing, roteiro and pieceNumber required" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY not configured" });
  }

  const briefingText = typeof briefing === "string" ? briefing : JSON.stringify(briefing, null, 2);

  const userMessage = `# BRIEFING\n\n${briefingText}\n\n---\n\n# ROTEIRO DA PEÇA ${pieceNumber} PARA VALIDAR\n\n${roteiro}`;

  try {
    const client = new Anthropic({ apiKey });

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    });

    const text = response.content[0].text.trim();

    // Try to parse JSON response
    let result;
    try {
      // Extract JSON if wrapped in markdown code block
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      result = JSON.parse(jsonMatch ? jsonMatch[0] : text);
    } catch {
      result = { approved: true, summary: text, checks: {} };
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message || "Erro ao validar roteiro" });
  }
};
