// Lista todos os entregáveis aprovados salvos no Vercel Blob

const { list } = require('@vercel/blob');

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const projectName = req.query.project || '';
  const safeName = projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-');
  const prefix = safeName ? `aprovados/${safeName}/` : 'aprovados/';

  try {
    const { blobs } = await list({ prefix });

    const files = blobs.map(b => ({
      url: b.url,
      downloadUrl: b.downloadUrl,
      pathname: b.pathname,
      size: b.size,
      uploadedAt: b.uploadedAt,
    }));

    return res.status(200).json({ count: files.length, files });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
