import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetPreviewV2Component } from '@client-monorepo/common/user-assets';
import { AssetCategoryInterface } from '../../data-access/models/asset-category.interface';
import { NgxDpCarouselComponent, NgxDpCarouselSlideDirective } from '@digipay/ngx-dp-carousel';
import { UserAssetsService } from '../../data-access/services/user-assets.service';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxIcon } from '@digipay/ngx-icon';
import { EventManagementService } from '@client-monorepo/common/event-management';

@Component({
  selector: 'common-user-assets-assets-slider-v2',
  standalone: true,
  imports: [CommonModule, AssetPreviewV2Component, NgxDpCarouselComponent, NgxDpCarouselSlideDirective, NgxButtonComponent, NgxIcon],
  templateUrl: './assets-slider-v2.component.html',
  styleUrl: './assets-slider-v2.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetsSliderV2Component {
  // Inputs
  userAssets = input.required<AssetCategoryInterface[]>();
  isNewUser = input<boolean>(false);
  mode = input<'SUMMARY' | 'FULL'>('FULL');
  // State
  activeAssetIndex = signal<undefined | number>(undefined);

  assetsHideState = computed(() => this.userAssetsService.assetHideStatus());

  // Services
  private readonly userAssetsService = inject(UserAssetsService);
  private readonly eventManagementService = inject(EventManagementService);

  constructor() {
    effect(
      () => {
        this.setDefaultActiveIndex(this.userAssets());
      },
      { allowSignalWrites: true },
    );
  }

  private setDefaultActiveIndex(assets: AssetCategoryInterface[]) {
    if (this.activeAssetIndex() !== undefined) {
      return;
    }
    if (assets[0].totalBalance) {
      this.activeAssetIndex.set(0);
      return; // Keep first item active
    }

    // Find next item with totalBalance
    for (let i = 1; i < assets.length; i++) {
      if (assets[i].totalBalance) {
        this.activeAssetIndex.set(i);
        return;
      }
    }
    // If no item has totalBalance, keep first item active
    this.activeAssetIndex.set(0);
    return;
  }

  navLeftClass = computed(() => {
    const isDisabled = (this.activeAssetIndex() ?? 0) + 1 === this.userAssets().length;
    return isDisabled ? 'text-oninvert-disabled' : 'text-oninvert-high';
  });

  navRightClass = computed(() => {
    const isDisabled = this.activeAssetIndex() === 0;
    return isDisabled ? 'text-oninvert-disabled' : 'text-oninvert-high';
  });

  // Computed properties
  activeAsset = computed(() => {
    const assets = this.userAssets();
    const index = this.activeAssetIndex() ?? 0;
    return assets[index] || null;
  });

  showDetailButton = computed(() => {
    const asset = this.activeAsset();
    return asset ? this.userAssetsService.shouldShowDetailButton(asset, this.isNewUser()) : false;
  });

  // Methods
  onAssetIndexChange(index: number): void {
    this.activeAssetIndex.set(index);
  }

  async onAssetPreviewClick(asset: AssetCategoryInterface): Promise<void> {
    this.eventManagementService.triggerEvent({
      eventType: 'click',
      breadCrumbs: ['assets'],
      data: {
        target: `asset-details: ${asset.type}`,
      },
    });
    await this.userAssetsService.openAssetDetail(asset, this.isNewUser());
  }

  getTabTitleClass(currentIndex: number): string {
    const activeIndex = this.activeAssetIndex();
    if (activeIndex === currentIndex + 1) return 'previous';
    if (activeIndex === currentIndex - 1) return 'next';
    return '';
  }

  trackByAssetType(_index: number, asset: AssetCategoryInterface): string {
    return asset.type;
  }

  toggleHideAsset(event: Event, asset: AssetCategoryInterface): void {
    event.stopPropagation();
    this.userAssetsService.toggleHideAssetValue(asset.type);
  }
}
