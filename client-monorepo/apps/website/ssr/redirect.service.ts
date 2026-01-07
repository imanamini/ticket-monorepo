// ssr/redirect.service.ts

import fetch from 'node-fetch';
import { environment } from '../src/environments/environment';

export class RedirectService {
  static async checkRedirect(path: string): Promise<{ redirect: boolean; redirectTo: string; statusCode: string } | null> {
    try {
      const response = await fetch(`${environment.api.host}${environment.api.prefix}/website/redirection/check?&path=${path}`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });

      if (response.status && response.status !== 200) {
        console.warn(`[RedirectService] API responded with status ${response.status} : ${path}`);
        return null;
      }
      const data: { redirect?: boolean; redirectTo?: string; statusCode?: string } = await response.json();

      if (data?.redirect) {
        return {
          redirect: true,
          redirectTo: data.redirectTo,
          statusCode: data.statusCode ?? '302',
        };
      }

      return null;
    } catch (error) {
      console.error('[RedirectService] Failed to call redirect API:', error);
      return null;
    }
  }
}
