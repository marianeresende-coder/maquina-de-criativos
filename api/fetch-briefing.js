module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "url required" });
  }

  let briefingUrl = url.trim();
  if (!briefingUrl.endsWith("/briefing.json")) {
    briefingUrl = briefingUrl.replace(/\/$/, "") + "/briefing.json";
  }

  try {
    const response = await fetch(briefingUrl, {
      headers: { "Accept": "application/json" },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      return res.status(400).json({ error: `Briefing não encontrado (HTTP ${response.status})` });
    }

    const text = await response.text();
    const data = JSON.parse(text);
    return res.status(200).json(data);
  } catch (err) {
    if (err.name === "SyntaxError") {
      return res.status(400).json({ error: "O arquivo não é um JSON válido" });
    }
    return res.status(500).json({ error: "Não foi possível acessar o briefing. Verifique a URL." });
  }
};
