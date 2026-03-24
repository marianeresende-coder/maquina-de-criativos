# Máquina de Criativos — Seazone

Sistema autônomo de geração de criativos de marketing para empreendimentos Seazone, construído com **Claude Code** como orquestrador central.

## Como funciona

```
Briefing → 6 Agentes Autônomos → 15 Criativos Prontos
```

### Pipeline de agentes

| # | Agente | O que faz |
|---|--------|-----------|
| 01 | Analista de Briefing | Analisa dados e extrai estratégia criativa |
| 02 | Roteirista | Cria 15 roteiros de vídeo (3 estruturas × 5 variações) |
| 03 | Validador de Roteiro | Valida contra DO's/DON'Ts e identidade de marca |
| 04 | Diretor Criativo | Transforma roteiros em direção de arte e storyboards |
| 05 | Executor Criativo | Gera prompts otimizados para Midjourney, DALL-E, Runway, Kling, Sora |
| 06 | Validador do Criativo | Validação final de completude, qualidade e aderência |

## Como usar

1. Abra o projeto no **Claude Code**
2. Edite o briefing em `BRIEFING_*.md`
3. Diga ao Claude: *"Rode a máquina de criativos com este briefing"*
4. Os 6 agentes rodam em sequência automaticamente
5. Copie os prompts e execute nas ferramentas de IA generativa

## Estrutura

```
├── CLAUDE.md                          # Contexto completo da marca Seazone
├── BRIEFING_NOVO_CAMPECHE_SPOT_II.md  # Briefing do empreendimento
├── agents/                            # Definição dos 6 agentes
├── outputs/                           # Outputs gerados pelos agentes
├── index.html                         # Interface web (deploy)
└── README.md
```

## Ferramentas suportadas

- **Imagem**: Midjourney v6, DALL-E 3, Adobe Firefly, Flux
- **Vídeo**: Runway Gen-3, Kling AI, Sora, Pika, Luma Dream Machine

## Hackathon Seazone 2025

Projeto criado para o hackathon "Máquina de Criativos" da Seazone.

**Briefing aplicado**: Novo Campeche SPOT II — Florianópolis/SC

---

Construído com [Claude Code](https://claude.ai/claude-code) por Anthropic
