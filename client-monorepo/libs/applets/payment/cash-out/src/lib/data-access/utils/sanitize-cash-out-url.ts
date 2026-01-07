export function sanitizeCashOutUrl(url: string): string {
    return url.replace(/\/?digipay\/api\/+/, '');
}
  