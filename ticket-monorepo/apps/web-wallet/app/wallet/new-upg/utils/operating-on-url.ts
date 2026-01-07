export function removeBaseUrlOfUrl(url: string): string {
  const splitTacUrl = url.split('/');
  if (splitTacUrl[0] === 'https:' || splitTacUrl[0] === 'http:') {
    splitTacUrl.splice(0, 5);
    return splitTacUrl.join('/');
  }
  return url;
}
