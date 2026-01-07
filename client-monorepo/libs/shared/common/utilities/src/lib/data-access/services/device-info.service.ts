import { Inject, inject, Injectable } from '@angular/core';
import { AppWindow } from '../models/app-window';
import { DeviceInfo } from '../models/device.model';
import { generateDeviceUid, getBrowserName, getOsName } from '../../utils/device';
import { NgxApiConfigService } from '@digipay/ngx-api-config';

declare const window: AppWindow;

@Injectable({
  providedIn: 'root',
})
export class DeviceInfoService {
  private ngxApiConfigService = inject(NgxApiConfigService);
  deviceInfo!: DeviceInfo;

  constructor(@Inject('APP_ENV') private environment: { [key: string]: string }) {}

  public getDeviceInfo(): Promise<DeviceInfo> {
    return new Promise((resolve) => {
      if (this.deviceInfo) {
        resolve(this.deviceInfo);
      }
      this.generateDeviceInfo().then((deviceInfo) => {
        this.deviceInfo = deviceInfo;
        resolve(this.deviceInfo);
      });
    });
  }

  private generateDeviceInfo(): Promise<DeviceInfo> {
    return new Promise((resolve) => {
      let resolved = false;

      // Timeout fallback - if native bridge doesn't respond in 3 seconds, use default
      const timeoutId = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          console.warn('[DeviceInfoService] Native bridge timeout, using default device info');
          resolve(this.getDefaultDeviceId());
        }
      }, 3000);

      const safeResolve = (deviceInfo: DeviceInfo) => {
        if (!resolved) {
          resolved = true;
          clearTimeout(timeoutId);
          resolve(deviceInfo);
        }
      };

      // Android WebView
      if (window.digipayHybridApp && typeof window.digipayHybridApp.getDeviceInfo === 'function') {
        window.digipayHybridApp.setDeviceInfo = (deviceInfo: string) => {
          try {
            safeResolve(JSON.parse(deviceInfo));
          } catch (e) {
            console.warn('[DeviceInfoService] Failed to parse device info from Android:', e);
            safeResolve(this.getDefaultDeviceId());
          }
        };

        try {
          window.digipayHybridApp.getDeviceInfo();
        } catch (error) {
          console.warn('[DeviceInfoService] Android getDeviceInfo failed:', error);
          safeResolve(this.getDefaultDeviceId());
        }
        return;
      }

      // iOS WebView
      if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.getDeviceInfo) {
        window.iosWebViewHandler = window.iosWebViewHandler || {};
        window.iosWebViewHandler.setDeviceInfo = (deviceInfo: string) => {
          try {
            safeResolve(JSON.parse(deviceInfo));
          } catch (e) {
            console.warn('[DeviceInfoService] Failed to parse device info from iOS:', e);
            safeResolve(this.getDefaultDeviceId());
          }
        };

        try {
          window.webkit.messageHandlers.getDeviceInfo.postMessage('');
        } catch (error) {
          console.warn('[DeviceInfoService] iOS getDeviceInfo failed:', error);
          safeResolve(this.getDefaultDeviceId());
        }
        return;
      }

      // Web browser fallback
      safeResolve(this.getDefaultDeviceId());
    });
  }

  private getDefaultDeviceId() {
    return {
      deviceId: generateDeviceUid(),
      deviceModel: `${getOsName()}/${getBrowserName()}`,
      deviceAPI: 'WEB_BROWSER',
      osName: this.ngxApiConfigService.getApiConstants().agent,
      appVersion: this.environment['appVersion'] || '1.0',
    };
  }
}
