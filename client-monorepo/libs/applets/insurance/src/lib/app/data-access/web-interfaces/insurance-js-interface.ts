import { DigipayJsInterface } from '@digipay/ng-payment';

export interface InsuranceJsInterface extends DigipayJsInterface {
  getImei(): void;

  setImei(imei: string): void;

  getDeviceInfo(): void;

  setDeviceInfo(deviceInfo: string): void;
}
