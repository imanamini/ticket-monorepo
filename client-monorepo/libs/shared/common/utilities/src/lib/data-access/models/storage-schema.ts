export interface StorageSchema {
  cardHistory?: {};
  auth?: {
    userId?: string;
    access?: string;
    refresh?: string;
  };
  redirectAfterLoginData?: {
    url: string;
    queryParams: { [key: string]: string };
    expirationTime?: number;
  };
}
