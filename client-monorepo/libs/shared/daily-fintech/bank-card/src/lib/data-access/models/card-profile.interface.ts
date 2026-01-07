import { ApiResultInterface } from '@client-monorepo/common/network';
import { ServiceType } from './card-api.interface';

export interface CardProfile {
  result?: ApiResultInterface;
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
  externalRegistrationMode: number;
  attachedServiceType?: ServiceType[];
}

export interface CardProfilePayload {
  pan: {
    value: string;
    type: string | number; // todo add CardTypeEnum instead
    expireDate?: string;
    postfix?: string;
    prefix?: string;
  };
  certFile: string;
}
