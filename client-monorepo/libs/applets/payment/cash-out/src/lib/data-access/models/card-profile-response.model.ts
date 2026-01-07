import { CardType } from "@client-monorepo/daily-fintech/bank-card";
import { ServiceType } from "./stored-card.model";
import { ApiResultInterface } from "@client-monorepo/common/network";

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
  result?: ApiResultInterface;
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
