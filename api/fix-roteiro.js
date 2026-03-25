const SYSTEM_PROMPT = `Você é o Agente 02 — Roteirista da Máquina de Criativos Seazone.

Você recebeu um roteiro de volta com erros apontados pelo validador.
Sua tarefa é CORRIGIR o roteiro, mantendo a estrutura e ajustando APENAS os pontos indicados.

Regras:
- Corrija TODOS os erros listados
- Mantenha o formato exato (Cena/Lettering/Roteiro)
- NÃO invente dados financeiros — use APENAS os do briefing
- Respeite DO's e DON'Ts do briefing
- Retorne o roteiro COMPLETO corrigido (não só as partes alteradas)
- Seja direto — retorne apenas o roteiro, sem explicações`;

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { briefing, roteiro, errors, pieceNumber } = req.body;

  if (!briefing || !roteiro || !errors || !pieceNumber) {
    return res.status(400).json({ error: "briefing, roteiro, errors and pieceNumber required" });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "OPENROUTER_API_KEY not configured" });
  }

  const briefingText = typeof briefing === "string" ? briefing : JSON.stringify(briefing, null, 2);
  const errorsText = Array.isArray(errors) ? errors.map((e, i) => `${i + 1}. ${e}`).join("\n") : errors;

  const userMessage = `# BRIEFING\n\n${briefingText}\n\n---\n\n# ROTEIRO ORIGINAL (PEÇA ${pieceNumber})\n\n${roteiro}\n\n---\n\n# ERROS ENCONTRADOS PELO VALIDADOR\n\n${errorsText}\n\n---\n\nCorrija TODOS os erros acima e retorne o roteiro completo corrigido.`;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");

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
        max_tokens: 2000,
        stream: true,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      res.write(`data: ${JSON.stringify({ error: `${response.status} ${errText}` })}\n\n`);
      res.end();
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const dataStr = line.slice(6).trim();
          if (dataStr === "[DONE]") {
            res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
            continue;
          }
          try {
            const parsed = JSON.parse(dataStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              res.write(`data: ${JSON.stringify({ text: content })}\n\n`);
            }
          } catch {}
        }
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (error) {
    res.write(`data: ${JSON.stringify({ error: error.message || "Erro ao corrigir roteiro" })}\n\n`);
    res.end();
  }
};
