export interface UserinfoModel {
  authenticated: boolean;
  identity: UserDataModel;
  expiresAt: string;
  issuedAt: string;
  refreshToken: string;
  roles: RoleModel[];
}

export interface UserDataModel {
  firstName: string;
  lastName: string;
  mobile: string;
  address: string;
  postalCode: string;
  nationalCode: string;
  securityStamp?: string;
  ssoUserId?: string;
  userId?: string;
  fullName?: string;
}

export interface RoleModel {
  companyId: string;
  companyName: string;
  companyTypeId: string;
  companyTypeName: string;
  id: string;
  roleId: string;
  roleName: string;
}

export interface GenericApiResponse {
  result: ApiResult;
}

export interface ApiResult {
  message: string;
  level: string;
  status: number;
  title: string;
}

export interface User {
  accessToken: string;
  refreshToken: string;
  expireIn: number;
  tokenType: string;
  userId: string;
  hasPassword: boolean;
}

export interface LoginResponse {
  result: ApiResult;
  accessToken: string;
  refreshToken: string;
  expireIn: number;
  tokenType: string;
  userId: string;
}

export interface AuthModel {
  auth: AuthModelItem;
}

export interface AuthModelItem {
  access: string;
  refresh: string;
  expirationTime?: number;
  userId: string;
}

export interface RedirectAfterLoginData {
  url: string;
  queryParams: { [key: string]: string };
  expirationTime?: number;
  fragment?: string;
}
