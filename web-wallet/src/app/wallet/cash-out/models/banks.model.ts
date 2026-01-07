export interface BanksModel {
  cardBankLogoImageId: string;
  cardImageId: string;
  cardPrefixes: Array<string>;
  cardTransferMethod: number;
  code: string;
  colorRange: Array<string>;
  imageId: string;
  name: string;
  profileCert: string;
  profileCertUrl: string;
  providerImages: Array<string>;
  shouldVerify: boolean;
  uid: string;
  xferCert: string;
  xferCertFileUrl: string;
}
