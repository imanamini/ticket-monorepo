import { Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

@Injectable({
  providedIn: 'root',
})
export class CreditDeviceService extends DeviceDetectorService {
  isMobileSignal = signal(true);
  public navigator: {
    userAgent: string;
    vendor: string;
    platform: string;
    MediaDevices?: MediaDevices;
    productSub?: string;
    product?: string;
  } = {
    userAgent: '',
    vendor: '',
    platform: '',
    product: '',
    productSub: '',
  };

  constructor(@Inject(PLATFORM_ID) platformId: string) {
    super(platformId);
    if (platformId !== 'server') {
      this.navigator = window.navigator;
    }
    this.isMobileSignal.set(super.isMobile());
  }

  isAndroidDevice() {
    return /(android)/i.test(this.userAgent);
  }

  isIPhone() {
    // const w = window as any;
    // return /iPhone/.test(this.userAgent) && !w.MSStream;
    return /iPhone/.test(this.userAgent);
  }

  isMobileOrTablet() {
    return this.isTablet() || this.isMobile();
  }

  override isDesktop() {
    // return !isIOsDevice() && !isAndroidDevice() && matchMedia('(min-width: 768px)').matches;

    if (this.isIPhone()) {
      // iphone users should always see the Mobile view
      return false;
    }

    if (this.isAndroidDevice()) {
      return false;
    }

    return true;
    // return window.matchMedia('(min-width: 614px)').matches;
  }

  isAwfulDevice(): boolean {
    const isBazaarChrome =
      this.browser.toLowerCase() === 'chrome' &&
      (this.browser_version.includes('103') ||
        this.browser_version.includes('102') ||
        this.browser_version.includes('101') ||
        this.browser_version.includes('100') ||
        this.browser_version.startsWith('9'));
    const userAgent = navigator.userAgent || (window as any).opera;
    return /Huawei|HUAWEI/i.test(userAgent) || /Miui|MIUI/i.test(userAgent) || isBazaarChrome;
  }

  getBrowserName(): string {
    const test = (regexp: any) => regexp.test(this.userAgent);
    switch (true) {
      case test(/edg/i):
        return 'Microsoft Edge';
      case test(/trident/i):
        return 'Internet Explorer';
      case test(/firefox|fxios/i):
        return 'Firefox';
      case test(/opr\//i):
        return 'Opera';
      case test(/ucbrowser/i):
        return 'UC Browser';
      case test(/samsungbrowser/i):
        return 'Samsung Browser';
      case test(/chrome|chromium|crios/i):
        return 'Chrome';
      case test(/safari/i):
        return 'Safari';
      default:
        return 'Unknown';
    }
  }

  getOsName() {
    const userAgent = this.userAgent,
      platform = this.navigator.platform,
      macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
      windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
      iosPlatforms = ['iPhone', 'iPad', 'iPod'];
    let os = 'Unknown';

    if (macosPlatforms.indexOf(platform) !== -1) {
      os = 'Mac OS';
    } else if (iosPlatforms.indexOf(platform) !== -1) {
      os = 'iOS';
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
      os = 'Windows';
    } else if (/Android/.test(userAgent)) {
      os = 'Android';
    } else if (!os && /Linux/.test(platform)) {
      os = 'Linux';
    }

    return os;
  }
}
