export interface Result {
  title: string;
  status: number;
  message: string;
  level: string;
}

export interface IAuthUserLoginModel {
  result: Result;
  accessToken: string;
  refreshToken: string;
  expireIn: number;
  tokenType: string;
  userId: string;
  hasPassword: boolean;
}
