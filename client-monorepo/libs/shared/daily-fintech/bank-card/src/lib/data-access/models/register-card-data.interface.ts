export interface RegisterCardDataInterface {
  encryptedPan: string;
  targetSide: boolean;
  expireDate?: string;
  postfix: string;
  prefix: string;
  cardOwner: string;
  alias?: string;
  callbackUrl?: string;
}
