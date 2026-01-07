import { ApiResult } from '../api-result.model';

export interface CardProfile {
  alias: string;
  bankCode: string;
  bankName: string;
  cardIndex: string;
  cardOwner: string;
  cardHolder: string;
  colorRange: Array<number>;
  expireDate: string;
  imageId: string;
  logoImageId: string;
  pinned: boolean;
  postfix: string;
  prefix: string;
  requestDate: number;
  result?: ApiResult;
  patternImageId?: string;
  pan: string;
  expirationDate?: string;
  // in new c2c after registration we have the cardIndex(internal registration)
  bankLogo?: string;

  // not in APIs
  externalRegistrationMode: number;
}
