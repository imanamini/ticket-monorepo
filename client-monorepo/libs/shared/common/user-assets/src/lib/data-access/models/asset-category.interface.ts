import { ModifiedAsset } from './modified-asset.interface';
import { AssetPromotionInterface } from './asset-promotion.interface';

export enum AssetCategoriesEnum {
  TOTAL_BALANCE = 'totalBalance',
  WEALTH = 'wealth',
}

export interface AssetCategoryInterface {
  type: AssetCategoriesEnum;
  title: string;
  subtitle: string;
  totalBalance: number;
  detail: ModifiedAsset[];
  enabled: boolean;
  promotions?: AssetPromotionInterface[];
  isLoaded?: boolean;
}
