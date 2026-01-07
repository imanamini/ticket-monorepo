export enum UserAssetTypesEnum {
  SUBSCRIPTION = 'SUBSCRIPTION',
  CREDIT = 'CREDIT',
  PAY_CLUB = 'PAY_CLUB',
  BNPL = 'BNPL',
  WALLET = 'WALLET',
}

export const UserAssetTypesMapper: Record<UserAssetTypesEnum, string> = {
  [UserAssetTypesEnum.SUBSCRIPTION]: 'اشتراک',
  [UserAssetTypesEnum.CREDIT]: 'وام',
  [UserAssetTypesEnum.PAY_CLUB]: 'پی‌کلاب',
  [UserAssetTypesEnum.BNPL]: 'مجموع اعتبار',
  [UserAssetTypesEnum.WALLET]: 'کیف پول',
};

export enum AccountStatus {
  ACTIVE = 0,
  CLOSE = 1,
  IN_ACTIVE = 2,
  BLOCK = 3,
}

export enum AssetTypes {
  WALLET = 'WALLET',
  SUBSCRIPTION = 'SUBSCRIPTION',
  PAY_CLUB = 'PAY_CLUB',
  CREDIT = 'CREDIT',
  BNPL = 'BNPL',
  BNPL_1PAY = 'BNPL_1PAY',
  BNPL_4PAY = 'BNPL_4PAY',
  WEALTH = 'WEALTH',
}

export enum AssetDetailsType {
  TEXT = 'text',
  PRICE = 'price',
  CTA = 'cta',
}

export enum AssetUnitType {
  RIAL = 'ریال',
  TOMAN = 'ت',
  NONE = '',
}

export enum AssetPatternColor {
  GOLD = 'gold',
  SILVER = 'silver',
  BRONZE = 'bronze',
  BLUE = 'blue',
  PURPLE = 'purple',
  DIAMOND = 'diamond',
  BRILLIANCE = 'brilliance',
  TITANIUM = 'titanium',
}

export enum AssetStatus {
  ACTIVE,
  USER_NOT_HAVE,
  SERVICE_NOT_AVAILABLE,
}

export enum UserAssetSubscriptionPlan {
  PLATINUM = 'PLATINIUM',
  GOLD = 'GOLD',
  SILVER = 'SILVER',
  BRONZE = 'BRONZE',
  BRILLIANCE = 'BRILLIANCE',
  DIAMOND = 'DIAMOND',
  TITANIUM = 'TITANIUM',
}

export const UserAssetSubscriptionPlanToTextMapper: Record<UserAssetSubscriptionPlan, string> = {
  [UserAssetSubscriptionPlan.PLATINUM]: 'پلاتینیوم',
  [UserAssetSubscriptionPlan.GOLD]: 'طلایی',
  [UserAssetSubscriptionPlan.SILVER]: 'نقره‌ای',
  [UserAssetSubscriptionPlan.BRONZE]: 'برنزی',
  [UserAssetSubscriptionPlan.BRILLIANCE]: 'برلیان',
  [UserAssetSubscriptionPlan.DIAMOND]: 'الماس',
  [UserAssetSubscriptionPlan.TITANIUM]: 'تیتانیوم',
};

export const UserAssetSubscriptionPlanToColorMapper: Record<UserAssetSubscriptionPlan, { [key: string]: string }> = {
  [UserAssetSubscriptionPlan.PLATINUM]: {
    primaryColor: '#35D1F4',
    secondaryColor: '#CDFCFF',
    patternColor: AssetPatternColor.BLUE,
  },
  [UserAssetSubscriptionPlan.GOLD]: {
    primaryColor: '#FDA016',
    secondaryColor: '#FFDB59',
    patternColor: AssetPatternColor.GOLD,
  },
  [UserAssetSubscriptionPlan.SILVER]: {
    primaryColor: '#617496',
    secondaryColor: '#C1CADB',
    patternColor: AssetPatternColor.SILVER,
  },
  [UserAssetSubscriptionPlan.BRONZE]: {
    primaryColor: '#A05B09',
    secondaryColor: '#E6B56D',
    patternColor: AssetPatternColor.BRONZE,
  },
  [UserAssetSubscriptionPlan.BRILLIANCE]: {
    primaryColor: '#3C60AA',
    secondaryColor: '#ACBEE2',
    patternColor: AssetPatternColor.BRILLIANCE,
  },
  [UserAssetSubscriptionPlan.DIAMOND]: {
    primaryColor: '#1BE7CC',
    secondaryColor: '#9EE8DE',
    patternColor: AssetPatternColor.DIAMOND,
  },
  [UserAssetSubscriptionPlan.TITANIUM]: {
    primaryColor: '#AEA698',
    secondaryColor: '#E2DFDA',
    patternColor: AssetPatternColor.TITANIUM,
  },
};

export const CreditAssetStatusMapper: Record<
  AssetStatus,
  {
    detailsType: AssetDetailsType;
    unit: AssetUnitType;
    subTitle: string;
  }
> = {
  [AssetStatus.ACTIVE]: { detailsType: AssetDetailsType.PRICE, unit: AssetUnitType.RIAL, subTitle: '' },
  [AssetStatus.USER_NOT_HAVE]: { detailsType: AssetDetailsType.CTA, unit: AssetUnitType.NONE, subTitle: 'مشاهده' },
  [AssetStatus.SERVICE_NOT_AVAILABLE]: {
    detailsType: AssetDetailsType.TEXT,
    unit: AssetUnitType.NONE,
    subTitle: 'غیرفعال',
  },
};
export const BnplAssetStatusMapper: Record<
  AssetStatus,
  {
    detailsType: AssetDetailsType;
    unit: AssetUnitType;
    subTitle: string;
  }
> = {
  [AssetStatus.ACTIVE]: { detailsType: AssetDetailsType.PRICE, unit: AssetUnitType.RIAL, subTitle: '' },
  [AssetStatus.USER_NOT_HAVE]: { detailsType: AssetDetailsType.CTA, unit: AssetUnitType.NONE, subTitle: 'دریافت' },
  [AssetStatus.SERVICE_NOT_AVAILABLE]: {
    detailsType: AssetDetailsType.TEXT,
    unit: AssetUnitType.NONE,
    subTitle: 'غیرفعال',
  },
};
