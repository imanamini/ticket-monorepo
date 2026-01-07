export interface StoredCard {
  activeBank?: boolean;
  alias: string;
  bankCode: string;
  bankName: string;
  cardIndex: string;
  cardOwner: string;
  colorRange: Array<number>;
  expireDate: string;
  imageId?: string;
  logoImageId?: string;
  pinned: boolean;
  pinnedValue: number;
  postfix: string;
  prefix: string;
  requestDate: number;
  cardZones: number[];
  pan: string;
  bankLogoImageId: string;
  externalRegistrationMode: number;
  expired?: boolean;
}
