const SYSTEM_PROMPT = `Você é o Agente 02 — Roteirista da Máquina de Criativos Seazone.

# CONTEXTO SEAZONE
A maior empresa de gestão de aluguel por temporada do Brasil. Proptech que une construção de empreendimentos próprios (SPOTs) + gestão operacional completa + tecnologia proprietária.

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
Gerar roteiros de criativos de marketing para empreendimentos Seazone.
Gere APENAS a peça solicitada, no formato exato pedido.
NUNCA invente dados financeiros — use APENAS os fornecidos no briefing.

# REGRA ABSOLUTA: SÃO 3 PEÇAS. SÓ 3.
1. Peça Estática (pieceNumber=1)
2. Vídeo Narrado 15s (pieceNumber=2)
3. Vídeo Apresentadora 30s (pieceNumber=3)

# REGRA CRÍTICA: LER E USAR "estrutura_criativos" DO BRIEFING
O briefing contém uma seção chamada "estrutura_criativos". Você DEVE:
- Ler "pontos_fortes_obrigatorios" e incluir TODOS no roteiro
- Ler "instrucoes_visuais_obrigatorias" e seguir TODAS nas cenas
- Ler "formatos" pra entender os formatos esperados
- TODOS os itens de "dos.diretrizes" DEVEM aparecer no roteiro (pelo menos 1 vez cada)
- TODOS os itens de "pontos_fortes.hierarquia" DEVEM aparecer (na ordem de prioridade)
- Nenhum item de "donts.diretrizes" pode aparecer

# CHECKLIST ANTES DE ENTREGAR
Antes de finalizar o roteiro, verificar:
- [ ] Cada ponto forte obrigatório aparece?
- [ ] Cada DO aparece em pelo menos uma cena?
- [ ] Nenhum DON'T aparece?
- [ ] Dados financeiros são EXATOS do briefing (não arredondados)?
- [ ] Lettering tem máximo 7 palavras por tela?
- [ ] CTA claro na cena final?`;

const PIECE_PROMPTS = {
  1: `Gere o roteiro da PEÇA 1 — Peça Estática.

LEIA a seção "estrutura_criativos" do briefing antes de começar.

# CONTEXTO IMPORTANTE
A peça estática será gerada por IA (GPT-5 Image) que vai REPLICAR o layout de uma imagem de referência.
A referência tem EXATAMENTE 10 elementos de texto — 3 fixos e 7 variáveis.
Você deve preencher APENAS os 7 campos variáveis abaixo. NÃO adicione nenhum texto extra.

# ELEMENTOS FIXOS (já estão na referência, NÃO incluir no roteiro):
- Logo "seazone" (topo central)
- Badge "LANÇAMENTO" (meio-esquerda, retângulo coral)
- Disclaimer legal (rodapé, texto pequeno)

# FORMATO EXATO — preencha SOMENTE estes 7 campos:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PEÇA ESTÁTICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CAMPO 1 — Nome do SPOT: [nome do empreendimento em CAIXA ALTA — ex: "NOVO CAMPECHE SPOT II"]
CAMPO 2 — Badge distância: [distância + referência geográfica — ex: "Lançamento a 200 m da Praia do Campeche"]
CAMPO 3 — Pin cidade: [cidade/estado — ex: "Florianópolis/SC"]
CAMPO 4 — Headline: [frase curta para investidores, máx 10 palavras, com destaque em negrito — ex: "Para investidores que buscam **renda passiva** com Airbnb"]
CAMPO 5 — Label dado: [rótulo do dado principal — ex: "Previsão de **renda futura**"]
CAMPO 6 — Dado principal: [número + unidade, dado financeiro mais impactante — ex: "de **19,8%** líquidos ao ano"]
CAMPO 7 — Complemento: [contexto curto do dado — ex: "com aluguel por temporada"]

DOs incluídos: [listar]
Pontos fortes incluídos: [listar]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Regras:
- EXATAMENTE 7 campos. NÃO adicione campos extras, bullets, listas ou dados adicionais
- O CAMPO 6 deve conter o dado financeiro mais impactante do briefing (ROI, rentabilidade ou rendimento)
- Headline (CAMPO 4) deve ser curta e direta — máximo 10 palavras
- Dados financeiros EXATOS do briefing (nunca arredondar)
- TODOS os pontos fortes obrigatórios devem estar contemplados nos 7 campos
- TODOS os DOs devem estar contemplados
- Nenhum DON'T pode aparecer
- A peça deve funcionar sozinha (sem contexto de vídeo)`,

  2: `Gere o roteiro da PEÇA 2 — Vídeo Narrado (15s).

LEIA a seção "estrutura_criativos" do briefing antes de começar.

SEM apresentadora — só visual + narração em off + lettering.
As imagens serão fotos REAIS do Drive (fachada, rooftop, localização) animadas por IA.
A narração será feita com a voz clonada da Monica via ElevenLabs. Idioma: PORTUGUÊS BRASILEIRO.

Formato EXATO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VÍDEO NARRADO — 15s
Empreendimento: [nome do projeto]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CENA 1:
  Visual: [qual imagem do Drive — fachada, rooftop ou localização]
  Movimento: [como animar — slow zoom in, pan right, tilt up, etc.]
  Lettering: [texto na tela — máx 7 palavras]
  Narração: [texto exato em português que a Monica narra em off]

CENA 2:
  Visual: [...]
  Movimento: [...]
  Lettering: [...]
  Narração: [...]

CENA 3 (FINAL):
  Visual: [...]
  Movimento: [...]
  Lettering: [CTA]
  Narração: [narração final com CTA]

DOs incluídos: [listar]
Pontos fortes incluídos: [listar]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Regras:
- MÁXIMO 3 cenas (é 15 segundos!)
- Cada cena especifica qual imagem do Drive usar
- Narração em PORTUGUÊS BRASILEIRO, tom profissional e confiante
- Gancho forte na cena 1, dados na cena 2, CTA na cena 3
- Lettering: máximo 7 palavras por tela
- TODOS os pontos fortes obrigatórios devem aparecer
- TODOS os DOs devem estar contemplados
- Nenhum DON'T pode aparecer
- Dados financeiros EXATOS`,

  3: `Gere o roteiro da PEÇA 3 — Vídeo Apresentadora (30s).

LEIA a seção "estrutura_criativos" do briefing antes de começar.

A apresentadora é Monica Medeiros, CCO e sócia fundadora da Seazone.
SEMPRE posicioná-la como dona/sócia fundadora. Fala natural, autoridade + proximidade.
O vídeo da Monica será gerado por IA, intercalado com cenas do empreendimento
(fotos REAIS do Drive animadas). Idioma: PORTUGUÊS BRASILEIRO.

Formato EXATO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VÍDEO APRESENTADORA — 30s
Empreendimento: [nome do projeto]
Apresentadora: Monica Medeiros — CCO e sócia fundadora da Seazone
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CENA 1 — MONICA:
  Monica fala: "[fala exata em português — como sócia fundadora]"
  Lettering: [texto na tela]

CENA 2 — EMPREENDIMENTO:
  Visual: [qual imagem do Drive — fachada, rooftop ou localização]
  Movimento: [como animar]
  Lettering: [dados/texto na tela]

CENA 3 — MONICA:
  Monica fala: "[fala com dados financeiros integrados naturalmente]"
  Lettering: [...]

CENA 4 — EMPREENDIMENTO:
  Visual: [...]
  Movimento: [...]
  Lettering: [dados]

CENA 5 (FINAL) — MONICA:
  Monica fala: "[CTA final]"
  Lettering: [CTA]

DOs incluídos: [listar]
Pontos fortes incluídos: [listar]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Regras:
- Entre 3 e 5 cenas
- Arco narrativo: gancho → dados → CTA
- Intercalar: cenas da Monica ↔ cenas do empreendimento
- Monica SEMPRE como sócia fundadora (não atriz)
- Fala NATURAL em português brasileiro, como dona do negócio
- Dados financeiros integrados na fala (não parecer leitura)
- CTA claro na cena final
- Lettering: máximo 7 palavras por tela
- TODOS os pontos fortes obrigatórios devem aparecer
- TODOS os DOs devem estar contemplados
- Nenhum DON'T pode aparecer
- Dados financeiros EXATOS`,
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

  // Extrair seções importantes do briefing pra destacar no prompt
  let estruturaInfo = '';
  try {
    const b = typeof briefing === 'string' ? JSON.parse(briefing) : briefing;
    if (b.estrutura_criativos) {
      estruturaInfo += '\n\n# ESTRUTURA DOS CRIATIVOS (SEÇÃO DO BRIEFING — USAR COMO BASE)\n';
      if (b.estrutura_criativos.pontos_fortes_obrigatorios) {
        estruturaInfo += '\nPONTOS FORTES OBRIGATÓRIOS (DEVEM aparecer no roteiro):\n';
        b.estrutura_criativos.pontos_fortes_obrigatorios.forEach((p, i) => {
          estruturaInfo += `  ${i + 1}. ${typeof p === 'string' ? p : JSON.stringify(p)}\n`;
        });
      }
      if (b.estrutura_criativos.instrucoes_visuais_obrigatorias) {
        estruturaInfo += '\nINSTRUÇÕES VISUAIS OBRIGATÓRIAS:\n';
        b.estrutura_criativos.instrucoes_visuais_obrigatorias.forEach((v, i) => {
          estruturaInfo += `  ${i + 1}. ${typeof v === 'string' ? v : JSON.stringify(v)}\n`;
        });
      }
      if (b.estrutura_criativos.formatos) {
        estruturaInfo += '\nFORMATOS:\n';
        b.estrutura_criativos.formatos.forEach((f, i) => {
          estruturaInfo += `  ${i + 1}. ${typeof f === 'string' ? f : JSON.stringify(f)}\n`;
        });
      }
    }
    if (b.dos?.diretrizes) {
      estruturaInfo += '\nDOs (TODOS devem aparecer no roteiro):\n';
      b.dos.diretrizes.forEach((d, i) => {
        const titulo = d.titulo || d;
        const desc = d.descricao || '';
        estruturaInfo += `  ${i + 1}. ${titulo}${desc ? ': ' + desc : ''}\n`;
      });
    }
    if (b.donts?.diretrizes) {
      estruturaInfo += '\nDON\'Ts (NENHUM pode aparecer no roteiro):\n';
      b.donts.diretrizes.forEach((d, i) => {
        const titulo = d.titulo || d;
        estruturaInfo += `  ${i + 1}. ${titulo}\n`;
      });
    }
    if (b.pontos_fortes?.hierarquia) {
      estruturaInfo += '\nHIERARQUIA DE PONTOS FORTES (incluir na ordem):\n';
      b.pontos_fortes.hierarquia.forEach((p, i) => {
        estruturaInfo += `  ${p.posicao || i + 1}. ${p.nome}: ${p.descricao || ''}\n`;
      });
    }
  } catch {}

  const userMessage = `# BRIEFING DO EMPREENDIMENTO\n\n${briefingText}${estruturaInfo}\n\n---\n\n${piecePrompt}`;

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
