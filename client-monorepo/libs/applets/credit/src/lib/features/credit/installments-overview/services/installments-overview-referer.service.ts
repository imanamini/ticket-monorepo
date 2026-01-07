import { inject, Injectable, signal } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { NgxHybridService } from '@digipay/ngx-hybrid-service';
import { DeviceDetector } from '@digipay/layout';

type DigipayAgent = 'WEB' | 'HYBRID_ANDROID' | 'HYBRID_IOS';
type Device = 'Mobile' | 'DeskTop' | 'Tablet' | 'Others';
type Os = 'Android' | 'Ios' | 'Others';
type Browser = 'Chrome' | 'Firefox' | 'Safari' | 'Edge' | 'InternetExplorer' | 'SamsungInternet' | 'Others';

@Injectable()
export class InstallmentsOverviewRefererService {
  private hybridService = inject(NgxHybridService);
  private platform = inject(Platform);
  private deviceDetector = inject(DeviceDetector);

  #referer = signal<string | null>(null);

  get referer() {
    return this.#referer.asReadonly();
  }

  setReferer(referer: string) {
    this.#referer.set(referer);
  }

  enrichReferer(referer: string | null) {
    // format would be [rfr]-[DigipayAgent]-[Device]-[Os]-[Browser]
    if (referer) {
      return `${referer}-${this.detectDigipayAgent()}-${this.detectDevice()}-${this.detectOs()}-${this.detectBrowser()}`;
    }
    return undefined;
  }

  private detectBrowser(): Browser {
    // priority is important
    const userAgent = window?.navigator?.userAgent;
    if (this.platform.FIREFOX) return 'Firefox';
    if (this.platform.SAFARI) return 'Safari';
    if (this.platform.EDGE) return 'Edge';
    if (this.platform.TRIDENT) return 'InternetExplorer';
    if (this.platform.BLINK && userAgent && userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent && userAgent.includes('SamsungBrowser')) return 'SamsungInternet';
    return 'Others';
  }

  private detectDevice(): Device {
    if (this.deviceDetector.isMobile) return 'Mobile';
    if (this.deviceDetector.isDesktop) return 'DeskTop';
    if (this.deviceDetector.isTablet) return 'Tablet';

    return 'Others';
  }

  private detectOs(): Os {
    if (this.platform.ANDROID) return 'Android';
    if (this.platform.IOS) return 'Ios';

    return 'Others';
  }

  private detectDigipayAgent(): DigipayAgent {
    if (this.hybridService.isAndroidHybrid()) return 'HYBRID_ANDROID';
    if (this.hybridService.isIosHybrid()) return 'HYBRID_IOS';

    return 'WEB';
  }
}
