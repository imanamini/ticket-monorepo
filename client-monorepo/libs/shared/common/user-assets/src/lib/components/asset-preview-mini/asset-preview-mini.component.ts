import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxIcon } from '@digipay/ngx-icon';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { AssetCategoriesEnum, AssetCategoryInterface } from '../../data-access/models/asset-category.interface';
import { UserAssetsService } from '../../data-access/services/user-assets.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { ASSET_CATEGORIES_STATIC_MAPPER } from '../../data-access/consts/asset-categories.const';
import { UiLoadingDotsComponent } from '@client-monorepo/common/ui-components';

@Component({
  selector: 'common-user-assets-asset-preview-mini',
  standalone: true,
  imports: [CommonModule, NgxIcon, PipesModule, UiLoadingDotsComponent],
  templateUrl: './asset-preview-mini.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./asset-preview-mini.component.scss'],
})
export class AssetPreviewMiniComponent implements OnInit {
  desiredCategories = input<AssetCategoriesEnum>(AssetCategoriesEnum.TOTAL_BALANCE);
  private userAssetsService = inject(UserAssetsService);
  private destroyRef = inject(DestroyRef);
  userAsset = signal<AssetCategoryInterface>(ASSET_CATEGORIES_STATIC_MAPPER[this.desiredCategories()]);
  assetHideState = computed(() => this.userAssetsService.assetHideStatus()[this.desiredCategories()]);
  gettingData = signal(false);
  ngOnInit() {
    this.getData();
  }

  getData() {
    this.gettingData.set(true);
    this.userAssetsService
      .getCategoryPreview(this.desiredCategories(), false)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(() => of(null)),
      )
      .subscribe((category) => {
        this.gettingData.set(false);
        if (category) {
          this.userAsset.set(category);
        }
      });
  }

  toggleHideAsset(event: Event, asset: AssetCategoryInterface): void {
    event.stopPropagation();
    this.userAssetsService.toggleHideAssetValue(asset.type);
  }
}
