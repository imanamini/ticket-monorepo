export interface SendOtpBody {
  smsToken: string;
  userId: string;
}

export interface SendOtpResponse {
  hasPassword: boolean;
  userId: string;
  accessToken: string;
  refreshToken: string;
}
