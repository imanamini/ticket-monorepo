import { inject, Injectable, signal } from '@angular/core';
import { map, Observable, Subject, take } from 'rxjs';
import { AssetsDetailV2Component, UserAssetsApiService } from '@client-monorepo/common/user-assets';
import { AssetCategoriesEnum, AssetCategoryInterface } from '../models/asset-category.interface';
import { ModifiedAsset } from '../models/modified-asset.interface';
import { TotalBalanceCategoryService } from './asset-categories/total-balance-category.service';
import { WealthCategoryService } from './asset-categories/wealth-category.service';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { ActionHandlerService } from '@client-monorepo/common/action-handler';
import { EventManagementService } from '@client-monorepo/common/event-management';
import { StorageService } from '@client-monorepo/common/utilities';

@Injectable({
  providedIn: 'root',
})
export class UserAssetsService {
  private readonly userAssetsApiService = inject(UserAssetsApiService);
  private readonly totalBalanceCategoryService = inject(TotalBalanceCategoryService);
  private readonly wealthCategoryService = inject(WealthCategoryService);
  private readonly bottomSheetService = inject(NgxBottomSheetService);
  private readonly actionHandlerService = inject(ActionHandlerService);
  private readonly eventManagementService = inject(EventManagementService);
  private readonly storageService = inject(StorageService);
  private gettingTotalData = signal(false);
  private gettingWealthData = signal(false);
  totalData = new Subject<AssetCategoryInterface>();
  wealthData = new Subject<AssetCategoryInterface>();

  assetHideStatus = signal<Record<AssetCategoriesEnum, boolean>>({} as Record<AssetCategoriesEnum, boolean>);

  constructor() {
    this.assetHideStatus.set(this.storageService.getAssetsHideStatus());
  }

  // for individual category loading with totalBalance calculated
  getCategoryPreview(categoryType: AssetCategoriesEnum, noCache = false): Observable<AssetCategoryInterface> {
    switch (categoryType) {
      case AssetCategoriesEnum.TOTAL_BALANCE:
        return this.userAssetsApiService.getUserAssets(noCache).pipe(
          map((response) => {
            const output = this.totalBalanceCategoryService.buildPreview(response.assets);
            this.totalData.next(output);
            return output;
          }),
        );
      case AssetCategoriesEnum.WEALTH:
        return this.userAssetsApiService.getUserWealth(noCache).pipe(
          map((response) => {
            const output = this.wealthCategoryService.buildPreview(response.result);
            this.wealthData.next(output);
            return output;
          }),
        );

      default:
        throw new Error(`Unsupported category type: ${categoryType}`);
    }
  }

  /**
   * Get detailed assets for a specific asset category type (e.g. totalBalance, wealth)
   */
  getAssetDetails(assetCategory: AssetCategoriesEnum): Observable<ModifiedAsset[]> {
    switch (assetCategory) {
      case AssetCategoriesEnum.TOTAL_BALANCE:
        return this.totalBalanceCategoryService.getDetails();

      case AssetCategoriesEnum.WEALTH:
        return this.wealthCategoryService.getDetails();

      default:
        throw new Error(`Unsupported asset details in: ${assetCategory}`);
    }
  }

  /**
   * Determines if an asset has valid detail data
   */
  private hasDetail(asset: AssetCategoryInterface): boolean {
    return Array.isArray(asset.detail) && asset.detail.length > 0;
  }

  /**
   * Business rules for showing detail button
   */
  shouldShowDetailButton(asset: AssetCategoryInterface, isNewUser: boolean): boolean {
    if (!this.hasDetail(asset)) return false;

    switch (asset.type) {
      case AssetCategoriesEnum.TOTAL_BALANCE:
        return !isNewUser;
      case AssetCategoriesEnum.WEALTH:
        return !isNewUser;
      default:
        return false;
    }
  }

  /**
   * Validates if detail can be opened
   */
  canOpenDetail(asset: AssetCategoryInterface, isNewUser: boolean): boolean {
    return this.hasDetail(asset) && this.shouldShowDetailButton(asset, isNewUser);
  }

  /**
   * Centralized detail opening logic
   */
  async openAssetDetail(asset: AssetCategoryInterface, isNewUser: boolean) {
    if (!this.canOpenDetail(asset, isNewUser)) {
      // TODO: Check functionality of this situation
      return;
    }
    this.bottomSheetService.openBottomSheet(AssetsDetailV2Component, { asset });
    const bottomSheetService = this.bottomSheetService.onClose.subscribe(() => {
      bottomSheetService.unsubscribe();
      const asset: ModifiedAsset = this.bottomSheetService.outputData();
      if (asset && asset.action) {
        let params = '';
        if ('params' in asset.action.payload) {
          params = JSON.stringify(asset.action.payload.params);
        }
        this.eventManagementService.triggerEvent({
          eventType: 'click',
          breadCrumbs: ['assets'],
          data: {
            target: `asset-${asset.type}: ${asset.action.type}`,
          },
          meta: params,
        });
        this.actionHandlerService.handle(asset.action);
        return;
      }
    });
  }

  public toggleHideAssetValue(assetCategoryType: AssetCategoriesEnum): void {
    this.storageService.toggleAssetHide(assetCategoryType);
    const statuses = this.storageService.getAssetsHideStatus();
    this.assetHideStatus.set(statuses);
  }

  public resetHideAssetStatus(): void {
    this.storageService.resetAssetHideStatus();
    this.assetHideStatus.set(this.storageService.getAssetsHideStatus());
  }
}
