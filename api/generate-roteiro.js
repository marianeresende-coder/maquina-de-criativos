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

# CONTEXTO TÉCNICO
- SEM apresentadora — só visual + narração em off + lettering
- São 9 clips animados: 3 fotos de FACHADA + 3 fotos de ROOFTOP + 3 fotos de LOCALIZAÇÃO
- Cada BLOCO de 3 fotos dura 5 segundos (total: 3 blocos × 5s = 15s exatos)
- As fotos são do Drive, animadas por IA (Kling) — movimentos cinematográficos
- Narração: voz clonada da Monica (ElevenLabs), PORTUGUÊS BRASILEIRO

# REGRA CRÍTICA DE TEMPO
A narração TOTAL deve ter no MÁXIMO 35 palavras (em português).
São ~2.5 palavras/segundo × 15 segundos = 37 palavras limite absoluto.
Conte as palavras antes de entregar. Se passar de 35, CORTE.

Formato EXATO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VÍDEO NARRADO — 15s
Empreendimento: [nome do projeto]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BLOCO 1 — FACHADA (0s a 5s):
  Fotos: 3 fotos da fachada do empreendimento (cortes rápidos)
  Lettering: [texto na tela — máx 5 palavras, gancho forte]
  Narração: [~12 palavras em português — gancho + nome do empreendimento]

BLOCO 2 — ROOFTOP (5s a 10s):
  Fotos: 3 fotos do rooftop/área de lazer (cortes rápidos)
  Lettering: [texto na tela — máx 5 palavras, dado financeiro destaque]
  Narração: [~12 palavras em português — dado financeiro principal]

BLOCO 3 — LOCALIZAÇÃO (10s a 15s):
  Fotos: 3 fotos aéreas da localização (cortes rápidos)
  Lettering: [texto na tela — máx 5 palavras, CTA direto]
  Narração: [~11 palavras em português — CTA final]

Contagem total de palavras da narração: [número]

DOs incluídos: [listar]
Pontos fortes incluídos: [listar]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Regras:
- EXATAMENTE 3 blocos. Cada bloco = 5 segundos = 3 fotos com cortes rápidos
- Narração TOTAL: MÁXIMO 35 PALAVRAS. Contar antes de entregar!
- Narração em PORTUGUÊS BRASILEIRO, tom profissional e confiante
- Arco: Gancho (bloco 1) → Dados (bloco 2) → CTA (bloco 3)
- Lettering: máximo 5 palavras por bloco (aparece sobre os 3 clips do bloco)
- TODOS os pontos fortes obrigatórios devem aparecer
- TODOS os DOs devem estar contemplados
- Nenhum DON'T pode aparecer
- Dados financeiros EXATOS (nunca arredondar)`,

  3: `Gere o roteiro da PEÇA 3 — Vídeo Apresentadora (30s).

LEIA a seção "estrutura_criativos" do briefing antes de começar.

A apresentadora é Monica Medeiros, CCO e sócia fundadora da Seazone.
SEMPRE posicioná-la como dona/sócia fundadora. Fala natural, autoridade + proximidade.
O vídeo da Monica será gerado por IA, intercalado com cenas do empreendimento
(fotos REAIS do Drive animadas). Idioma: PORTUGUÊS BRASILEIRO.

# CONTEXTO VISUAL IMPORTANTE
A foto da Monica é usada APENAS como referência de rosto. O vídeo será gerado com ela
em um cenário que combine com o empreendimento. Como o empreendimento é próximo à praia,
a Monica deve aparecer CAMINHANDO NA PRAIA, na areia, falando para a câmera de forma
natural e descontraída. NÃO é pra ficar parada mexendo — é pra parecer que ela está
gravando um conteúdo na praia perto do empreendimento.

# REGRA CRÍTICA DE TEMPO
A narração TOTAL (soma de TODAS as falas da Monica) deve ter no MÁXIMO 70 palavras.
São ~2.3 palavras/segundo × 30 segundos = 69 palavras limite absoluto.
Conte as palavras de TODAS as falas antes de entregar. Se passar de 70, CORTE.

# ESTRUTURA FIXA — 5 CENAS (2 Monica + 3 Empreendimento)
São EXATAMENTE 5 cenas. 2 da Monica (geradas via Kling 3.0 Pro) intercaladas com 3 do
empreendimento (animadas via Kling). Isso economiza custo de IA.

Formato EXATO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VÍDEO APRESENTADORA — 30s
Empreendimento: [nome do projeto]
Apresentadora: Monica Medeiros — CCO e sócia fundadora da Seazone
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CENA 1 — MONICA INTRO (0s a 8s):
  Cenário: Monica caminhando na praia/areia, falando para câmera
  Monica fala: "[~20 palavras — gancho + se apresenta como sócia fundadora + nome do empreendimento]"
  Lettering: [texto na tela — máx 7 palavras]

CENA 2 — FACHADA (8s a 13s):
  Visual: fachada do empreendimento
  Movimento: [tilt up cinematográfico, golden hour]
  Lettering: [dado destaque — máx 7 palavras]

CENA 3 — ROOFTOP (13s a 18s):
  Visual: rooftop/área de lazer
  Movimento: [pan cinematográfico, vista para o mar]
  Lettering: [dado financeiro — máx 7 palavras]

CENA 4 — LOCALIZAÇÃO (18s a 23s):
  Visual: vista aérea da localização
  Movimento: [drone push forward, praia e mar]
  Lettering: [localização/proximidade — máx 7 palavras]

CENA 5 — MONICA CTA (23s a 30s):
  Cenário: Monica na praia, sorrindo, tom entusiasmado
  Monica fala: "[~15 palavras — dados financeiros + CTA final]"
  Lettering: [CTA — máx 7 palavras]

Contagem total de palavras das falas: [número — MÁXIMO 70]

DOs incluídos: [listar]
Pontos fortes incluídos: [listar]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Regras:
- EXATAMENTE 5 cenas nesta ordem: Monica → Fachada → Rooftop → Localização → Monica
- Falas da Monica TOTAL: MÁXIMO 70 PALAVRAS. Contar antes de entregar!
- Arco narrativo: gancho (cena 1) → dados visuais (cenas 2-4) → CTA (cena 5)
- Monica SEMPRE como sócia fundadora (não atriz)
- Monica na PRAIA/AREIA — cenário natural, descontraído, perto do empreendimento
- Fala NATURAL em português brasileiro, como dona do negócio
- Dados financeiros integrados na fala (não parecer leitura)
- CTA claro na cena final
- Lettering: máximo 7 palavras por tela
- TODOS os pontos fortes obrigatórios devem aparecer
- TODOS os DOs devem estar contemplados
- Nenhum DON'T pode aparecer
- Dados financeiros EXATOS
- A narração cobre os 30s inteiros (falas da Monica passam por cima das cenas do empreendimento também)`,
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
