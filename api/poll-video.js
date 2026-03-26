// Poll status de um job de vídeo no fal.ai
// GET /api/poll-video?statusUrl=URL&responseUrl=URL

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { statusUrl, responseUrl } = req.query;

  if (!statusUrl || !responseUrl) {
    return res.status(400).json({ error: "statusUrl and responseUrl query params required" });
  }

  const falKey = process.env.FAL_KEY;
  if (!falKey) {
    return res.status(500).json({ error: "FAL_KEY not configured" });
  }

  try {
    const statusResponse = await fetch(statusUrl, {
      headers: { "Authorization": `Key ${falKey}` },
    });

    if (!statusResponse.ok) {
      const errText = await statusResponse.text();
      return res.status(statusResponse.status).json({ error: errText });
    }

    const statusData = await statusResponse.json();

    if (statusData.status === "COMPLETED") {
      const resultResponse = await fetch(responseUrl, {
        headers: { "Authorization": `Key ${falKey}` },
      });

      if (!resultResponse.ok) {
        return res.status(500).json({ error: "Falha ao buscar resultado" });
      }

      const resultData = await resultResponse.json();
      const videoUrl = resultData.video?.url || resultData.url || null;

      return res.status(200).json({ url: videoUrl, status: "completed" });
    }

    if (statusData.status === "FAILED") {
      return res.status(200).json({ status: "failed", error: JSON.stringify(statusData).substring(0, 300) });
    }

    return res.status(200).json({ status: "processing" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
