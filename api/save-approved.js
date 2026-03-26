// Salva entregável aprovado no Vercel Blob
// Recebe URL do arquivo (vídeo/imagem) + metadados
// Retorna URL permanente do Blob

const { put } = require('@vercel/blob');

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { fileUrl, pieceNumber, pieceType, projectName, fileName } = req.body;
  // fileUrl: URL do arquivo gerado (fal.ai, Drive, etc.)
  // pieceNumber: 1, 2 ou 3
  // pieceType: "estatico", "narrado", "apresentadora"
  // projectName: nome do empreendimento
  // fileName: nome do arquivo (ex: "cena-1.mp4", "narracao.mp3")

  if (!fileUrl || !pieceType || !projectName) {
    return res.status(400).json({ error: "fileUrl, pieceType and projectName required" });
  }

  try {
    // Baixar o arquivo da URL original
    const response = await fetch(fileUrl);
    if (!response.ok) {
      return res.status(400).json({ error: `Não foi possível baixar o arquivo: ${response.status}` });
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const buffer = Buffer.from(await response.arrayBuffer());

    // Montar path organizado: projeto/tipo/arquivo
    const safeName = projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const ext = fileName ? fileName.split('.').pop() : (contentType.includes('video') ? 'mp4' : contentType.includes('audio') ? 'mp3' : 'png');
    const finalName = fileName || `peca-${pieceNumber}-${pieceType}.${ext}`;
    const pathname = `aprovados/${safeName}/${pieceType}/${finalName}`;

    // Upload pro Vercel Blob
    const blob = await put(pathname, buffer, {
      access: 'public',
      contentType,
      addRandomSuffix: false,
      allowOverwrite: true,
    });

    return res.status(200).json({
      url: blob.url,
      downloadUrl: blob.downloadUrl,
      pathname: blob.pathname,
      pieceNumber,
      pieceType,
      projectName,
      savedAt: new Date().toISOString(),
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
