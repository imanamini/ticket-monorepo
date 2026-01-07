import { Injectable } from '@angular/core';
import { DeviceInfo } from './device-info.model';
import { generateDeviceUid, getBrowserName, getOsName } from '../../../../utils/device';
import { NgxApiConfigService } from '@digipay/ngx-api-config';

@Injectable({
  providedIn: 'root'
})
export class DeviceInfoService {

  deviceInfo: DeviceInfo;

  constructor(
    private apiConfigService: NgxApiConfigService,
  ) {
  }

  public getDeviceInfo(): Promise<DeviceInfo> {
    return new Promise((resolve) => {
      if (this.deviceInfo) {
        resolve(this.deviceInfo);
      }
      this.deviceInfo = this.generateDeviceInfo();
      resolve(this.deviceInfo);
    });
  }

  private generateDeviceInfo(): DeviceInfo {
    return this.getDefaultDeviceId();
  }

  private getDefaultDeviceId() {
    const osName = this.apiConfigService.getApiConstants().agent;

    return {
      deviceId: generateDeviceUid(),
      deviceModel: `${getOsName()}/${getBrowserName()}`,
      deviceAPI: 'WEB_BROWSER',
      osName,
    };
  }
}
