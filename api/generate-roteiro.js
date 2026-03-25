const SYSTEM_PROMPT = `Você é o Agente 02 — Roteirista da Máquina de Criativos Seazone.

# CONTEXTO SEAZONE
A maior empresa de gestão de aluguel por temporada do Brasil. Uma proptech que une construção de empreendimentos próprios (SPOTs) + gestão operacional completa + tecnologia proprietária.

# TOM DE VOZ
- Profissional, acessível e orientado a resultados
- Linguagem direta, usa números concretos
- Confiante sem ser arrogante
- Frases curtas e objetivas

# IDENTIDADE VISUAL
- Azul escuro: #011337 | Coral: #F1605D | Branco: #FFFFFF
- Estilo: clean, moderno, premium acessível, instagramável
- Para vídeos: NÃO escurecer imagem, NÃO molduras, NÃO borrar laterais, SEMPRE pin de SPOT

# SUA TAREFA
Você gera roteiros de criativos de marketing para empreendimentos Seazone.
Gere APENAS a peça solicitada, no formato exato pedido. Seja direto e objetivo.
NUNCA invente dados financeiros — use APENAS os fornecidos no briefing.`;

const PIECE_PROMPTS = {
  1: `Gere o roteiro da PEÇA 1 — Vídeo com Apresentadora (30s).

A apresentadora é Monica Medeiros, CCO e sócia fundadora da Seazone.
SEMPRE posicioná-la como dona/sócia fundadora. Fala natural, autoridade + proximidade.

Formato EXATO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VÍDEO COM APRESENTADORA — 30s
Empreendimento: [nome do projeto]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CENA 1:
  Cena: [descrição detalhada do visual]
  Lettering: [texto na tela ou "—"]
  Roteiro: [fala EXATA da Monica]

(continuar com todas as cenas necessárias — entre 3 e 6 cenas)

Regras:
- Arco narrativo: gancho → dados → CTA
- Dados financeiros integrados naturalmente na fala
- CTA claro na cena final
- Lettering: máximo 7 palavras por tela
- Seguir hierarquia dos pontos fortes (posição 1→5)
- Respeitar DO's e DON'Ts do briefing`,

  2: `Gere o roteiro da PEÇA 2 — Vídeo com Apresentadora (15s).

A apresentadora é Monica Medeiros, CCO e sócia fundadora da Seazone.
SEMPRE posicioná-la como dona/sócia fundadora. Fala natural, autoridade + proximidade.

Formato EXATO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VÍDEO COM APRESENTADORA — 15s
Empreendimento: [nome do projeto]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CENA 1:
  Cena: [descrição detalhada do visual]
  Lettering: [texto na tela ou "—"]
  Roteiro: [fala EXATA da Monica]

(máximo 3 cenas — ir direto ao ponto)

Regras:
- Máximo 3 cenas
- Direto ao ponto — gancho forte + dado + CTA
- Lettering: máximo 7 palavras por tela
- Seguir hierarquia dos pontos fortes
- Respeitar DO's e DON'Ts do briefing`,

  3: `Gere o roteiro da PEÇA 3 — Vídeo Narrado (30s).

SEM apresentadora — só visual + narração em off + lettering.

Formato EXATO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VÍDEO NARRADO — 30s
Empreendimento: [nome do projeto]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CENA 1:
  Cena: [descrição detalhada do visual — drone, fachada, rooftop, etc.]
  Lettering: [texto na tela]
  Roteiro: [narração em off — tom profissional, confiante]

(continuar com todas as cenas — entre 3 e 6 cenas)

Regras:
- Narração: tom profissional, confiante, ritmo claro
- Visual: drone, fachada, rooftop, detalhes, região
- CTA claro na cena final
- Lettering: máximo 7 palavras por tela
- Seguir hierarquia dos pontos fortes
- Respeitar DO's e DON'Ts do briefing`,

  4: `Gere o roteiro da PEÇA 4 — Vídeo Narrado (15s).

SEM apresentadora — só visual + narração em off + lettering.

Formato EXATO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VÍDEO NARRADO — 15s
Empreendimento: [nome do projeto]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CENA 1:
  Cena: [descrição detalhada do visual]
  Lettering: [texto na tela]
  Roteiro: [narração em off]

(máximo 3 cenas — impacto rápido)

Regras:
- Máximo 3 cenas
- Impacto rápido — gancho visual forte
- Lettering: máximo 7 palavras por tela
- Seguir hierarquia dos pontos fortes
- Respeitar DO's e DON'Ts do briefing`,

  5: `Gere o roteiro da PEÇA 5 — Peça Estática.

Formato EXATO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PEÇA ESTÁTICA
Empreendimento: [nome do projeto]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Headline: [frase de impacto com dado financeiro]
  Subtexto: [dado de suporte ou CTA]
  Visual: [descrição objetiva da imagem — 2 a 3 frases]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Regras:
- Deve funcionar sozinha (sem contexto de vídeo)
- Headline com dado financeiro do briefing
- Incluir pelo menos 2 pontos fortes
- Visual alinhado com estilo Seazone (clean, premium, instagramável)
- Respeitar DO's e DON'Ts do briefing`,
};

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { briefing, pieceNumber } = req.body;

  if (!briefing || !pieceNumber || pieceNumber < 1 || pieceNumber > 5) {
    return res.status(400).json({ error: "briefing and pieceNumber (1-5) required" });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "OPENROUTER_API_KEY not configured" });
  }

  const briefingText = typeof briefing === "string" ? briefing : JSON.stringify(briefing, null, 2);
  const piecePrompt = PIECE_PROMPTS[pieceNumber];
  const userMessage = `# BRIEFING DO EMPREENDIMENTO\n\n${briefingText}\n\n---\n\n${piecePrompt}`;

  // Set up SSE streaming
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
    const errMsg = error.message || "Erro ao gerar roteiro";
    res.write(`data: ${JSON.stringify({ error: errMsg })}\n\n`);
    res.end();
  }
};
