import { ApiResultInterface } from '@client-monorepo/common/network';
import { CardZonesEnum } from './card-zones.enum';

export interface CardApiResponse {
  result: ApiResultInterface;
  cards: Array<BankCard>;
  availableServiceType: Array<ServiceType>;
}

export interface BankCard {
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
  cardZones: CardZonesEnum[];
  externalRegistrationMode: number;
  expired: boolean;
  activeBank?: boolean;
  cardHolder?: string;
  pinnedValue: number;
  attachedServiceType?: ServiceType[];
  transferAmountMin: number;
  transferAmountMax: number;
}

export enum ServiceType {
  CARD_TRANSFER = 0,
  CARD_PROFILE = 1,
  CARD_OTP = 2,
  CARD_IBAN_INFO = 3,
  CARD_KYC = 4,
  CARD_TRANSFER_OTP = 5,
  POS_PAYMENT = 6,
}

export interface BnplToCard {
  pan: {
    type: number;
    prefix: string;
    postfix: string;
    value: string;
  };
  serviceType: ServiceType;
}

export enum ToggleCardToBnplErrorStatus {
  ACCOUNT_VERIFICATION_STATUS_FAILED = 4053,
}

export interface UpdateCardApiResponse {
  result: ApiResultInterface;
  cardInfo: BankCard;
}
