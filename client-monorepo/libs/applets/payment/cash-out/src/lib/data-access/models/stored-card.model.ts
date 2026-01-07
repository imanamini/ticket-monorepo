import { PanTypeEnum } from "./pan-type.enum";

export interface StoredCard {
  activeBank?: boolean;
  active?: boolean;
  alias: string;
  bankCode: string;
  bankName: string;
  cardIndex: string;
  cardOwner: string;
  cardHolder?: string;
  colorRange: Array<number>;
  expireDate: string;
  imageId?: string;
  logoImageId?: string;
  pinned: boolean;
  type?: PanTypeEnum,
  pinnedValue: number;
  postfix: string;
  prefix: string;
  requestDate: number;
  cardZones: number[];
  pan: string;
  bankLogoImageId: string;
  externalRegistrationMode: number;
  expired?: boolean;
  attachedServiceType?: ServiceType[];
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
  ACCOUNT_VERIFICATION_STATUS_FAILED = 4053
}