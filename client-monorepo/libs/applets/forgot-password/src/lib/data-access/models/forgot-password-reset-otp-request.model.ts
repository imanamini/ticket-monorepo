import { DeviceInfo } from '@client-monorepo/common/utilities';

export interface ForgotPasswordResetOtpRequestModel {
  cellNumber: string;
  device: DeviceInfo;
}
