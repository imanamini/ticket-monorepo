import { DefaultUrlSerializer, UrlTree } from '@angular/router';

export class CustomUrlSerializer extends DefaultUrlSerializer {
  override parse(url: string): UrlTree {
    const processedUrl = this.lowercasePathOnly(url);
    return super.parse(processedUrl);
  }

  override serialize(tree: UrlTree): string {
    const serialized = super.serialize(tree);
    const processedUrl = this.lowercasePathOnly(serialized);

    return this.ensureTrailingSlash(processedUrl);
  }

  private lowercasePathOnly(url: string): string {
    try {
      const hasProtocol = url.startsWith('http://') || url.startsWith('https://');
      const base = hasProtocol ? undefined : 'https://www.mydigipay.com';

      const u = new URL(url, base);

      u.pathname = u.pathname.toLowerCase();

      return hasProtocol ? u.toString() : u.pathname + u.search + u.hash;
    } catch {
      // Fallback (safe for relative URLs)
      const [pathAndQuery, hash] = url.split('#');
      const [path, query] = pathAndQuery.split('?');

      return path.toLowerCase() + (query ? `?${query}` : '') + (hash ? `#${hash}` : '');
    }
  }

  private ensureTrailingSlash(url: string): string {
    try {
      const hasProtocol = url.startsWith('http://') || url.startsWith('https://');
      const base = hasProtocol ? undefined : 'https://www.mydigipay.com';

      const u = new URL(url, base);

      if (!u.pathname.endsWith('/') && !u.pathname.includes('.')) {
        u.pathname += '/';
      }

      return hasProtocol ? u.toString() : u.pathname + u.search + u.hash;
    } catch {
      if (!url.endsWith('/') && !url.includes('.') && !url.includes('?')) {
        return url + '/';
      }
      return url;
    }
  }
}
