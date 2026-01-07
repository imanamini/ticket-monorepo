import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GoogleTagManagerService {
  private renderer: Renderer2;

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

  public appendGtmToHeadHtml(): void {
    if (environment['name'] !== 'production') {
      return;
    }
    if (environment['google_tag_manager_id'] && Array.isArray(environment['google_tag_manager_id'])) {
      environment['google_tag_manager_id'].forEach((gtmId) => {
        this.addScriptToHeadHtml(gtmId);
      });
    }
  }

  private addScriptToHeadHtml(gtmId: string): void {
    this.pushOnDataLayer({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js',
    });
    const gtmScript = this.renderer.createElement('script');
    gtmScript.id = 'GTMscript';
    gtmScript.async = true;
    gtmScript.src = '//www.googletagmanager.com/gtm.js?id=' + gtmId;
    this.renderer.appendChild(this.document.head, gtmScript);
  }
}
