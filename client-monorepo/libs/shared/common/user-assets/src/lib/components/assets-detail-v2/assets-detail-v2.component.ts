import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { AssetsPromotionsComponent } from '../assets-promotions/assets-promotions.component';
import { AssetTypes } from '../../data-access/consts/user-assets.const';
import { UserAssetsService } from '../../data-access/services/user-assets.service';
import { AssetDetailItemsComponent } from '../asset-detail-items/asset-detail-items.component';
import { ModifiedAsset } from '../../data-access/models/modified-asset.interface';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { AssetCategoriesEnum, AssetCategoryInterface } from '../../data-access/models/asset-category.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AssetPromotionHelper } from '../../utils/asset-promotion-helper';

@Component({
  selector: 'common-user-assets-assets-detail-v2',
  standalone: true,
  imports: [CommonModule, DpIconComponent, NgxSkeletonLoadingComponent, AssetsPromotionsComponent, AssetDetailItemsComponent, PipesModule],
  templateUrl: './assets-detail-v2.component.html',
  styleUrls: ['./assets-detail-v2.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetsDetailV2Component {
  asset = computed<AssetCategoryInterface>(() => this.bottomSheetService.data().asset);
  isLoading = signal(true);
  allAssets = signal<ModifiedAsset[]>([]);
  availablePromotions = computed(() => this.asset()?.promotions || []);
  regularAssets = computed(() => {
    return this.allAssets().filter((asset) => !AssetPromotionHelper.isPromotableAsset(asset));
  });
  hasPromotions = computed(() => {
    // if there is exception to show promotions, set here
    return this.availablePromotions().length > 0;
  });

  // injects:
  bottomSheetService = inject(NgxBottomSheetService);
  userAssetsService = inject(UserAssetsService);
  private destroyRef = inject(DestroyRef);

  constructor() {
    this.loadAssetsDetail();
  }

  private loadAssetsDetail(): void {
    const assetType = this.asset()?.type;
    if (!assetType) return;
    this.initiateAssetsDetail(assetType);
  }

  /**
   * Detail view has 2 sections: 1)promotions list 2)regular items of data
   * export "promotionalAssets" and "regularAssets" lists
   */
  initiateAssetsDetail(assetCategory: AssetCategoriesEnum): void {
    this.userAssetsService
      .getAssetDetails(assetCategory)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (assets) => {
          this.allAssets.set(assets);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
  }

  handleClickDetailItem(asset: ModifiedAsset): void {
    this.bottomSheetService.outputData.set(asset);
    this.bottomSheetService.closeBottomSheet();
  }

  protected readonly AssetTypes = AssetTypes;
  protected readonly Array = Array;
}
