import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { catchError, of } from 'rxjs';
import { UserAssetsService } from '../../data-access/services/user-assets.service';
import { AssetCategoriesEnum, AssetCategoryInterface } from '../../data-access/models/asset-category.interface';
import { AssetStatus } from '@client-monorepo/common/user-assets';
import { AssetsSliderV2Component } from '../assets-slider-v2/assets-slider-v2.component';
import { AssetsPromotionsComponent } from '../assets-promotions/assets-promotions.component';
import { PROMOTABLE_ASSET_TYPES } from '../../data-access/consts/promotable-asset-types';
import { ASSET_CATEGORIES_LOAD_ORDER, ASSET_CATEGORIES_STATIC_MAPPER } from '../../data-access/consts/asset-categories.const';
import { AssetsPromotionsWidgetComponent } from '../assets-promotions-widget/assets-promotions-widget.component';
import { AbTestService } from '@client-monorepo/common/utilities';

@Component({
  selector: 'common-user-assets-asset-section',
  standalone: true,
  imports: [CommonModule, PipesModule, AssetsSliderV2Component, AssetsPromotionsComponent, AssetsPromotionsWidgetComponent],
  templateUrl: './asset-section.component.html',
  styleUrl: './asset-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slideIn', [
      state('void', style({ height: '0px', opacity: 0, overflow: 'hidden' })),
      state('*', style({ height: '*', opacity: 1, overflow: 'visible' })),
      transition('void => *', [animate('400ms ease-out')]),
    ]),
  ],
})
export class AssetSectionComponent implements OnInit {
  // Injections
  private userAssetsService = inject(UserAssetsService);
  private destroyRef = inject(DestroyRef);
  cdr = inject(ChangeDetectorRef);
  public elementRef = inject(ElementRef);

  // Inputs
  desiredCategories = input<AssetCategoriesEnum[]>([AssetCategoriesEnum.TOTAL_BALANCE, AssetCategoriesEnum.WEALTH]);
  mode = input<'SUMMARY' | 'FULL'>('FULL');

  // Variables
  userAssets = signal<AssetCategoryInterface[]>([]);
  showPromotions = signal(false);
  isNewUser = computed(() => this.checkIfUserIsNew());
  availablePromotions = computed(() => this.userAssets().flatMap((category) => category.promotions || []));

  ngOnInit(): void {
    this.initComponent();
  }

  initComponent(noCache = false): void {
    this.initiateStaticDataOfCategories();
    if (noCache) {
      setTimeout(() => {
        this.loadCategoriesDynamicData(noCache);
      }, 1000);
    } else {
      this.loadCategoriesDynamicData(noCache);
    }
  }

  private initiateStaticDataOfCategories() {
    const assets = ASSET_CATEGORIES_LOAD_ORDER.filter((category) => this.desiredCategories().includes(category))
      .filter((category) => ASSET_CATEGORIES_STATIC_MAPPER[category].enabled)
      .map((category) => ({ ...ASSET_CATEGORIES_STATIC_MAPPER[category] }));
    this.userAssets.set(assets);
  }

  private loadCategoriesDynamicData(noCache = false): void {
    ASSET_CATEGORIES_LOAD_ORDER.forEach((categoryType) => {
      if (ASSET_CATEGORIES_STATIC_MAPPER[categoryType]['enabled']) {
        this.loadCategory(categoryType, noCache);
      }
    });
  }

  private loadCategory(categoryType: AssetCategoriesEnum, noCache = false): void {
    this.userAssetsService
      .getCategoryPreview(categoryType, noCache)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(() => of(null)),
      )
      .subscribe((category) => {
        if (category) {
          this.updateCategoryData(category);
          this.checkPromotions();
        }
      });
  }

  private updateCategoryData(newCategory: AssetCategoryInterface): void {
    const currentAssets = this.userAssets();
    const updatedAssets = currentAssets.map((category) => (category.type === newCategory.type ? newCategory : category));
    this.userAssets.set(updatedAssets);
  }

  private checkPromotions(): void {
    if (this.shouldShowPromotions()) {
      setTimeout(() => this.showPromotions.set(true), 300);
    }
  }
  private shouldShowPromotions(): boolean {
    return !this.showPromotions() && this.isNewUser() && this.hasPromotions() && this.allCategoriesLoaded();
  }

  private hasPromotions(): boolean {
    return this.availablePromotions().length > 0;
  }

  private allCategoriesLoaded(): boolean {
    const assets = this.userAssets();
    return assets.every((asset) => asset.isLoaded);
  }

  /**
   * user is new when: 1)all assets' status equal to no-active 2) No wallet balance 3) No wealth balance
   */
  private checkIfUserIsNew(): boolean {
    const assets = this.userAssets();
    if (!assets?.length) return true;

    // Early return if any category has balance > 0
    if (assets.some((category) => category.totalBalance > 0)) {
      return false;
    }

    // check user is active or no
    for (const category of assets) {
      if (!Array.isArray(category.detail)) continue;

      const hasActivePromotionalAsset = category.detail.some(
        (asset) => PROMOTABLE_ASSET_TYPES.includes(asset.type as any) && asset.status !== AssetStatus.USER_NOT_HAVE,
      );

      if (hasActivePromotionalAsset) return false;
    }

    return true;
  }

  public refresh(): void {
    this.initComponent(true);
  }

  protected readonly AbTestService = AbTestService;
}
