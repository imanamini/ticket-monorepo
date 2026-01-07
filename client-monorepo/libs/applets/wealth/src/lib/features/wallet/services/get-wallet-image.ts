export function GetWalletImage(walletName: string): string {
  switch (walletName) {
    case 'WALLET_FX':
      return './wealth-assets/images/deposit/fixed-guid.svg';
    case 'WALLET_GOLD':
      return './wealth-assets/images/deposit/gold-guid.svg';
  }
}
