# MÁQUINA DE CRIATIVOS — SEAZONE

---
## ⛔ REGRAS INVIOLÁVEIS — LER ANTES DE QUALQUER COISA
---

### REGRA 1: SÃO 3 ENTREGÁVEIS. SÓ 3. NUNCA MAIS.
1. **Peça Estática** — 1 imagem do Drive + dados do briefing como texto
2. **Vídeo Narrado (15s)** — imagens do Drive animadas + narração (voz Monica)
3. **Vídeo Apresentadora (30s)** — Monica gerada por Veo 3 + cenas animadas

### REGRA 2: NÃO GERAR IMAGENS NOVAS
- **NUNCA chamar generate-image.js**
- **NUNCA chamar Flux Pro ou Recraft**
- As imagens REAIS já existem no Google Drive (URLs no agente 05)
- Para vídeos: animar as imagens do Drive DIRETAMENTE via Kling
- Para Monica: usar Veo 3 (text-to-video direto, sem gerar imagem)
- Para estático: usar foto do Drive COMO ESTÁ

### REGRA 3: FLUXO SEQUENCIAL COM APROVAÇÃO
```
Roteiro aprovado → Estático (aprovar) → Narrado (aprovar) → Apresentadora (aprovar) → ✅
```
- 1 peça por vez. Esperar aprovação antes da próxima.
- Se reprovado, refazer SÓ o que foi apontado.

### REGRA 4: MÁXIMO DE CHAMADAS DE API
- Estático: **0 chamadas** (usa foto do Drive direto)
- Narrado: **~4 chamadas** (3 Kling + 1 ElevenLabs)
- Apresentadora: **~2 chamadas** (Veo 3)
- **TOTAL MÁXIMO: ~7 chamadas. Se passar de 12, PARE.**

### REGRA 5: IDIOMA = PORTUGUÊS DO BRASIL. SEMPRE.
- Narração, falas da Monica, textos: TUDO em português brasileiro
- Prompts de vídeo Veo 3 DEVEM incluir "speaking in Brazilian Portuguese"
- NUNCA gerar conteúdo em inglês para o usuário final
- Usar a voz clonada da Monica (ElevenLabs) para toda narração

### REGRA 7: MONICA É A ÚNICA APRESENTADORA
- O vídeo apresentadora usa a imagem/vídeo da Monica Medeiros (CCO Seazone)
- Referência visual da Monica: pasta `15EKv4-VAy6CSfyA8vpKuvu_TUwq27ex4` → "Vídeo apresentadora.mp4"
- URL da referência: `https://drive.google.com/uc?export=download&id=16AYI3NGmdrs4awvvtmO7SDQHLrEbbIHW`
- Veo 3 DEVE gerar uma mulher que se pareça com a Monica (brasileira, ~35 anos, cabelo castanho)
- NUNCA gerar outra pessoa. NUNCA trocar apresentadora.
- Voz: SEMPRE a voz clonada da Monica via ElevenLabs (voice_id: KfRcTEwUDDuaM4dTSJ1V)
- A voz da Monica é usada em TODOS os vídeos (narrado + apresentadora)

### REGRA 8: PEÇA ESTÁTICA = REFERÊNCIA
- A peça estática de referência está em `15EKv4-VAy6CSfyA8vpKuvu_TUwq27ex4` (Estático.png)
- SEGUIR EXATAMENTE a hierarquia de mensagens dessa referência
- 1 imagem de fundo (localização do Drive) + dados do briefing como overlay
- NÃO gerar vídeo para o estático. É UMA IMAGEM.

---

## Sobre este projeto
Sistema de geração de criativos de marketing para empreendimentos Seazone.
Transforma um briefing em 3 peças criativas prontas para produção.

## Agentes
1. **Validador de Briefing** — valida o briefing recebido
2. **Roteirista** — cria 3 roteiros (estático + narrado 15s + apresentadora 30s)
3. **Validador de Roteiro** — valida os 3 roteiros
4. **Diretor Criativo** — gera prompt de 1 peça por vez (sequencial)
5. **Executor Criativo** — executa 1 peça por vez (sequencial, com aprovação)
6. **Validador do Criativo** — apresenta ao usuário para aprovação

## Regras de execução
- Sempre respeitar os DO's e DON'Ts do briefing
- Tom de voz: profissional, acessível, orientado a resultados
- Nunca inventar dados financeiros — usar apenas os fornecidos no briefing
- Priorizar ROI, localização, rendimento mensal e fachada em TODOS os criativos
- Manter aderência total à identidade visual Seazone

---

# CONTEXTO SEAZONE — IDENTIDADE DE MARCA

## Quem é a Seazone
A maior empresa de gestão de aluguel por temporada do Brasil. Uma proptech que une
construção de empreendimentos próprios (SPOTs) + gestão operacional completa + tecnologia
proprietária. Fundada em 2018 em Florianópolis por Fernando Pereira e Gustavo Kremer.

## Números da empresa
- +2.700 imóveis gerenciados
- +2.040 proprietários parceiros
- R$ 1 bilhão+ em ativos sob gestão
- +1 milhão de diárias realizadas
- 44 empreendimentos SPOT lançados
- +250 colaboradores
- +60 destinos atendidos
- Avaliação média 4,8/5 no Airbnb
- Crescimento de 100% ao ano desde 2020
- Reconhecimentos: Forbes Top Startup 2023, LinkedIn Top Startup 2023, Scale Endeavor

## Posicionamento
"Imóveis como Investimento" — A Seazone posiciona a propriedade como ativo financeiro
inteligente, educando o mercado sobre o potencial do short-stay.

## Proposta de valor
"Investimento do aluguel por temporada é simples, seguro e altamente rentável."
Combina: dados proprietários + tecnologia exclusiva + operação profissional.

## Missão
"Transformar a maneira de investir, alugar, hospedar e expandir negócios, para que
você tenha a Seazone ao seu lado."

## Valores centrais
- **Tecnologia e Dados**: decisões baseadas em dados, não em intuição
- **Transparência**: plataforma SAPRON, estrutura SPE com auditorias
- **Inovação**: proptech que une construção + gestão + tecnologia
- **Rentabilidade**: obsessão por maximizar o retorno do investidor
- **Simplicidade**: investimento imobiliário acessível e descomplicado
- **Segurança**: estrutura jurídica robusta, segregação patrimonial
- **Hospitalidade**: experiência do hóspede como motor de resultado

## O que são SPOTs
Empreendimentos imobiliários próprios da Seazone, projetados desde a concepção
exclusivamente para aluguel por temporada (short-stay). Nascem com foco total em
estadas curtas, design instagramável e operação otimizada.

Características: studios compactos (15-70m²), rooftop com piscina, fachada contemporânea,
mobiliados e equipados, gestão Seazone inclusa, estrutura SPE (a preço de custo).

---

# TOM DE VOZ SEAZONE

## Diretrizes gerais
- **Profissional, acessível e orientado a resultados**
- Linguagem direta, usa números concretos para comprovar resultados
- Equilibra o **aspiracional** com o **pragmático**
- Confiante sem ser arrogante — autoridade técnica com proximidade
- Frases curtas e objetivas
- Uso intensivo de números e métricas como prova social
- CTAs diretos e claros

## Palavras-chave da comunicação
"rentabilidade", "segurança", "gestão", "potencial", "investimento", "renda passiva",
"transparência", "tecnologia", "dados", "performance", "valorização"

## O que NUNCA fazer no tom
- Não ser excessivamente informal ou usar gírias
- Não fazer promessas sem dados para sustentar
- Não soar como vendedor agressivo — soar como consultor de confiança
- Não usar superlativos vazios ("o melhor", "incrível", "fantástico")
- Não ignorar dados financeiros em favor apenas de emoção

## Estilo por canal
- **Vídeo ads**: Tom de autoridade. Apresentadora como "dona" do empreendimento.
  Mais credibilidade, menos atriz. Dados financeiros integrados naturalmente.
- **Carrossel/estático**: Dados em destaque, visual clean, CTA direto.
- **Reels/TikTok**: Dinâmico, rápido, gancho forte nos 3 primeiros segundos.

---

# IDENTIDADE VISUAL SEAZONE

## Paleta de cores
- **Azul escuro (primária)**: #011337 — confiança, seriedade, sofisticação
- **Laranja/Coral (secundária)**: #F1605D — energia, urgência, CTAs
- **Branco**: #FFFFFF — fundos, aspecto clean
- **Cinza claro**: #EBEBF5 — fundos alternativos
- **Cinza escuro**: #394760 — textos corpo
- **Verde**: #047755 — indicadores de sucesso
- **Roxo**: #5636D1 — elementos interativos pontuais

## Tipografia
- Títulos: "Asap" ou "Space Grotesk" em bold
- Corpo: "DM Sans" ou "Helvetica"
- Hierarquia clara entre títulos e corpo

## Estilo visual
- **Clean e moderno** com aspecto premium
- Backgrounds com overlays e gradientes semi-transparentes
- Cards com imagens destacadas
- Ícones temáticos (prédio, cama, pin, estrelas)
- Sensação geral: **sofisticação acessível com base em dados**

## Conceito "Instagramável"
O fundador declara: "Procuramos construir empreendimentos instagramáveis."
Tudo é pensado para ser fotografável e compartilhável: piscinas de borda infinita,
rooftops com vista, paisagismo elaborado, iluminação indireta.

## Estilo fotográfico
- Fotografia arquitetônica profissional
- Perspectivas que destacam proporções e iluminação natural
- Relação interior-exterior valorizada
- Ângulos na altura dos olhos, regra dos terços
- Luz natural, tons quentes, sem flash
- Ambientes organizados com elementos decorativos
- Piscinas de borda infinita, terraços, vistas para o mar

## Para vídeos — regras visuais obrigatórias
- NÃO usar efeitos que escureçam a imagem
- NÃO colocar molduras no vídeo
- NÃO borrar as laterais da tela
- SEMPRE colocar pin de SPOT onde é o terreno/prédio
- Mudanças de take leves — sem raios/efeitos escuros
- Apresentadora com tom de autoridade (credibilidade > atuação)

---

# PÚBLICO-ALVO SEAZONE

## Perfil do investidor
- Pessoas que veem imóvel como fonte de renda
- Capacidade de investimento a partir de R$ 190 mil
- Buscam diversificação de portfólio sem burocracia
- Motivação: renda passiva real, previsibilidade, valorização patrimonial
- Valorizam dados, transparência e estrutura jurídica sólida

## Segmentação por prioridade
1. **Core**: Investidores do Sudeste (SP/MG) — racionais, orientados a ROI
2. **Regional**: Investidores do Sul (SC/PR/RS) — boa conversão, menor fricção
3. **Nacional**: Outros estados (RJ, BA, GO, MT, DF, PA, CE, PE) — precisam de prova financeira forte

## Tese central
Capital investidor majoritariamente de fora do Sul, com forte concentração no Sudeste.
Convertem melhor com: tese clara de retorno financeiro + localização desejada + operação profissional.

---

# EMPREENDIMENTOS DE REFERÊNCIA

## Jurere SPOT (Case principal)
- 100m da praia de Jurerê Internacional, Florianópolis
- 21% de retorno líquido em 2024
- Valorização de +138%
- Primeiro SPOT inaugurado (2023) — prova de conceito

## Novo Campeche SPOT I
- 100% vendido em menos de 1 semana
- Rentabilidade projetada: 17% ao ano
- Valorização projetada: +79%

## Vistas de Anita
- 40+ cabanas na Serra Catarinense
- Conceito: natureza + sofisticação
- Referência de conteúdo aspiracional/emocional
