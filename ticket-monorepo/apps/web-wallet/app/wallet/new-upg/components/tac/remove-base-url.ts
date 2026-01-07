export function removeBaseUrl(url: string): string {
  const splitTacUrl = url.split('/');
  splitTacUrl.splice(0, 5);
  return splitTacUrl.join('/');
}
