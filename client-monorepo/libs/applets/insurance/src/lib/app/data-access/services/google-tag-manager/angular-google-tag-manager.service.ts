import { DOCUMENT } from '@angular/common';
import { inject, Inject, Injectable, NgZone, Renderer2, RendererFactory2 } from '@angular/core';
import { filter } from 'rxjs/operators';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NavigationService } from '../navigation.service';

import { EnvironmentService } from '@client-monorepo/app-core';

@Injectable({
  providedIn: 'root',
})
export class GoogleTagManagerService {
  private renderer: Renderer2;
  private lastUrlAfterRedirect: string;
  private readonly regex = /[^?]*/;
  private router = inject(Router);
  private zone: NgZone = inject(NgZone);
  private activatedRoute = inject(ActivatedRoute);
  private navigationService = inject(NavigationService);
  private get environment() {
    return EnvironmentService.env.insurance || EnvironmentService.env;
  }

  private browserGlobals = {
    windowRef(): any {
      return window;
    },
  };

  constructor(

    @Inject(DOCUMENT) private document: Document,
    rendererFactory: RendererFactory2,
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  public getDataLayer(): any[] {
    const window = this.browserGlobals.windowRef();
    window.dataLayer = window.dataLayer || [];
    return window.dataLayer;
  }

  public pushOnDataLayer(obj: object): void {
    const dataLayer = this.getDataLayer();
    dataLayer.push(obj);
  }

  public appendGtmToHeadHtml(tag: string): Promise<void> {
    return new Promise<void>((resolve) => {
      this.zone.runOutsideAngular(() => {
        try {
          const gtmScript: HTMLScriptElement = this.renderer.createElement('script');
          gtmScript.id = 'GTMscript';
          gtmScript.async = true;
          gtmScript.src = 'https://www.googletagmanager.com/gtm.js?id=' + tag;
          gtmScript.type = 'text/javascript';
          gtmScript.defer = true;
          gtmScript.onload = () => {
            try {
              const window = this.browserGlobals.windowRef();
              window.gtag = () => this.getDataLayer().push(arguments);
              this.pushOnDataLayer({
                'gtm.start': new Date().getTime(),
                event: 'gtm.js',
              });
              this.initGTMService();
              console.info('%c GTM script loaded successfully', 'color: green');
              resolve();
            } catch (error) {
              resolve();
              console.error('Error in GTM script onload:', error);
            }
          };

          gtmScript.onerror = (event) => {
            console.error('Failed to load GTM script:', event);
          };
          this.renderer.appendChild(this.document.head, gtmScript);
        } catch {
          resolve();
        }
      });
    });
  }

  private initGTMService(): void {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (this.canPushData()) {
          this.pushOnDataLayer({
            event: 'page_event',
            page_url: event.urlAfterRedirects,
            old_page: this.lastUrlAfterRedirect ?? '/',
          });
          this.lastUrlAfterRedirect = this.router.url;
        }
      }
    });
  }

  canPushData(): boolean {
    const isProduction = this.environment.name === 'production';

    // Prevent sending duplicate page events to GTM after changing the query parameters in the dropdown.
    const matchRegex = this.lastUrlAfterRedirect?.match(this.regex)[0] !== this.router.url.match(this.regex)[0];

    return isProduction && matchRegex;
  }

  handleDuplicatePaymentResultEvent(): void {
    const params = { ...this.activatedRoute.snapshot.queryParams };
    delete params.result;
    this.navigationService.replace([], {
      queryParams: params,
    });
  }
}
