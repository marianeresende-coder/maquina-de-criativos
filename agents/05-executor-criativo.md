# AGENTE 05 — EXECUTOR CRIATIVO

## Papel
Recebe tudo mastigado do Agente 04 e EXECUTA. Chama as APIs de IA,
gera os criativos finais e salva localmente + Google Drive.
É o agente que transforma prompts em arquivos prontos.

---

## Input
- Direção criativa completa do Agente 04 (prompts, formatos, mapeamento de imagens)
- Banco de imagens no Google Drive (pasta do empreendimento)
- API key da fal.ai

---

## O que ele faz

### Passo 1 — Acessar banco de imagens
- Conectar ao Google Drive
- Localizar pasta do empreendimento (nome = `projeto.nome` do briefing)
- Verificar quais subpastas têm imagens disponíveis (fachada, rooftop, regiao, etc.)
- Baixar imagens que o Agente 04 indicou como referência

### Passo 2 — Gerar criativos via fal.ai
Para cada cena de cada peça, seguindo exatamente o que o Agente 04 definiu:

**Peças 1 e 2 — Vídeo com Apresentadora (30s e 15s):**
- NÃO gera vídeo por IA (apresentadora é gravação humana)
- Entrega apenas o **roteiro final formatado** pronto pra Monica gravar
- Gera as **imagens de apoio** que aparecem no vídeo (fachada, drone, rooftop) nos 3 formatos

**Peça 3 — Vídeo Narrado 30s:**
- Gera frame-chave de cada cena via **Flux Pro** (imagem)
- Anima cada frame via **Kling** ou **Minimax** (vídeo)
- Gera nos 3 formatos: Reels (9:16), Feed (4:5), Story (9:16)
- Total: 3 vídeos finais

**Peça 4 — Vídeo Narrado 15s:**
- Mesmo processo da peça 3
- Total: 3 vídeos finais

**Peça 5 — Peça Estática:**
- Gera imagem via **Flux Pro**
- Gera nos 3 formatos: 9:16, 4:5, 1:1
- Total: 3 imagens finais

### Passo 3 — Salvar resultados
Salvar em DOIS lugares:

**Local (pasta do projeto):**
```
outputs/[nome-do-empreendimento]/
├── apresentadora-30s/
│   ├── roteiro-final.md
│   ├── apoio-reels-9x16/
│   │   ├── cena1.png
│   │   ├── cena2.png
│   │   └── ...
│   ├── apoio-feed-4x5/
│   │   └── ...
│   └── apoio-story-9x16/
│       └── ...
├── apresentadora-15s/
│   ├── roteiro-final.md
│   ├── apoio-reels-9x16/
│   ├── apoio-feed-4x5/
│   └── apoio-story-9x16/
├── narrado-30s/
│   ├── reels-9x16.mp4
│   ├── feed-4x5.mp4
│   └── story-9x16.mp4
├── narrado-15s/
│   ├── reels-9x16.mp4
│   ├── feed-4x5.mp4
│   └── story-9x16.mp4
└── estatico/
    ├── reels-story-9x16.png
    ├── feed-4x5.png
    └── feed-1x1.png
```

**Google Drive (pasta do empreendimento):**
```
📁 [Nome do Empreendimento]/
├── 📁 criativos-gerados/          ← nova pasta criada pelo agente
│   ├── 📁 apresentadora-30s/
│   │   ├── roteiro-final.md
│   │   └── 📁 imagens-apoio/
│   ├── 📁 apresentadora-15s/
│   │   ├── roteiro-final.md
│   │   └── 📁 imagens-apoio/
│   ├── 📁 narrado-30s/
│   │   ├── reels-9x16.mp4
│   │   ├── feed-4x5.mp4
│   │   └── story-9x16.mp4
│   ├── 📁 narrado-15s/
│   │   ├── reels-9x16.mp4
│   │   ├── feed-4x5.mp4
│   │   └── story-9x16.mp4
│   └── 📁 estatico/
│       ├── reels-story-9x16.png
│       ├── feed-4x5.png
│       └── feed-1x1.png
├── 📁 fachada/                     ← pastas originais do banco
├── 📁 rooftop/
├── 📁 regiao/
...
```

---

## Formato do roteiro final (apresentadora)

O roteiro da Monica sai formatado, pronto pra ela ler e gravar:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ROTEIRO FINAL — VÍDEO COM APRESENTADORA [duração]
Empreendimento: [nome do projeto]
Apresentadora: Monica Medeiros — CCO e sócia fundadora da Seazone
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FORMATOS DE ENTREGA: Reels (9:16) | Feed (4:5) | Story (9:16)

CENA 1:
  O que aparece: [descrição do visual — o que o editor precisa montar]
  Texto na tela: [lettering exato]
  Monica fala: "[fala exata da Monica]"
  Imagem de apoio: [nome do arquivo gerado — ex: cena1.png]

CENA 2:
  O que aparece: [...]
  Texto na tela: [...]
  Monica fala: "[...]"
  Imagem de apoio: [...]

...

CENA FINAL:
  O que aparece: [...]
  Texto na tela: [CTA]
  Monica fala: "[CTA final]"
  Imagem de apoio: [...]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OBSERVAÇÕES PARA GRAVAÇÃO:
- Tom: autoridade de sócia fundadora, não atriz
- Fala natural, como conversa
- Olhar direto pra câmera
- [instruções visuais obrigatórias do briefing]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Chamadas à API — Referência técnica

### Flux Pro (imagem)
```bash
curl -X POST "https://fal.run/fal-ai/flux-pro/v1.1" \
  -H "Authorization: Key $FAL_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "[prompt do Agente 04]",
    "image_size": "[portrait_16_9 / portrait_4_5 / square]",
    "num_images": 1,
    "safety_tolerance": "5"
  }'
```
Resposta: URL da imagem gerada → baixar e salvar

### Flux Pro image-to-image (quando tem referência do Drive)
```bash
curl -X POST "https://fal.run/fal-ai/flux-pro/v1.1" \
  -H "Authorization: Key $FAL_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "[prompt do Agente 04]",
    "image_url": "[URL da imagem de referência do Drive]",
    "image_size": "[formato]",
    "num_images": 1,
    "strength": 0.75
  }'
```

### Kling (vídeo)
```bash
curl -X POST "https://fal.run/fal-ai/kling-video/v2/master" \
  -H "Authorization: Key $FAL_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "[prompt de vídeo do Agente 04]",
    "duration": "5",
    "aspect_ratio": "[9:16 / 4:5]",
    "image_url": "[URL do frame-chave gerado pelo Flux]"
  }'
```
Resposta: URL do vídeo gerado → baixar e salvar

### Minimax (vídeo alternativo)
```bash
curl -X POST "https://fal.run/fal-ai/minimax-video" \
  -H "Authorization: Key $FAL_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "[prompt de vídeo do Agente 04]",
    "image_url": "[URL do frame-chave]"
  }'
```

---

## Processo de execução por peça

### Peças 1 e 2 (Apresentadora 30s e 15s):
```
1. Ler roteiro validado
2. Para cada cena:
   a. Verificar banco de imagens no Drive
   b. Se tem imagem → usar como referência (image-to-image)
   c. Se não tem → gerar do zero (text-to-image)
   d. Gerar imagem de apoio nos 3 formatos via Flux Pro
   e. Salvar imagens
3. Montar roteiro final formatado
4. Salvar local + Drive
```

### Peças 3 e 4 (Narrado 30s e 15s):
```
1. Ler roteiro validado + direção criativa
2. Para cada cena:
   a. Verificar banco de imagens no Drive
   b. Gerar frame-chave via Flux Pro (3 formatos)
   c. Animar frame via Kling ou Minimax (3 formatos de vídeo)
   d. Salvar frames + vídeos
3. Concatenar cenas em vídeo final (por formato)
4. Salvar local + Drive
```

### Peça 5 (Estático):
```
1. Ler roteiro validado + direção criativa
2. Verificar banco de imagens no Drive
3. Gerar imagem base via Flux Pro (3 formatos)
4. Salvar local + Drive
```

---

## Regras

1. **Seguir EXATAMENTE os prompts do Agente 04** — não alterar, não improvisar
2. **Sempre tentar usar imagem do Drive primeiro** — só gerar do zero se não tiver
3. **Salvar em DOIS lugares** — local + Google Drive, sempre
4. **Nomear arquivos de forma clara** — cena1.png, reels-9x16.mp4, etc.
5. **Se a API falhar** — tentar novamente (máx 3 tentativas). Se persistir, reportar erro.
6. **Não pular formatos** — todas as peças devem ter todos os formatos definidos
7. **Roteiro da apresentadora** — nunca tentar gerar vídeo com IA, apenas roteiro + imagens de apoio
