export interface SessionsDevice {
  osName: string;
  deviceModel: string;
  deviceId: string;
}

export enum SessionOsName {
  WEB = 'WEB',
  ANDROID = 'ANDROID',
  IOS = 'IOS',
}
