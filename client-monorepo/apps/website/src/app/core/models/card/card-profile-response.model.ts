import { ApiResult } from '../../../api/digipay/models/api-result.model';

export interface CardProfile {
  result?: ApiResult;
  bankCode: string;
  cardHolder: string;
  bankName: string;
  logoImageId: string;
  patternImageId?: string;
  colorRange: Array<number>;
  pan: string;
  expirationDate?: string;
  imageId?: string;
  // in new c2c after registration we have the cardIndex(internal registration)
  cardIndex?: string;
  bankLogo?: string;
  // not in APIs
  externalRegistrationMode: number;
  alias: string;
  cardOwner: string;
  expireDate: string;
  pinned: boolean;
  postfix: string;
  prefix: string;
  requestDate: number;
}
