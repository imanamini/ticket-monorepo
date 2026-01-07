export interface User {
  accessToken: string;
  refreshToken: string;
  expireIn: number;
  tokenType: string;
  userId:string;
  hasPassword:boolean;
  }

