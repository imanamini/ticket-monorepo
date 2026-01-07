import { Injectable } from '@angular/core';

import { DeviceInfo } from '../models/device/device.model';
import { NgxApiConfigService } from '@digipay/ngx-api-config';
import { AppWindow } from '../models/device/app-window';
import { generateDeviceUid, getBrowserName, getOsName, } from '../../utils/device';

declare const window: AppWindow;

@Injectable({
  providedIn: 'root',
})
export class DeviceInfoService {
  deviceInfo: DeviceInfo;

  constructor(private apiConfigService: NgxApiConfigService) {
    this.deviceInfo = {};
  }

  public getDeviceInfo(): Promise<DeviceInfo> {
    return new Promise((resolve) => {
      if (this.deviceInfo?.deviceId) {
        resolve(this.deviceInfo);
      } else {
        this.generateDeviceInfo().then((deviceInfo) => {
          this.deviceInfo = deviceInfo;
          resolve(this.deviceInfo);
        });
      }
    });
  }

  private generateDeviceInfo(): Promise<DeviceInfo> {
    return new Promise((resolve) => {
      if (
        window.digipayHybridApp &&
        typeof window.digipayHybridApp.getDeviceInfo === 'function'
      ) {
        window.digipayHybridApp.setDeviceInfo = (deviceInfo: string) => {
          try {
            resolve(JSON.parse(deviceInfo));
          } catch (e) {
            resolve(this.getDefaultDeviceId());
          }
        };
        window.digipayHybridApp.getDeviceInfo();
        return;
      }
      if (
        window.webkit &&
        window.webkit.messageHandlers &&
        window.webkit.messageHandlers.getDeviceInfo
      ) {
        window.iosWebViewHandler = window.iosWebViewHandler || {};
        window.iosWebViewHandler.setDeviceInfo = (deviceInfo: string) => {
          try {
            resolve(JSON.parse(deviceInfo));
          } catch (e) {
            resolve(this.getDefaultDeviceId());
          }
        };
        window.webkit.messageHandlers.getDeviceInfo.postMessage('');
        return;
      }
      resolve(this.getDefaultDeviceId());
    });
  }

  private getDefaultDeviceId(): any {
    return {
      deviceId: generateDeviceUid(),
      deviceModel: `${getOsName()}/${getBrowserName()}`,
      deviceAPI: 'WEB_BROWSER',
      osName: this.apiConfigService.getApiConstants().agent,
    };
  }
}
