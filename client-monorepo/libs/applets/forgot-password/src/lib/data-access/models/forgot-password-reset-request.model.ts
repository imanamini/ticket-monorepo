export interface ForgotPasswordResetRequestModel {
  cellNumber: string;
  deviceId: string;
  nationalCode: string;
  otp: string;
  password: string;
}
