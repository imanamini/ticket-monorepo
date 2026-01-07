export interface TopUpInfo {
  chargeType: string;
  description: string;
  chargePackages: ChargePackage[];
  variantAvailable?: boolean;
  subDescription?: string;
}

export interface ChargePackage {
  amount: number;
  recommended: boolean;
  info?: ChargeInfo[];
}

export interface ChargeInfo {
  imageId: string;
  leftValue: string;
  rightValue: string;
}
