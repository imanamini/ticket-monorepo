import { Injectable, inject } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { UserAssetsApiService } from '@client-monorepo/common/user-assets';
import { AssetCategoriesEnum, AssetCategoryInterface } from '../../models/asset-category.interface';
import { ASSET_WEALTH_DETAIL_MAPPER } from '../../consts/asset-wealth-detail-mapper.const';
import { BaseCategoryService } from './base-category.service';
import { AssetBuilder } from '../../../utils/asset-builder';
import { AssetPromotionHelper } from '../../../utils/asset-promotion-helper';
import { ModifiedAsset } from '../../models/modified-asset.interface';
import { ASSET_CATEGORIES_STATIC_MAPPER } from '../../consts/asset-categories.const';
import { FundTypeNames } from '../../consts/fund-type-names';
import { AssetModifierService } from '../asset-modifier.service';

@Injectable({
  providedIn: 'root',
})
export class WealthCategoryService extends BaseCategoryService {
  private readonly userAssetsApiService = inject(UserAssetsApiService);
  private readonly assetModifierService = inject(AssetModifierService);

  protected getMainData(): Observable<any> {
    return this.userAssetsApiService.getUserWealth();
  }

  // Currently wealth doesn't need additional data, but ready for future
  protected override getAdditionalData(): Observable<any> {
    return of(null);
    // Future example: return this.wealthAnalyticsService.getAnalytics();
  }

  getDetails(): Observable<ModifiedAsset[]> {
    return this.getAllData().pipe(
      map(({ mainData, additionalData }) => {
        const detailedAssets = AssetBuilder.buildDetailedAssets(
          mainData.result,
          ASSET_WEALTH_DETAIL_MAPPER,
          additionalData,
          this.getAssetModifiers(),
          'name',
        );

        // Sort funds: WALLET first if it has balance, then by balance descending
        const sortedAssets = this.sortFundsByBalanceWithWalletPriority(detailedAssets);

        return this.sortAssetsDetailsByPriority(sortedAssets); // Use centralized sorting from base class
      }),
    );
  }

  /**
   * Sort funds: WALLET first if it has balance, then other items by balance descending,
   * and WALLET first among zero-balance items too
   */
  private sortFundsByBalanceWithWalletPriority(assets: ModifiedAsset[]): ModifiedAsset[] {
    return assets.sort((a, b) => {
      const aIsWallet = a.id === FundTypeNames.WALLET;
      const bIsWallet = b.id === FundTypeNames.WALLET;
      const aHasBalance = a.balance > 0;
      const bHasBalance = b.balance > 0;

      // If WALLET has balance, it should come first
      if (aIsWallet && aHasBalance && !bIsWallet) return -1;
      if (bIsWallet && bHasBalance && !aIsWallet) return 1;

      // Items with balance come before items without balance
      if (aHasBalance && !bHasBalance) return -1;
      if (bHasBalance && !aHasBalance) return 1;

      // Among items with same balance status (both have balance or both don't)
      if (aHasBalance && bHasBalance) {
        // Both have balance: sort by balance descending
        return b.balance - a.balance;
      } else {
        // Both have zero balance: WALLET comes first
        if (aIsWallet && !bIsWallet) return -1;
        if (bIsWallet && !aIsWallet) return 1;
        // If neither is WALLET, maintain original order
        return 0;
      }
    });
  }

  buildPreview(funds: any[]): AssetCategoryInterface {
    const eligibleAssets = funds.filter((fund) => AssetBuilder.isSupportedByCategory(fund.name, ASSET_WEALTH_DETAIL_MAPPER));
    return {
      ...ASSET_CATEGORIES_STATIC_MAPPER[AssetCategoriesEnum.WEALTH],
      totalBalance: AssetBuilder.calculateTotalBalance(eligibleAssets),
      detail: eligibleAssets,
      promotions: AssetPromotionHelper.extractPromotions([]),
      isLoaded: true,
    };
  }

  private getAssetModifiers() {
    return {
      [FundTypeNames.FIXED_INCOME]: this.assetModifierService.modifyWealthAsset.bind(this.assetModifierService),
      [FundTypeNames.CROWD_FUND]: this.assetModifierService.modifyWealthAsset.bind(this.assetModifierService),
      [FundTypeNames.INDEX]: this.assetModifierService.modifyWealthAsset.bind(this.assetModifierService),
      [FundTypeNames.GOLD]: this.assetModifierService.modifyWealthAsset.bind(this.assetModifierService),
      [FundTypeNames.WALLET]: this.assetModifierService.modifyWealthAsset.bind(this.assetModifierService),
    };
  }
}
