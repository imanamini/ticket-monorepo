import { DeviceInfo } from '@client-monorepo/common/utilities';

export interface LoginBodyInterface {
  username: string;
  password: string;
  features: Array<number>;
  device: DeviceInfo;
}
