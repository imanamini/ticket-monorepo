import { ChangeDetectionStrategy, Component, computed, inject, input, model, OnDestroy, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { ItemOverview, ItemOverviewComponent } from '@client-monorepo/common/ui-components';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { BranchModel, StoreCategory, StoreCategoryTitleMapper, StorePaymentMethodMapper } from '@client-monorepo/stores';
import { ButtonIcon } from '@digipay/ngx-button';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { rangeCreator } from '@client-monorepo/common/utilities';
import { MapHeaderMobileComponent } from '../map-header-mobile/map-header-mobile.component';
import { Subscription } from 'rxjs';
import { MapHeaderService } from '../../data-access/services/map-header.service';
import { MapSearchResultComponent } from '../map-search-result/map-search-result.component';
import { MapEmptyResultComponent } from '../map-empty-result/map-empty-result.component';
import { MapBranchDetailsComponent } from '../map-branch-details/map-branch-details.component';

@Component({
  selector: 'stores-applet-map-overlay-desktop',
  standalone: true,
  imports: [
    CommonModule,
    ApiImageModule,
    ItemOverviewComponent,
    NgxBadgeModule,
    NgxSkeletonLoadingComponent,
    DpIconComponent,
    MapHeaderMobileComponent,
    MapSearchResultComponent,
    MapEmptyResultComponent,
    MapBranchDetailsComponent,
  ],
  templateUrl: './map-overlay-desktop.component.html',
  styleUrl: './map-overlay-desktop.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapOverlayDesktopComponent implements OnInit, OnDestroy {
  protected readonly StorePaymentMethodMapper = StorePaymentMethodMapper;
  protected readonly rangeCreator = rangeCreator;

  // Injections
  mapHeaderService = inject(MapHeaderService);

  // Inputs
  branchesToShow = input<{ item: ItemOverview; branch: BranchModel }[]>();
  totalAvailableStores = input<number>(0);
  selectedBranch = model<BranchModel | undefined>(undefined);
  selectedCategory = signal<StoreCategory | undefined>(undefined);
  categoryTitle = computed(() => {
    if (this.selectedCategory()) {
      return 'فروشگاه های ' + StoreCategoryTitleMapper[this.selectedCategory()!.title];
    } else return null;
  });
  loadingMode = input(false);
  showSearchResults = signal<boolean>(false);

  // Outputs
  goBackClicked = output<void>();

  // Variables
  buttonIcon: ButtonIcon = {
    name: 'arrow-right',
    type: 'linear',
    secondaryColor: '#005DFF',
  };
  subs = new Subscription();

  ngOnInit(): void {
    this.subOnCategory();
    this.subOnSearchText();
  }

  subOnCategory(): void {
    this.subs.add(
      this.mapHeaderService.getSelectedCategory().subscribe((category) => {
        this.selectedCategory.set(category);
      }),
    );
  }

  subOnSearchText(): void {
    this.subs.add(
      this.mapHeaderService.getSearchText().subscribe((text) => {
        this.showSearchResults.set(text.length > 1);
      }),
    );
  }

  handleBranchClicked(branch: BranchModel): void {
    this.selectedBranch.set(branch);
  }

  handleSearchResultBranchSelect(branch: BranchModel): void {
    this.showSearchResults.set(false);
    this.handleBranchClicked(branch);
  }

  handleGoBackClick(): void {
    this.goBackClicked.emit();
    this.selectedBranch.set(undefined);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
