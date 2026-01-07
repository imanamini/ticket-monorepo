export function normalizeSearchText(text: string | undefined): string {
  if (!text) return '';
  return text.replace(/\u200c/g, ' ').toLowerCase();
}
