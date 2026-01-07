export class GenerateVoucherCode {

  public generateFromWalletName(giftCardName: string): string {
    const splitedName: string[] = giftCardName.split('_');
    return splitedName[splitedName.length - 1];
  }

  public generateFromQrCodeUrl(qrResultString: string): string {
    const qrResultStringSplited = qrResultString.split('/');
    return qrResultStringSplited[qrResultStringSplited.length - 1];
  }
}
