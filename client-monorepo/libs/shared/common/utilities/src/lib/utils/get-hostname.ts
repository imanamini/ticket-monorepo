export function getHostname(url: string): string {
  const l = document.createElement('a');
  l.href = url;
  return removeWWW(l.hostname);
}

export function removeWWW(url: string): string {
  return url
    .replace(/^https?:\/\/www\./i, 'https://')
    .replace(/^http:\/\/www\./i, 'http://')
    .replace(/^www\./i, '');
}
