export function CreateCashOutUrl(url: string): string {
  return url.replace(/\/?digipay\/api\/+/, '');
}
