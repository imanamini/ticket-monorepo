import { ApiResultInterface } from '@client-monorepo/common/network';
import { DeviceInfo } from '@client-monorepo/common/utilities';

export interface SendSmsResponse {
  result: ApiResultInterface;
  userId: string;
  autofill: boolean;
}

export interface SendSmsRequest {
  cellNumber: string;
  device: DeviceInfo;
  referralCode?: string;
}

export type UserZone = 'app' | 'merchant-app';
