function extractEmailBody(payload) {
  if (!payload) return '';

  if (payload.mimeType === 'text/plain' || payload.mimeType === 'text/html') {
    const data = payload.body?.data;
    if (data) {
      const decoded = Buffer.from(data, 'base64').toString('utf-8');
      return payload.mimeType === 'text/html'
        ? decoded.replace(/<[^>]+>/g, '') // strip HTML tags
        : decoded;
    }
  }

  if (payload.parts && Array.isArray(payload.parts)) {
    for (const part of payload.parts) {
      const result = extractEmailBody(part);
      if (result) return result; // return first found non-empty body
    }
  }

  return '';
}

module.exports = { extractEmailBody };
