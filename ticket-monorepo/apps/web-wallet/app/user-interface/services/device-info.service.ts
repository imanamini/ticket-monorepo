import {Injectable} from '@angular/core';
import {NgxApiConfigService} from "@digipay/ngx-api-config";
import {generateDeviceUid , getOsName , getBrowserName} from "../../utils/device";

export interface DeviceInfoInterface {
  deviceId: string,
  deviceModel: string,
  deviceAPI: string,
  osName: string
}

@Injectable({
  providedIn: 'root'
})
export class DeviceInfoService {
  constructor(private apiConfig: NgxApiConfigService) {
  }

  public get():DeviceInfoInterface {
    return {
      deviceId: generateDeviceUid(),
      deviceModel: `${getOsName()}/${getBrowserName()}`,
      deviceAPI: 'WEB_BROWSER',
      osName: this.apiConfig.getApiConstants().agent
    };
  }
}
