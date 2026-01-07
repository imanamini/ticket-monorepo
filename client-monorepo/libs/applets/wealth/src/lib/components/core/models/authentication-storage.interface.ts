export interface AuthenticationStorageInterface {
  auth: {
    access?: string,
    refresh?: string,
    userId?: string,
    expirationTime?: number
  };
}
