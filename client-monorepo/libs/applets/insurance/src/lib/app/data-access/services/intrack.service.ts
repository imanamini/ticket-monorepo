import { inject, Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { NgxHybridService } from '@digipay/ngx-hybrid-service';
import { DOCUMENT } from '@angular/common';
import { IntrackConfigModel } from '../models/intrack-config.model';
import { UserAuthService } from './user-services/user-auth.service';

import { EnvironmentService } from '@client-monorepo/app-core';

@Injectable({
  providedIn: 'root',
})
export class IntrackService {
  private renderer: Renderer2;
  private ink: any;

  constructor(

    @Inject(DOCUMENT) private document: Document,
    private ngxHybridService: NgxHybridService,
    rendererFactory: RendererFactory2,
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  private authService = inject(UserAuthService);  private get environment() {
    return EnvironmentService.env.insurance || EnvironmentService.env;
  }

  public initIntrack(): void {
    const intrackConfig: IntrackConfigModel = {
      app_key: this.environment.intrackConfig.app_key,
      auth_key: this.environment.intrackConfig.auth_key,
      public_key: this.environment.intrackConfig.public_key,
      sw_path: '/ngsw-worker.js',
    };
    if (this.ngxHybridService.isHybrid()) {
      intrackConfig.webView = true;
      if (this.ngxHybridService.isAndroidHybrid()) {
        intrackConfig.android_auth_key = this.environment.intrackConfig.android_auth_key;
      }
      if (this.ngxHybridService.isIosHybrid()) {
        intrackConfig.ios_auth_key = this.environment.intrackConfig.ios_auth_key;
      }
    }

    const script = this.renderer.createElement('script');
    script.src = `//static1.intrack.ir/api/web/download/sdk/v1/inTrack.min.js?v=00`;
    this.renderer.appendChild(this.document.head, script);
    script.async = true;
    script.onload = () => {
      this.ink = (window as any)?.InTrack.init(intrackConfig);
    };
  }

  public sendIntrackEvent(eventName: string, eventData?: { [id: string]: string | number | boolean }): void {
    const userId = this.authService?.getStorageAuthToken()?.auth.userId ?? 'anonymous';
    eventData = { userId, ...eventData };
    this.ink?.sendEvent({
      eventName,
      eventData,
    });
  }
}
