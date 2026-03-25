# BANCO DE IMAGENS — Regra de Organização

## Onde
Google Drive — pasta compartilhada "Seazone — Banco de Criativos"

## Estrutura obrigatória

```
📁 Seazone — Banco de Criativos
│
├── 📁 [Nome Exato do Empreendimento]
│   ├── 📁 fachada        → renders, fotos do prédio, ângulos externos
│   ├── 📁 rooftop        → piscina, vista, lifestyle, espreguiçadeiras
│   ├── 📁 regiao         → drone, praia, bairro, Ilha, paisagem
│   ├── 📁 planta         → plantas dos studios, layouts
│   ├── 📁 logo           → logo Seazone, logo do empreendimento/SPOT
│   └── 📁 pin            → pin de localização do SPOT no mapa
│
├── 📁 [Próximo Empreendimento]
│   ├── 📁 fachada
│   ├── 📁 rooftop
│   ├── 📁 regiao
│   ├── 📁 planta
│   ├── 📁 logo
│   └── 📁 pin
│
...
```

## Regras

### Nome da pasta
- O nome da pasta raiz do empreendimento deve ser **EXATAMENTE IGUAL**
  ao campo `projeto.nome` do briefing.json no Lovable
- Exemplo: se o briefing diz `"nome": "Novo Campeche SPOT II"`,
  a pasta deve se chamar exatamente `Novo Campeche SPOT II`
- Sem espaços extras, sem abreviações, sem variações

### Subpastas (sempre as mesmas 6)
| Subpasta | O que colocar | Exemplo |
|----------|---------------|---------|
| `fachada` | Renders da fachada, fotos do prédio, detalhes arquitetônicos | render-frontal.png, fachada-lateral.jpg |
| `rooftop` | Piscina, vista do rooftop, espreguiçadeiras, lifestyle | piscina-borda-infinita.png, rooftop-vista.jpg |
| `regiao` | Fotos de drone, praia, bairro, ilha, paisagem, entorno | drone-praia.jpg, ilha-campeche.png |
| `planta` | Plantas dos studios, layouts, metragens | studio-22m2.png, planta-tipo.pdf |
| `logo` | Logo da Seazone, logo do empreendimento, selo SPOT | logo-seazone-branco.png, selo-spot.svg |
| `pin` | Pin de localização do SPOT no mapa | pin-spot-coral.png, mapa-localizacao.jpg |

### Formato dos arquivos
- Imagens em **alta resolução** (mínimo 1080px no menor lado)
- Formatos aceitos: PNG, JPG, WEBP
- Nomes descritivos (não usar "IMG_0001.jpg")
- Sem pastas dentro das subpastas (tudo direto na raiz de cada subpasta)

### Como a máquina usa
- O Agente 04 (Diretor Criativo) indica de qual subpasta puxar cada imagem
- O Agente 05 (Executor Criativo) acessa o Drive, baixa as imagens e usa como
  input nas ferramentas de IA (fal.ai) para gerar os criativos finais
- Se uma subpasta estiver vazia, a IA gera a imagem do zero via prompt

## Exemplo completo

```
📁 Seazone — Banco de Criativos
│
├── 📁 Novo Campeche SPOT II
│   ├── 📁 fachada
│   │   ├── render-frontal-golden-hour.png
│   │   ├── render-lateral-dia.png
│   │   └── fachada-detalhe-entrada.jpg
│   ├── 📁 rooftop
│   │   ├── piscina-aquecida-vista-mar.png
│   │   ├── rooftop-espreguicadeiras.jpg
│   │   └── rooftop-noturno.png
│   ├── 📁 regiao
│   │   ├── drone-praia-campeche.jpg
│   │   ├── ilha-do-campeche-aerea.png
│   │   ├── bairro-novo-campeche-ruas.jpg
│   │   └── praia-surf-lifestyle.jpg
│   ├── 📁 planta
│   │   ├── studio-14m2.png
│   │   └── studio-36m2.png
│   ├── 📁 logo
│   │   ├── logo-seazone-branco.png
│   │   ├── logo-seazone-azul.png
│   │   └── selo-spot-ii.png
│   └── 📁 pin
│       ├── pin-spot-coral.png
│       └── mapa-localizacao-campeche.jpg
```
