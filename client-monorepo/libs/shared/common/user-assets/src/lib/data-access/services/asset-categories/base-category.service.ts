import { Injectable } from '@angular/core';
import { map, Observable, of, switchMap } from 'rxjs';
import { AssetCategoryInterface } from '../../models/asset-category.interface';
import { ModifiedAsset } from '../../models/modified-asset.interface';
import { AccountStatus } from '@client-monorepo/common/user-assets';

@Injectable()
export abstract class BaseCategoryService {
  abstract getDetails(): Observable<ModifiedAsset[]>;
  abstract buildPreview(data: any[]): AssetCategoryInterface;

  // Each category can define its additional data sources
  protected getAdditionalData(): Observable<any> {
    return of(null);
  }

  // Get all data needed for this category (main + additional)
  protected getAllData(): Observable<{ mainData: any; additionalData: any }> {
    return this.getMainData().pipe(
      switchMap((mainData) => this.getAdditionalData().pipe(map((additionalData) => ({ mainData, additionalData })))),
    );
  }

  /**
   * Centralized sorting logic for assets
   * Sorts by block status only (blocked items go to end)
   */
  protected sortAssetsDetailsByPriority(assets: ModifiedAsset[]): ModifiedAsset[] {
    return assets.sort((a, b) => {
      // Sort: blocked/disabled assets go to the end
      const aIsDisabled = this.isAssetDisabled(a);
      const bIsDisabled = this.isAssetDisabled(b);

      return aIsDisabled === bIsDisabled ? 0 : aIsDisabled ? 1 : -1;
    });
  }

  /**
   * Determines if an asset is blocked/disabled
   */
  private isAssetDisabled(asset: ModifiedAsset): boolean {
    return asset.accountStatus === AccountStatus.BLOCK || false;
  }

  protected abstract getMainData(): Observable<any>;
}
