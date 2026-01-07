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
  active?: boolean;
  bankLogoImageId?: string;
  cardZones?: Array<number>;
  expired?: boolean;
  pan?: string;
}
