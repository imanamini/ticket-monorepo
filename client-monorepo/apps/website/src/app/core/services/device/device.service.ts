import { environment } from '../../../../environments/environment';
import { Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { delay, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DeviceService extends DeviceDetectorService {
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

  isInstalledOnDevice() {
    if (environment.name === 'development') {
      // allow viewing the application without adding to home screen
      // in non-production environments
      return true;
    }

    // works on android and iOS
    return window.matchMedia('(display-mode: standalone)').matches;
  }

  isIOsDevice() {
    const w = window as any;
    return /iPad|iPhone|iPod/.test(this.userAgent) && !w.MSStream;
  }

  isAndroidDevice() {
    return /(android)/i.test(this.userAgent);
  }

  isIPhone() {
    // const w = window as any;
    // return /iPhone/.test(this.userAgent) && !w.MSStream;
    return /iPhone/.test(this.userAgent);
  }

  isMobileDevice() {
    return this.isMobile();
  }

  isMobileOrTablet() {
    return this.isTablet() || this.isMobile();
  }

  isSafariBrowser() {
    return /^((?!chrome|android|CriOS|FxiOS).)*safari/i.test(this.userAgent);
  }

  getIOSVersion() {
    const match = this.userAgent.match(/OS (\d+)_(\d+)_?(\d+)?/);
    return {
      major: parseInt(match[1]),
      minor: parseInt(match[2]),
      version: match[1] + '.' + match[2],
    };
  }

  isIOSVersionIsLessThan(expectedMajorVersion: number, minorVersion: number): boolean {
    const deviceVersion = this.getIOSVersion();

    if (deviceVersion.major < expectedMajorVersion) {
      return true;
    }

    if (deviceVersion.major > expectedMajorVersion) {
      return false;
    }

    // equal major version, compare minor number
    return deviceVersion.minor <= minorVersion;
  }

  desktopFriendlyFlow() {
    return window.matchMedia('(min-width: 614px)').matches;
  }

  isDesktop() {
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

  twoColumnView() {
    return window.matchMedia('(min-width: 787px)').matches;
  }

  isMacOs() {
    return this.navigator.platform && this.navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    return this.isMacOs();
  }

  /**
   * As There are some events that currently are being supported by iOS and Mac devices,
   * this returns a score about how man of them is being supported in
   * the current browser
   */
  supportsAppleSpecificEvents(): {
    supports: number;
    total: number;
  } {
    let supports = 0;

    const eventNames = [
      'onwebkitmouseforcewillbegin',
      'onwebkitmouseforceup',
      'onwebkitmouseforcedown',
      'onwebkitmouseforcechanged',
      'ongesturestart',
      'ongesturechange',
      'ongestureend',
    ];

    eventNames.forEach((e) => {
      if (typeof window[e] !== 'undefined') {
        supports++;
      }
    });

    return {
      supports,
      total: eventNames.length,
    };
  }

  supportsTouch() {
    return this.isIOsDevice() || this.isAndroidDevice() || this.isMobileOrTablet();
  }

  hasWebCam(): Promise<boolean> {
    return new Promise((resolve) => {
      const md = navigator.mediaDevices;
      if (!md || !md.enumerateDevices) {
        resolve(false);
        return;
      }
      md.enumerateDevices().then((devices) => {
        if (devices.some((device) => 'videoinput' === device.kind)) {
          resolve(true);
        } else {
          resolve(false);
        }
      }).catch(() => {
        resolve(false);
      });
    });
  }

  closeDeviceKeyboard(): Promise<boolean> {
    if (this.isIOsDevice()) {
      return new Promise((resolve) => {
        of('')
          .pipe(delay(150))
          .subscribe({
            next: () => {
              const doc = document as any;
              doc.activeElement.blur();
              resolve(true);
            },
          });
      });
    }

    return new Promise((resolve) => {
      const doc = document as any;
      doc.activeElement.blur();
      resolve(true);
    });
  }

  closeIOsDeviceKeyboard(): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.isIOsDevice()) {
        resolve(false);
        return;
      }
      of('')
        .pipe(delay(150))
        .subscribe({
          next: () => {
            const doc = document as any;
            doc.activeElement.blur();
            resolve(true);
          },
        });
    });
  }

  generateDeviceUid() {
    if (localStorage.getItem('__dp_machine_id')) {
      return localStorage.getItem('__dp_machine_id');
    }
    if (crypto && typeof crypto.randomUUID === 'function') {
      const machineId = crypto.randomUUID();
      localStorage.setItem('__dp_machine_id', machineId);
      return machineId;
    }
    const timeStamp = Math.floor(Date.now()).toString();
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < 20) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      if (timeStamp.charAt(counter)) {
        result += timeStamp.charAt(counter);
      }
      counter += 1;
    }
    localStorage.setItem('__dp_machine_id', result);
    return result;
  }

  getBrowserName(): string {
    const test = (regexp) => regexp.test(this.userAgent);
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

  getNavigatorProductDetails() {
    return {
      productSub: this.navigator.productSub,
      product: this.navigator.product,
      vendor: this.navigator.vendor,
    };
  }

  getDeviceInformation() {
    return {
      deviceId: this.generateDeviceUid(),
      deviceModel: `${this.getOsName()}/${this.getBrowserName()}`,
      deviceAPI: 'WEB_BROWSER',
      osName: 'WEB',
    };
  }
}
