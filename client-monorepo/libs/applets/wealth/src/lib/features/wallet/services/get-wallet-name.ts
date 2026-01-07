export function GetWalletName(walletName: string): string {
  switch (walletName) {
    case 'WALLET_FX':
      return 'طرح درامد ثابت';
    case 'WALLET_GOLD':
      return 'طرح طلا';
    case 'WALLET_MIX':
      return ' ترکیبی (طرح درامد ثابت + طرح طلا) ';
  }
}
