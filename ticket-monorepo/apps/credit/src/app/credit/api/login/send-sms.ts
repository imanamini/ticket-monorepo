import { DeviceInfo } from '../../shared/services/device-info/device-info.model';

export interface SendSmsBody {
  cellNumber: string;
  device: DeviceInfo;
}

export interface SendSmsResponse {
  userId: string;
  autofill: boolean;
}
