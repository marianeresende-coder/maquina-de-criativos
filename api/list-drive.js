// Lista imagens de uma pasta pública do Google Drive
// Extrai IDs dos arquivos do HTML da página da pasta

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { folderId } = req.body;
  if (!folderId) {
    return res.status(400).json({ error: "folderId required" });
  }

  try {
    const url = `https://drive.google.com/drive/folders/${folderId}`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "text/html",
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      return res.status(400).json({ error: `Drive folder not accessible (${response.status})` });
    }

    const html = await response.text();

    // Extract file entries from Google Drive page data
    // Drive embeds file data in script tags as arrays
    const files = [];

    // Pattern 1: Match file IDs and names from the page data
    // Google Drive uses patterns like ["FILE_ID","FILE_NAME",...,"image/jpeg",...]
    const filePattern = /\["(1[a-zA-Z0-9_-]{10,})","([^"]+)"/g;
    let match;
    const seen = new Set();

    while ((match = filePattern.exec(html)) !== null) {
      const id = match[1];
      const name = match[2];

      // Filter for image files by name extension
      if (seen.has(id)) continue;
      const ext = name.toLowerCase().split('.').pop();
      if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'svg'].includes(ext)) {
        seen.add(id);
        files.push({
          id,
          name,
          // Direct URL usable as image reference for AI APIs
          url: `https://lh3.googleusercontent.com/d/${id}=s1920`,
          downloadUrl: `https://drive.google.com/uc?export=download&id=${id}`,
        });
      }
    }

    // Pattern 2: Also try to match from data attributes or other patterns
    const altPattern = /data-id="(1[a-zA-Z0-9_-]{10,})"/g;
    while ((match = altPattern.exec(html)) !== null) {
      const id = match[1];
      if (!seen.has(id)) {
        seen.add(id);
        files.push({
          id,
          name: `file-${id}`,
          url: `https://lh3.googleusercontent.com/d/${id}=s1920`,
          downloadUrl: `https://drive.google.com/uc?export=download&id=${id}`,
        });
      }
    }

    return res.status(200).json({
      folderId,
      count: files.length,
      files,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
