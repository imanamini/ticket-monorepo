export interface IWalletTransactionInfo {
  iban?: string;
  type?: string;
  amount?: string;
  walletId?: string;
  walletName?: string;
  callbackUrl?: string;
  clientMetadata?: string;
}
