export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expireIn: number;
  tokenType: string;
  userId: string;
}

