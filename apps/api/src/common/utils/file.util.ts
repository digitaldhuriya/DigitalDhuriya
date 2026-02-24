export function safeFileName(originalName: string): string {
  const cleaned = originalName.replace(/[^a-zA-Z0-9.-_]/g, '_');
  return `${Date.now()}-${cleaned}`;
}

