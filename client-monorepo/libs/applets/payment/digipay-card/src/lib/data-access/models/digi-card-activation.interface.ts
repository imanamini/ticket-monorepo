export interface DigiCardActivationApiInput extends DigiCardActivationForm {
  uniqueId: number;
}
export interface DigiCardActivationForm {
  cvv2: string;
  newPassword: string;
  confirmedNewPassword: string;
}
