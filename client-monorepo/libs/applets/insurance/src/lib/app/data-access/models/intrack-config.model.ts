export interface IntrackConfigModel {
  app_key: string;
  auth_key: string;
  public_key: string;
  sw_path: string;
  webView?: boolean;
  android_auth_key?: string;
  ios_auth_key?: string;
  debug?: boolean;
}
