import { ApiResponse } from '../api-response.model';
import { DeviceInfo } from '../../shared/services/device-info/device-info.model';

export interface CallForOtpResponse extends ApiResponse {
  userId: string;
}

export interface CallForOtpPayload {
  device: DeviceInfo;
}