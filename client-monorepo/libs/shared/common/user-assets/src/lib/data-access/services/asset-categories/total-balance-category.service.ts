import { Injectable, inject } from '@angular/core';
import { Observable, map, of, timeout, catchError } from 'rxjs';
import { AssetTypes, UserAssetsApiService } from '@client-monorepo/common/user-assets';
import { AssetModifierService } from '../asset-modifier.service';
import { ASSET_TOTAL_BALANCE_DETAIL_MAPPER } from '../../consts/asset-total-balance-detail-mapper.const';
import { BaseCategoryService } from './base-category.service';
import { TransactionsApiService } from '@client-monorepo/payment/transactions';
import { AssetBuilder } from '../../../utils/asset-builder';
import { AssetCategoriesEnum, AssetCategoryInterface } from '../../models/asset-category.interface';
import { AssetPromotionHelper } from '../../../utils/asset-promotion-helper';
import { ModifiedAsset } from '../../models/modified-asset.interface';
import { ASSET_CATEGORIES_STATIC_MAPPER } from '../../consts/asset-categories.const';

@Injectable({
  providedIn: 'root',
})
export class TotalBalanceCategoryService extends BaseCategoryService {
  private readonly INSTALLMENTS_TIMEOUT = 2 * 1000; // 2 seconds
  private readonly userAssetsApiService = inject(UserAssetsApiService);
  private readonly assetModifierService = inject(AssetModifierService);
  private readonly transactionsApiService = inject(TransactionsApiService);

  protected getMainData(): Observable<any> {
    return this.userAssetsApiService.getUserAssets();
  }

  protected override getAdditionalData(): Observable<any> {
    return this.getInstallmentsWithTimeout();
  }

  getInstallmentsWithTimeout(): Observable<any> {
    return this.transactionsApiService.getUpcomingInstallmentTransactions().pipe(
      timeout(this.INSTALLMENTS_TIMEOUT),
      catchError((error) => {
        console.warn('Installments API timeout or error:', error);
        return of(null);
      }),
    );
  }

  getDetails(): Observable<ModifiedAsset[]> {
    return this.getAllData().pipe(
      map(({ mainData, additionalData }) => {
        const detailedAssets = AssetBuilder.buildDetailedAssets(
          mainData.assets,
          ASSET_TOTAL_BALANCE_DETAIL_MAPPER,
          additionalData,
          this.getAssetModifiers(),
        );
        return this.sortAssetsDetailsByPriority(detailedAssets); // Use centralized sorting from base class
      }),
    );
  }

  buildPreview(assets: any[]): AssetCategoryInterface {
    const eligibleAssets = assets.filter((asset) => AssetBuilder.isSupportedByCategory(asset.type, ASSET_TOTAL_BALANCE_DETAIL_MAPPER));

    return {
      ...ASSET_CATEGORIES_STATIC_MAPPER[AssetCategoriesEnum.TOTAL_BALANCE],
      totalBalance: AssetBuilder.calculateTotalBalance(eligibleAssets),
      detail: eligibleAssets,
      promotions: AssetPromotionHelper.extractPromotions(assets),
      isLoaded: true,
    };
  }

  private getAssetModifiers() {
    return {
      [AssetTypes.CREDIT]: this.assetModifierService.modifyCreditAsset.bind(this.assetModifierService),
      [AssetTypes.BNPL_1PAY]: this.assetModifierService.modifyBnplAsset.bind(this.assetModifierService),
      [AssetTypes.BNPL_4PAY]: this.assetModifierService.modifyBnplAsset.bind(this.assetModifierService),
      [AssetTypes.WALLET]: this.assetModifierService.modifyWalletAsset.bind(this.assetModifierService),
    };
  }
}
