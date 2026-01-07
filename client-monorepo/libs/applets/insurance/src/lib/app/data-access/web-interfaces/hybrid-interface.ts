export interface HybridJsInterface {
  Hi(): void;

  getDeviceInfo(): void;

  setDeviceInfo(deviceInfo: string): void;

  getOtpCode(): void;

  setOtpCode(otp: string): void;

  shareText(text: string): void;

  shareScreenImage(trackingCode: string): void;

  getDynamicPassword(): void;

  setDynamicPassword(code: string): void;

  getImei(): void;

  setImei(imei: string): void;
}
