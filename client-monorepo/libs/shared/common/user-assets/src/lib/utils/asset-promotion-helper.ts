import { ModifiedAsset } from '../data-access/models/modified-asset.interface';
import { AssetStatus, AssetTypes } from '@client-monorepo/common/user-assets';
import { AssetPromotionInterface } from '../data-access/models/asset-promotion.interface';
import { ASSETS_PROMOTIONS } from '../data-access/consts/assets-promotions.const';
import { PROMOTABLE_ASSET_TYPES } from '../data-access/consts/promotable-asset-types';

export class AssetPromotionHelper {
  // Make this public so components can use it
  static isPromotableAsset(asset: ModifiedAsset): boolean {
    return asset.status === AssetStatus.USER_NOT_HAVE && PROMOTABLE_ASSET_TYPES.includes(asset.type as any);
  }

  static extractPromotions(assets: any[]): AssetPromotionInterface[] {
    return assets
      .filter((asset) => this.isPromotableAsset(asset))
      .map((asset) => ASSETS_PROMOTIONS[asset.type as AssetTypes])
      .filter((promotion): promotion is AssetPromotionInterface => promotion !== undefined && promotion.title !== undefined)
      .sort((a, b) => a.order - b.order);
  }
}
