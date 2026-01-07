export interface RefreshApiResponse {
  accessToken: string;
  refreshToken: string;
  expireIn: number;
  tokenType: string;
  userId: string;
  hasPassword: boolean;
}

