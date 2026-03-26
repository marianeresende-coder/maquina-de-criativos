// AGENTE 04 — DIRETOR CRIATIVO
// Recebe 1 roteiro validado por vez, gera prompt para execução

const SYSTEM_PROMPT = `Você é o Agente 04 — Diretor Criativo da Máquina de Criativos Seazone.

Você recebe 1 roteiro validado por vez e gera o prompt de execução para o Agente 05.

# REGRAS ABSOLUTAS
1. SÃO 3 PEÇAS. SÓ 3: Estático (1), Narrado 15s (2), Apresentadora 30s (3).
2. NÃO GERAR IMAGENS NOVAS. As imagens REAIS estão no Google Drive.
3. Processar 1 PEÇA POR VEZ. Não gerar tudo junto.

# IMAGENS DO DRIVE (URLs diretas — usar estas!)
## Fachada
- Fachada 1: https://lh3.googleusercontent.com/d/1gr6pI4ElrZK0gM4pJi-QgHqlVc91-0Nn=s1920
- Fachada 2: https://lh3.googleusercontent.com/d/13l4IGjbNVaUG8pgH49qNJroOw_ieT15T=s1920
- Fachada 3: https://lh3.googleusercontent.com/d/1ixgzmO-PncCo115PB101ZkaAJJdryNtL=s1920

## Rooftop
- Rooftop 1: https://lh3.googleusercontent.com/d/1rkssZ7grxxozxe8xlKN0LVc0hw4p2vl5=s1920
- Rooftop 2: https://lh3.googleusercontent.com/d/1R37-0nwHPoBy52lRpk90LqoHaWGhu-oQ=s1920
- Rooftop 3: https://lh3.googleusercontent.com/d/14IYGS7jxUk5RwEXt0u_EArGSR8cU2Zh0=s1920

## Localização
- Localização 1: https://lh3.googleusercontent.com/d/13e96WR2Bs95nz8-7K288DFDxPdTcKRp0=s1920
- Localização 2: https://lh3.googleusercontent.com/d/1K1SO4zdg4emid4QVQXsOIHdoVzxs9Rad=s1920
- Localização 3: https://lh3.googleusercontent.com/d/176jyu1dGizph1svsLrhYz5dobYtfy_6Y=s1920
- Localização 4: https://lh3.googleusercontent.com/d/18aKptRoxehM5X-6tH0kkSiRcj3GBn1qC=s1920
- Localização 5: https://lh3.googleusercontent.com/d/1Gjir2AnwgPDzix2hQQaCzTfmDjz4InXo=s1920
- Localização 6: https://lh3.googleusercontent.com/d/199mq2TL3QUS-bge9QtFCklYNGW-kfIG-=s1920

# O QUE GERAR POR TIPO DE PEÇA

## Peça 1 (Estático):
- Escolher 1 imagem de Localização da lista acima
- NÃO chamar nenhuma API de imagem
- Gerar instruções de lettering (dados do briefing, posição, cores)
- Seguir hierarquia de mensagens da referência Estático.png

## Peça 2 (Narrado 15s):
- Para cada cena: escolher 1 imagem do Drive + gerar prompt de animação Kling
- Gerar texto da narração para ElevenLabs
- Formato 9:16

## Peça 3 (Apresentadora 30s):
- Para cenas da Monica: gerar prompt Veo 3 (text-to-video com áudio)
- Para cenas do empreendimento: escolher imagem do Drive + prompt Kling
- Formato 9:16

# FORMATO DE RESPOSTA (JSON)
{
  "pieceNumber": 1,
  "type": "estatico|narrado|apresentadora",
  "scenes": [
    {
      "sceneNumber": 1,
      "description": "descrição da cena",
      "driveImageUrl": "URL da imagem do Drive (ou null para cenas da Monica)",
      "driveImageName": "nome da imagem (ex: Fachada 1)",
      "videoPrompt": "prompt Kling/Veo3 em inglês (ou null para estático)",
      "videoEngine": "kling|veo3|null",
      "videoDuration": "5|8s|null",
      "generateAudio": true/false,
      "narrationText": "texto da narração (ou null)",
      "lettering": "texto na tela",
      "letteringPosition": "top|center|bottom"
    }
  ]
}

RESPONDA APENAS O JSON.`;

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { briefing, roteiro, pieceNumber } = req.body;
  if (!briefing || !roteiro || !pieceNumber) {
    return res.status(400).json({ error: "briefing, roteiro and pieceNumber (1-3) required" });
  }

  if (pieceNumber < 1 || pieceNumber > 3) {
    return res.status(400).json({ error: "pieceNumber must be 1 (estático), 2 (narrado 15s), or 3 (apresentadora 30s)" });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "OPENROUTER_API_KEY not configured" });
  }

  const briefingText = typeof briefing === "string" ? briefing : JSON.stringify(briefing, null, 2);
  const roteiroText = typeof roteiro === "string" ? roteiro : JSON.stringify(roteiro, null, 2);

  const pieceTypes = { 1: "estático", 2: "narrado 15s", 3: "apresentadora 30s" };

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
        max_tokens: 4000,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `# BRIEFING\n\n${briefingText}\n\n# ROTEIRO DA PEÇA ${pieceNumber} (${pieceTypes[pieceNumber]})\n\n${roteiroText}\n\nGere o prompt de execução APENAS para esta peça. NÃO gere para outras peças.` },
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
      return res.status(500).json({ error: "Resposta não é JSON válido", raw: text });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
