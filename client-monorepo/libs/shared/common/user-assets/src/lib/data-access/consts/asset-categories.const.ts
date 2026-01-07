import { AssetCategoriesEnum, AssetCategoryInterface } from '../models/asset-category.interface';

export const ASSET_CATEGORIES_STATIC_MAPPER: Record<AssetCategoriesEnum, AssetCategoryInterface> = {
  [AssetCategoriesEnum.TOTAL_BALANCE]: {
    type: AssetCategoriesEnum.TOTAL_BALANCE,
    title: 'موجودی کل',
    subtitle: 'کیف پول، وام و اعتبار',
    isLoaded: false,
    totalBalance: 0, // dynamic
    detail: [], // dynamic
    promotions: [], // dynamic
    enabled: true,
  },
  [AssetCategoriesEnum.WEALTH]: {
    type: AssetCategoriesEnum.WEALTH,
    title: 'سرمایه‌گذاری',
    subtitle: 'روش‌های‌ متنوع و امن سرمایه‌گذاری',
    isLoaded: false,
    totalBalance: 0, // dynamic
    detail: [], // dynamic
    promotions: [], // dynamic
    enabled: true,
  },
};

export const ASSET_CATEGORIES_LOAD_ORDER: AssetCategoriesEnum[] = [AssetCategoriesEnum.TOTAL_BALANCE, AssetCategoriesEnum.WEALTH];
