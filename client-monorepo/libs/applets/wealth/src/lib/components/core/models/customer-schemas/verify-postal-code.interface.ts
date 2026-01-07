export type TVerifiedPostalCode = 'Verified' | 'Unverified' | 'ProviderNotAvailable';

export interface IVerifyPostalCode {
  title: string;
  description: string;
  status: TVerifiedPostalCode;
}
