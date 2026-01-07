import { DeviceInfo } from '@client-monorepo/common/utilities';

export interface ClientInterface {
  clientId?: string;
  device: DeviceInfo;
  loginIp?: string;
  loginTime?: string;
}
