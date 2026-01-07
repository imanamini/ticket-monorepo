import { HybridActionEnumsModel } from './hybrid-action-enums.model';

export interface HybridJsInterface {
  getDeviceInfo(): void;

  setDeviceInfo(deviceInfo: string): void;

  getOtpCode(): void;

  setOtpCode(otp: string): void;

  shareText(text: string): void;

  shareScreenImage(trackingCode: string): void;

  getDynamicPassword(): void;

  setDynamicPassword(code: string): void;

  getContact(): void;

  setContact(phoneNumber: string, contactName: string): void;

  getMarketName(): void;

  setMarketName(market: string): void;

  setStatusCameraPermission(status: boolean): void;

  getStatusCameraPermission(): void;

  closeApp(): void;

  openUrlInAndroid(url: string): void;

  goToAction(featureAction: HybridActionEnumsModel): void;
}
