export interface DigiCardSetPasswordApiInput {
  newPassword: string;
  confirmedNewPassword: string;
  uniqueId: string;
  cvv2: string;
}
export interface DigiCardChangePasswordApiInput {
  oldPassword: string;
  newPassword: string;
  confirmedNewPassword: string;
  uniqueId: string;
}
export interface DigiCardForgotPasswordApiInput {
  newPassword: string;
  confirmedNewPassword: string;
  uniqueId: string;
  cvv2: string;
} 