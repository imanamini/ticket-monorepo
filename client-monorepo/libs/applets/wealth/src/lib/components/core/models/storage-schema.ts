export interface StorageSchema {
  auth?: {
    access: string,
    refresh?: string,
    userId?: string
  };
  origin?: string;
  inApp?: string;
  inBrowser?: string;
  navSupported?: string;
}
