# AGENTE 05 — EXECUTOR CRIATIVO

## Papel
Recebe tudo mastigado do Agente 04 e EXECUTA. Chama as APIs de IA,
gera os criativos finais e salva localmente + Google Drive.
É o agente que transforma prompts em arquivos prontos.

---

## Input
- Direção criativa completa do Agente 04 (prompts por IA, formatos, mapeamento de imagens)
- Banco de imagens no Google Drive (pasta do empreendimento)
- API key da fal.ai (uma key pra todas as IAs: Flux Pro, Recraft, Kling, Minimax, Luma)

---

## O que ele faz

### Passo 1 — Acessar banco de imagens
- Conectar ao Google Drive
- Localizar pasta do empreendimento (nome = `projeto.nome` do briefing)
- Verificar quais subpastas têm imagens disponíveis (fachada, rooftop, regiao, etc.)
- Baixar imagens que o Agente 04 indicou como referência

### Passo 2 — Gerar criativos via fal.ai (múltiplas IAs)
Para cada cena de cada peça, gerar em **todas as IAs disponíveis** para comparação.
Seguir exatamente os prompts que o Agente 04 definiu para cada IA.

**Peças 1 e 2 — Vídeo com Apresentadora (30s e 15s):**
- NÃO gera vídeo por IA (apresentadora é gravação humana)
- Entrega apenas o **roteiro final formatado** pronto pra Monica gravar
- Gera as **imagens de apoio** em **2 IAs**: Flux Pro + Recraft V3
- Nos 3 formatos cada: Reels (9:16), Feed (4:5), Story (9:16)

**Peça 3 — Vídeo Narrado 30s:**
- Gera frame-chave de cada cena em **2 IAs**: Flux Pro + Recraft V3
- Anima cada frame em **3 IAs**: Kling + Minimax + Luma Ray 2
- Gera nos 3 formatos: Reels (9:16), Feed (4:5), Story (9:16)
- Total por cena: 2 opções de imagem + 3 opções de vídeo

**Peça 4 — Vídeo Narrado 15s:**
- Mesmo processo da peça 3

**Peça 5 — Peça Estática:**
- Gera imagem em **2 IAs**: Flux Pro + Recraft V3
- Gera nos 3 formatos: 9:16, 4:5, 1:1
- Total: 6 imagens (2 IAs × 3 formatos)

### Passo 3 — Salvar resultados
Salvar em DOIS lugares:

**Local (pasta do projeto):**
Cada IA salva em subpasta própria para comparação.
```
outputs/[nome-do-empreendimento]/
├── apresentadora-30s/
│   ├── roteiro-final.md
│   ├── flux-pro/
│   │   ├── apoio-reels-9x16/
│   │   ├── apoio-feed-4x5/
│   │   └── apoio-story-9x16/
│   └── recraft/
│       ├── apoio-reels-9x16/
│       ├── apoio-feed-4x5/
│       └── apoio-story-9x16/
├── apresentadora-15s/
│   ├── roteiro-final.md
│   ├── flux-pro/
│   └── recraft/
├── narrado-30s/
│   ├── flux-pro/         ← frames-chave
│   ├── recraft/          ← frames-chave
│   ├── kling/            ← vídeos animados
│   │   ├── reels-9x16.mp4
│   │   ├── feed-4x5.mp4
│   │   └── story-9x16.mp4
│   ├── minimax/
│   │   └── ...
│   └── luma/
│       └── ...
├── narrado-15s/
│   ├── flux-pro/
│   ├── recraft/
│   ├── kling/
│   ├── minimax/
│   └── luma/
└── estatico/
    ├── flux-pro/
    │   ├── reels-story-9x16.png
    │   ├── feed-4x5.png
    │   └── feed-1x1.png
    └── recraft/
        ├── reels-story-9x16.png
        ├── feed-4x5.png
        └── feed-1x1.png
```

**Google Drive (pasta do empreendimento):**
Mesma estrutura do local — separado por IA para fácil comparação.
```
📁 [Nome do Empreendimento]/
├── 📁 criativos-gerados/          ← nova pasta criada pelo agente
│   ├── 📁 apresentadora-30s/
│   │   ├── roteiro-final.md
│   │   ├── 📁 flux-pro/
│   │   └── 📁 recraft/
│   ├── 📁 apresentadora-15s/
│   │   ├── roteiro-final.md
│   │   ├── 📁 flux-pro/
│   │   └── 📁 recraft/
│   ├── 📁 narrado-30s/
│   │   ├── 📁 flux-pro/   📁 recraft/
│   │   ├── 📁 kling/   📁 minimax/   📁 luma/
│   ├── 📁 narrado-15s/
│   │   ├── 📁 flux-pro/   📁 recraft/
│   │   ├── 📁 kling/   📁 minimax/   📁 luma/
│   └── 📁 estatico/
│       ├── 📁 flux-pro/
│       └── 📁 recraft/
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

> Todas via fal.ai, mesma API key ($FAL_KEY).

### Flux Pro (imagem)
```bash
curl -X POST "https://fal.run/fal-ai/flux-pro/v1.1" \
  -H "Authorization: Key $FAL_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "[prompt Flux do Agente 04]",
    "image_size": "[portrait_16_9 / portrait_4_5 / square]",
    "num_images": 1,
    "safety_tolerance": "5"
  }'
```

### Flux Pro image-to-image (quando tem referência do Drive)
```bash
curl -X POST "https://fal.run/fal-ai/flux-pro/v1.1" \
  -H "Authorization: Key $FAL_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "[prompt Flux do Agente 04]",
    "image_url": "[URL da imagem de referência do Drive]",
    "image_size": "[formato]",
    "num_images": 1,
    "strength": 0.75
  }'
```

### Recraft V3 (imagem)
```bash
curl -X POST "https://fal.run/fal-ai/recraft/v3/text-to-image" \
  -H "Authorization: Key $FAL_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "[prompt Recraft do Agente 04]",
    "image_size": "[portrait_16_9 / portrait_4_3 / square_hd]",
    "style": "realistic_image",
    "colors": [
      {"r": 1, "g": 19, "b": 55},
      {"r": 241, "g": 96, "b": 93},
      {"r": 255, "g": 255, "b": 255}
    ]
  }'
```

### Recraft V3 image-to-image (quando tem referência do Drive)
```bash
curl -X POST "https://fal.run/fal-ai/recraft/v3/image-to-image" \
  -H "Authorization: Key $FAL_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "[prompt Recraft do Agente 04]",
    "image_url": "[URL da imagem de referência do Drive]",
    "image_size": "[formato]",
    "style": "realistic_image",
    "colors": [
      {"r": 1, "g": 19, "b": 55},
      {"r": 241, "g": 96, "b": 93},
      {"r": 255, "g": 255, "b": 255}
    ]
  }'
```

### Kling (vídeo)
```bash
curl -X POST "https://fal.run/fal-ai/kling-video/v2/master" \
  -H "Authorization: Key $FAL_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "[prompt Kling do Agente 04]",
    "duration": "5",
    "aspect_ratio": "[9:16 / 4:5]",
    "image_url": "[URL do frame-chave]"
  }'
```

### Minimax (vídeo)
```bash
curl -X POST "https://fal.run/fal-ai/minimax-video" \
  -H "Authorization: Key $FAL_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "[prompt Minimax do Agente 04]",
    "image_url": "[URL do frame-chave]"
  }'
```

### Luma Dream Machine Ray 2 (vídeo)
```bash
curl -X POST "https://fal.run/fal-ai/luma-dream-machine/ray-2/image-to-video" \
  -H "Authorization: Key $FAL_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "[prompt Luma do Agente 04]",
    "image_url": "[URL do frame-chave]",
    "aspect_ratio": "[16:9 / 9:16 / 4:3 / 3:4]"
  }'
```

---

## Processo de execução por peça

### Peças 1 e 2 (Apresentadora 30s e 15s):
```
1. Ler roteiro validado
2. Para cada cena:
   a. Verificar banco de imagens no Drive
   b. Se tem imagem → image-to-image, senão → text-to-image
   c. Gerar imagem de apoio nos 3 formatos via Flux Pro
   d. Gerar imagem de apoio nos 3 formatos via Recraft V3
   e. Salvar em subpastas separadas (flux-pro/ e recraft/)
3. Montar roteiro final formatado
4. Salvar local + Drive
```

### Peças 3 e 4 (Narrado 30s e 15s):
```
1. Ler roteiro validado + direção criativa
2. Para cada cena:
   a. Verificar banco de imagens no Drive
   b. Gerar frame-chave via Flux Pro (3 formatos)
   c. Gerar frame-chave via Recraft V3 (3 formatos)
   d. Animar frame via Kling (3 formatos de vídeo)
   e. Animar frame via Minimax (3 formatos de vídeo)
   f. Animar frame via Luma Ray 2 (3 formatos de vídeo)
   g. Salvar tudo em subpastas por IA
3. Concatenar cenas em vídeo final (por formato, por IA)
4. Salvar local + Drive
```

### Peça 5 (Estático):
```
1. Ler roteiro validado + direção criativa
2. Verificar banco de imagens no Drive
3. Gerar imagem via Flux Pro (3 formatos)
4. Gerar imagem via Recraft V3 (3 formatos)
5. Salvar local + Drive (subpastas por IA)
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
