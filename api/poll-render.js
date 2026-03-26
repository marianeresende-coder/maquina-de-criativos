// Poll Creatomate render status
// GET /api/poll-render?id=RENDER_ID

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const renderId = req.query.id;
  if (!renderId) {
    return res.status(400).json({ error: "id query param required" });
  }

  const apiKey = process.env.CREATOMATE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "CREATOMATE_API_KEY not configured" });
  }

  try {
    const response = await fetch(`https://api.creatomate.com/v1/renders/${renderId}`, {
      headers: { "Authorization": `Bearer ${apiKey}` },
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: errText });
    }

    const data = await response.json();

    if (data.status === "succeeded" && data.url) {
      return res.status(200).json({ url: data.url, renderId, status: "completed" });
    }
    if (data.status === "failed") {
      return res.status(200).json({ status: "failed", renderId, error: data.error_message || "Render failed" });
    }

    // Still processing
    return res.status(200).json({ status: "processing", renderId });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
