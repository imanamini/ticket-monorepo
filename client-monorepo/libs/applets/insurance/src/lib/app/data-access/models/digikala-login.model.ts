export interface Device {
  deviceId: string;
  deviceModel: string;
  deviceAPI: string;
  osName: string;
}

export interface IDigikalaLoginModel {
  token: string;
  device: Device;
}
