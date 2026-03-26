const SYSTEM_PROMPT = `Você é o Agente 03 — Validador de Roteiro da Máquina de Criativos Seazone.

Sua tarefa é validar UM roteiro contra o briefing original. Seja RIGOROSO.

# CHECKLIST DE VALIDAÇÃO — aplicar TODOS:

[A] PONTOS FORTES OBRIGATÓRIOS
- Ler "estrutura_criativos.pontos_fortes_obrigatorios" do briefing
- Ler "pontos_fortes.hierarquia" do briefing
- CADA ponto forte obrigatório DEVE aparecer no roteiro
- Se algum ponto forte está ausente → REPROVAR e listar qual falta

[B] DOs OBRIGATÓRIOS
- Ler "dos.diretrizes" do briefing
- CADA DO DEVE estar contemplado em pelo menos uma cena
- Se algum DO está ausente → REPROVAR e listar qual falta

[C] DON'Ts — TOLERÂNCIA ZERO
- Ler "donts.diretrizes" do briefing
- Se QUALQUER DON'T aparecer no roteiro → REPROVAR imediatamente

[D] DADOS FINANCEIROS EXATOS
- Cruzar CADA número do roteiro com "dados_financeiros" do briefing
- ROI, rentabilidade, valorização, rendimento mensal DEVEM ser EXATOS
- Se qualquer dado estiver arredondado ou inventado → REPROVAR

[E] INSTRUÇÕES VISUAIS
- Ler "estrutura_criativos.instrucoes_visuais_obrigatorias"
- Verificar se o roteiro respeita todas (sem escurecer, sem moldura, etc.)

[F] FORMATO
- Vídeos: cada cena deve ter Cena/Visual + Lettering + Roteiro/Narração
- Estática: deve ter Headline + Subtexto + Dados + CTA
- Lettering máximo 7 palavras por tela

[G] MONICA (só peça 3 — apresentadora)
- Posicionada como sócia fundadora da Seazone
- Tom de autoridade (não atriz)
- Falas naturais em português brasileiro

[H] DURAÇÃO E CONTAGEM DE PALAVRAS
- Peça 2 (narrado 15s): EXATAMENTE 3 blocos, narração MÁXIMO 35 palavras
- Peça 3 (apresentadora 30s): EXATAMENTE 5 cenas (2 Monica + 3 empreendimento), falas da Monica MÁXIMO 70 palavras total
- Se a contagem de palavras ultrapassar o limite → REPROVAR e indicar quantas palavras há

# FORMATO DE RESPOSTA — JSON válido:

Se APROVADA:
{"approved": true, "checks": {"A": "ok — X/X pontos fortes", "B": "ok — X/X DOs", "C": "ok", "D": "ok", "E": "ok", "F": "ok", "G": "ok ou N/A", "H": "ok"}, "summary": "Roteiro aprovado. [comentário breve]"}

Se REPROVADA:
{"approved": false, "checks": {"A": "FALHA: falta ponto forte X", "B": "ok", ...}, "errors": ["erro 1", "erro 2"], "fixes": ["incluir ponto forte X na cena Y", "corrigir ROI de 16% pra 16,40%"], "summary": "Roteiro reprovado. [motivos]"}

RESPONDA APENAS O JSON.`;

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { briefing, roteiro, pieceNumber } = req.body;

  if (!briefing || !roteiro || !pieceNumber) {
    return res.status(400).json({ error: "briefing, roteiro and pieceNumber required" });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "OPENROUTER_API_KEY not configured" });
  }

  const briefingText = typeof briefing === "string" ? briefing : JSON.stringify(briefing, null, 2);

  // Extrair DOs e Pontos Fortes pra destacar no prompt
  let checklistInfo = '';
  try {
    const b = typeof briefing === 'string' ? JSON.parse(briefing) : briefing;
    if (b.dos?.diretrizes) {
      checklistInfo += '\n\nDOs DO BRIEFING (TODOS devem estar no roteiro):\n';
      b.dos.diretrizes.forEach((d, i) => {
        checklistInfo += `  ${i + 1}. ${d.titulo || d}${d.descricao ? ': ' + d.descricao : ''}\n`;
      });
    }
    if (b.donts?.diretrizes) {
      checklistInfo += '\nDON\'Ts DO BRIEFING (NENHUM pode estar no roteiro):\n';
      b.donts.diretrizes.forEach((d, i) => {
        checklistInfo += `  ${i + 1}. ${d.titulo || d}\n`;
      });
    }
    if (b.pontos_fortes?.hierarquia) {
      checklistInfo += '\nPONTOS FORTES (TODOS devem aparecer):\n';
      b.pontos_fortes.hierarquia.forEach((p, i) => {
        checklistInfo += `  ${p.posicao || i + 1}. ${p.nome}: ${p.descricao || ''}\n`;
      });
    }
    if (b.estrutura_criativos?.pontos_fortes_obrigatorios) {
      checklistInfo += '\nPONTOS FORTES OBRIGATÓRIOS:\n';
      b.estrutura_criativos.pontos_fortes_obrigatorios.forEach((p, i) => {
        checklistInfo += `  ${i + 1}. ${typeof p === 'string' ? p : JSON.stringify(p)}\n`;
      });
    }
    if (b.dados_financeiros) {
      checklistInfo += '\nDADOS FINANCEIROS (verificar se EXATOS no roteiro):\n';
      checklistInfo += JSON.stringify(b.dados_financeiros, null, 2) + '\n';
    }
  } catch {}

  const pieceTypes = { 1: 'estático', 2: 'narrado 15s', 3: 'apresentadora 30s' };
  const userMessage = `# BRIEFING\n\n${briefingText}${checklistInfo}\n\n---\n\n# ROTEIRO DA PEÇA ${pieceNumber} (${pieceTypes[pieceNumber]}) PARA VALIDAR\n\n${roteiro}\n\nValide este roteiro cruzando com TODOS os DOs, DON'Ts, pontos fortes e dados financeiros do briefing.`;

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
          { role: "user", content: userMessage },
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
      result = { approved: false, summary: "Validação inconclusiva. Revisão necessária.", checks: {} };
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message || "Erro ao validar roteiro" });
  }
};
