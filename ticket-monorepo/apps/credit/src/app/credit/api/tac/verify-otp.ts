export interface VerifyOtpPayload {
  userId: string;
  otp: string;
  features: [number];
}