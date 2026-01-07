export enum EquipmentProductCategoryEnum {
  GAME_CONSOLE = 'GAME_CONSOLE',
  GAMECONSOLE = 'GAMECONSOLE',
  LAPTOP = 'LAPTOP',
  MOBILE = 'MOBILE',
  TABLET = 'TABLET',
  HOMEAPPLIANCE = 'HOMEAPPLIANCE',
}

export const EQUIPMENT_PRODUCT_CATEGORY_TRANSLATOR = {
  [EquipmentProductCategoryEnum.GAME_CONSOLE]: 'کنسول بازی',
  [EquipmentProductCategoryEnum.GAMECONSOLE]: 'کنسول بازی',
  [EquipmentProductCategoryEnum.LAPTOP]: 'لپتاپ',
  [EquipmentProductCategoryEnum.MOBILE]: 'گوشی موبایل',
  [EquipmentProductCategoryEnum.TABLET]: 'تبلت',
  [EquipmentProductCategoryEnum.HOMEAPPLIANCE]: 'تجهیزات خانگی',
};
