export interface IWalletBnplStateData {
  walletName: string;
  nationalId: string;
  birthDate: string;
  postalCode: string;
  phoneNumber: string;
  requiresBirthdateLanding: boolean;
  terms: string;
  walletTitle: string;
  walletId: number;
  activeSwap?: boolean;
}
