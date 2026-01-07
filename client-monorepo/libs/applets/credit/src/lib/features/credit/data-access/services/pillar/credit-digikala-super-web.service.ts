import { inject, Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MaybeAsync } from '@angular/router';
import { CREDIT_ENVIRONMENT } from '../../../credit-environment.interface';
import { DigikalaSuperWebWindow } from './model/credit-digikala-hybrid-js-function.interface';
import { IAppEnv } from './model/credit-app-env.interface';

@Injectable({
  providedIn: 'root',
})
export class CreditDigikalaSuperWebService {
  private renderer: Renderer2;
  private document = inject(DOCUMENT) as Document;
  private scriptLoaded = false;
  protected readonly isPillar = inject(CREDIT_ENVIRONMENT).creditEnv === 'pillar';

  private get window(): DigikalaSuperWebWindow {
    return window as unknown as DigikalaSuperWebWindow;
  }

  public get hasUtmSuperWeb(): boolean {
    const urlParams = new URLSearchParams(window.location.search);
    const utms = urlParams.getAll('utm_source') || [];
    return ['digikala-superweb', 'sa_user', 'digikala-superweb-pwa']?.some((key) => utms.includes(key)) && this.isPillar;
  }

  // for checking digikala superweb user in pillar app must inject web sdk script
  public get isDgkSuperWebUser(): boolean {
    if (!this.isPillar) {
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
    return urlParams.get('sa_token') || '';
  }
  constructor(
    @Inject('APP_ENV') private readonly environment: IAppEnv,
    rendererFactory: RendererFactory2,
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  public initialize(): MaybeAsync<void> {
    void this.initializeScript();
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
    window.location.assign(this.environment.digikala?.base_url + '/users/login/?backUrl=' + encodeURIComponent(url));
  }
}
