import { DeviceInfo } from '@client-monorepo/common/utilities';

export interface ForgotPasswordOutputModel {
  otp?: string;
  pin?: string;
  nid?: string;
  phone?: string;
  device?: DeviceInfo;
}
