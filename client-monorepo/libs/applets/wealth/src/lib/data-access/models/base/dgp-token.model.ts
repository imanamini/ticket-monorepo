export interface IDGPTokenModel {
  auth: IDGPAuth;
  redirectAfterLoginData: IDGPRedirectAfterLoginData;
}

interface IDGPAuth {
  access?: string;
  expirationTime?: number;
  refresh?: string;
  userId?: string;
}

interface IDGPRedirectAfterLoginData {
  expirationTime?: number;
  queryParams?: {};
  url?: string;
}
