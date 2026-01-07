import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

@Injectable({
  providedIn: 'root',
})
export class DeviceDetector extends DeviceDetectorService {
  constructor(@Inject(PLATFORM_ID) platformId: any) {
    super(platformId);
  }

  isHuaweiDevice(): boolean {
    const userAgent = navigator.userAgent || (window as any).opera;
    return /Huawei|HUAWEI/i.test(userAgent);
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
    return /Huawei|HUAWEI/i.test(userAgent) || isBazaarChrome;
  }

  isSafari() {
    return /Safari/.test(this.userAgent) && !/Chrome|CriOS/.test(this.userAgent);
  }

  isIphone(): boolean {
    return /iPhone/.test(this.userAgent) || this.isSafari();
  }
}
