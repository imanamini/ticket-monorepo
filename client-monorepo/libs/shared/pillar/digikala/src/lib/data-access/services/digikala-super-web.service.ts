import { inject, Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MaybeAsync } from '@angular/router';
import { DigikalaSuperWebWindow, IAppEnv } from '@client-monorepo/pillar/digikala';
import { AppNameService } from '@client-monorepo/common/utilities';

@Injectable({
  providedIn: 'root',
})
export class DigikalaSuperWebService {
  private readonly appNameService = inject(AppNameService);
  private renderer: Renderer2;
  private document = inject(DOCUMENT) as Document;
  private scriptLoaded = false;

  private get window(): DigikalaSuperWebWindow {
    return window as unknown as DigikalaSuperWebWindow;
  }

  public get hasUtmSuperWeb(): boolean {
    const urlParams = new URLSearchParams(window.location.search);
    const utms = urlParams.getAll('utm_source') || [];
    return ['digikala-superweb', 'sa_user', 'digikala-superweb-pwa']?.some((key) => utms.includes(key)) && this.appNameService.isPillar();
  }

  // for checking digikala superweb user in pillar app must inject web sdk script
  public get isDgkSuperWebUser(): boolean {
    if (!this.appNameService.isPillar()) {
      return false;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const utms = urlParams.getAll('utm_source') || [];

    return (
      this.window.SuperWebSDK !== undefined ||
      ['digikala-superweb', 'digikala-superweb-pwa']?.some((key) => utms.includes(key)) ||
      urlParams.get('sa_user') === 'true'
    );
  }

  public get saTokenDGK(): string {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('sa_token');
    // Safeguard: Ensure we return a string (empty string if no token)
    // URLSearchParams.get() returns string | null, but we need to ensure it's always a string
    return token || '';
  }
  constructor(
    @Inject('APP_ENV') private readonly environment: IAppEnv,
    rendererFactory: RendererFactory2,
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  public initialize(): MaybeAsync<void> {
    return this.initializeScript();
  }

  private initializeScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        if (this.scriptLoaded) {
          resolve();
          return;
        }

        const script = this.renderer.createElement('script');
        const sdkUrl = this.environment?.digikala?.super_web_tabs_sdk_url;
        if (!sdkUrl) {
          reject(new Error('SuperWeb SDK URL not provided in environment'));
          return;
        }
        this.renderer.setAttribute(script, 'src', sdkUrl);
        this.renderer.setAttribute(script, 'id', 'superWeb');
        this.renderer.setAttribute(script, 'defer', '');

        this.renderer.listen(script, 'load', () => {
          this.scriptLoaded = true;
          resolve();
        });

        this.renderer.listen(script, 'error', () => {
          reject(new Error('Failed to load SuperWeb script from CDN'));
        });

        this.renderer.appendChild(this.document.head, script);
      } catch (error) {
        reject(error);
      }
    });
  }

  public goToSsoDigikala(): void {
    const url = this.environment.digikala?.api_base_url + 'sso/fintech/?redirect_url=/?utm_source=digikala-superweb';
    const baseUrl = this.environment.digikala?.base_url || '';
    const loginUrl = baseUrl.endsWith('/') ? baseUrl + 'users/login/' : baseUrl + '/users/login/';
    window.location.assign(loginUrl + '?backUrl=' + encodeURIComponent(url));
  }
}
