export interface PreSignupRequestPayload {
  nationalCode: string;
  birthDate: number;
}

export enum UserType {
  APP,
  MERCHANT,
  ENTEKHAB
}
