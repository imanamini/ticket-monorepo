export enum FaqCategoryTypeEnum {
  THIRD_PARTY_VEHICLE,
  THIRD_PARTY_BODY,
  EQUIPMENT,
  HOUSE_INCIDENTS
}

export const FAQ_CATEGORY_TYPE_ENUM_TRANSLATOR: Record<string, string> = {
  [FaqCategoryTypeEnum.THIRD_PARTY_VEHICLE]: 'بیمه شخص ثالث',
  [FaqCategoryTypeEnum.THIRD_PARTY_BODY]: 'بیمه بدنه',
  [FaqCategoryTypeEnum.EQUIPMENT]: 'موبایل و تبلت',
  [FaqCategoryTypeEnum.HOUSE_INCIDENTS]: 'خانه'
};