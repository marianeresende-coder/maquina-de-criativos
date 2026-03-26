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
NUNCA invente dados financeiros — use APENAS os fornecidos no briefing.

# REGRA ABSOLUTA: SÃO 3 PEÇAS. SÓ 3.
1. Peça Estática (pieceNumber=1)
2. Vídeo Narrado 15s (pieceNumber=2)
3. Vídeo Apresentadora 30s (pieceNumber=3)
NÃO existe peça 4 ou 5. NÃO criar versões alternativas.`;

const PIECE_PROMPTS = {
  1: `Gere o roteiro da PEÇA 1 — Peça Estática.

A imagem de fundo será uma foto REAL de localização do Google Drive (NÃO gerar imagem por IA).
Os dados do briefing serão sobrepostos como texto/lettering.
Siga EXATAMENTE a hierarquia de mensagens da peça estática de referência.

Formato EXATO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PEÇA ESTÁTICA
Empreendimento: [nome do projeto]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Imagem de fundo: Localização (foto real do Google Drive — NÃO gerar por IA)
  Headline: [frase de impacto com dado financeiro]
  Subtexto: [dado de suporte ou contexto]
  CTA: [chamada para ação]
  Dados para overlay: [listar dados exatos do briefing: ROI, rentabilidade, preço, nome]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Regras:
- Deve funcionar sozinha (sem contexto de vídeo)
- Headline com dado financeiro do briefing
- Incluir pelo menos 2 pontos fortes
- Imagem de fundo = foto de localização do Drive
- Respeitar DO's e DON'Ts do briefing`,

  2: `Gere o roteiro da PEÇA 2 — Vídeo Narrado (15s).

SEM apresentadora — só visual + narração em off + lettering.
As imagens serão fotos REAIS do Drive (fachada, rooftop, localização) animadas por IA.
A narração será feita com a voz clonada da Monica via ElevenLabs.

Formato EXATO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VÍDEO NARRADO — 15s
Empreendimento: [nome do projeto]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CENA 1:
  Visual: [qual imagem do Drive usar — fachada, rooftop ou localização]
  Movimento: [como animar — slow zoom in, pan right, tilt up, etc.]
  Lettering: [texto na tela]
  Narração: [texto exato da narração em off — tom profissional, confiante]

CENA 2:
  Visual: [...]
  Movimento: [...]
  Lettering: [...]
  Narração: [...]

CENA FINAL:
  Visual: [...]
  Movimento: [...]
  Lettering: [CTA]
  Narração: [narração final com CTA]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Regras:
- Máximo 3 cenas (é 15 segundos!)
- Cada cena DEVE especificar qual imagem do Drive usar (fachada, rooftop ou localização)
- Narração: tom profissional, confiante, ritmo claro
- Impacto rápido — gancho visual forte + dado + CTA
- Lettering: máximo 7 palavras por tela
- Seguir hierarquia dos pontos fortes
- Respeitar DO's e DON'Ts do briefing`,

  3: `Gere o roteiro da PEÇA 3 — Vídeo Apresentadora (30s).

A apresentadora é Monica Medeiros, CCO e sócia fundadora da Seazone.
SEMPRE posicioná-la como dona/sócia fundadora. Fala natural, autoridade + proximidade.
O vídeo da Monica será gerado por IA (Veo 3), intercalado com cenas do empreendimento
(fotos REAIS do Drive animadas por Kling).

Formato EXATO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VÍDEO APRESENTADORA — 30s
Empreendimento: [nome do projeto]
Apresentadora: Monica Medeiros — CCO e sócia fundadora da Seazone
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CENA 1 — MONICA:
  Monica fala: "[fala exata da Monica]"
  Lettering: [texto na tela]

CENA 2 — EMPREENDIMENTO:
  Visual: [qual imagem do Drive usar — fachada, rooftop ou localização]
  Movimento: [como animar]
  Lettering: [dados/texto na tela]

CENA 3 — MONICA:
  Monica fala: "[fala exata]"
  Lettering: [...]

...

CENA FINAL:
  Monica fala: "[CTA final]"
  Lettering: [CTA]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Regras:
- Entre 3 e 5 cenas
- Arco narrativo: gancho → dados → CTA
- Intercalar: cenas da Monica falando ↔ cenas com imagens do empreendimento
- Cenas do empreendimento: especificar qual imagem do Drive usar
- Dados financeiros integrados naturalmente na fala
- CTA claro na cena final
- Lettering: máximo 7 palavras por tela
- Seguir hierarquia dos pontos fortes
- Respeitar DO's e DON'Ts do briefing`,
};

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { briefing, pieceNumber } = req.body;

  if (!briefing || !pieceNumber || pieceNumber < 1 || pieceNumber > 3) {
    return res.status(400).json({ error: "briefing and pieceNumber (1-3) required. 1=estático, 2=narrado 15s, 3=apresentadora 30s" });
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
