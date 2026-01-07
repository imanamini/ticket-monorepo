import { ApiResult } from '../../../../../shared/models/api-result.model';
import { CardType } from './card-type-enum';
import { ServiceType } from './stored-card.model';

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
  attachedServiceType?: ServiceType[];

  externalRegistrationMode: number;
}

export interface CardProfileBody {
  certFile: string;
  pan: {
    expireDate: string;
    postfix: string;
    prefix: string;
    type: CardType;
    value: string;
  };
}

export interface CardResponse {
  result?: ApiResult;
  cards: CardServiceResponse[];
  availableServiceType: ServiceType[];
}

export interface CardServiceResponse {
  cardIndex: string;
  prefix: string;
  postfix: string;
  expireDate: string;
  pinned: boolean;
  requestDate: number;
  alias: string;
  cardOwner: string;
  bankName: string;
  bankCode: string;
  imageId: string;
  logoImageId: string;
  bankLogoImageId: string;
  colorRange: number[];
  active: boolean;
  pan: string;
  cardZones: number[];
  externalRegistrationMode: number;
  expired: boolean;
  badge: {
    imageId: string;
    backgroundColor: string;
  };
  attachedServiceType: ServiceType[];
}
