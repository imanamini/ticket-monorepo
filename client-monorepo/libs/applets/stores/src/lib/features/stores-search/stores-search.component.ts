import { ChangeDetectionStrategy, Component, computed, effect, inject, OnDestroy, OnInit, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoItemComponent, PageLayoutComponent, SearchComponent } from '@client-monorepo/common/ui-components';
import { Banner, rangeCreator, BannerCategory, BannerResponse } from '@client-monorepo/common/utilities';
import { SuggestedSearchesComponent } from '../../components/suggested-searches/suggested-searches.component';
import { ProductApiService, ProductsSortAndFilterService, StorePreviewComponent, StoresService } from '@client-monorepo/stores';
import { Subscription } from 'rxjs';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxBottomNavigationService } from '@digipay/ngx-bottom-navigation';
import { ActionHandlerService } from '@client-monorepo/common/action-handler';
import { BackHandlerService } from '@client-monorepo/back-handler';
import { SearchHistoryComponent } from '../../components/search-history/search-history.component';
import { SearchHistoryService } from '../../data-access/services/search-history.service';
import { DistancePipe } from '@digipay/ng-lib-pipes';
import { SearchResultStoresComponent } from '../../components/search-result-stores/search-result-stores.component';
import { NgxSearchBoxComponent } from '@digipay/ngx-search-box';
import { BannersApiService, SharedCommonBannersComponent } from '@client-monorepo/libs/shared/common/banners';
import { GeoEntityService, LocationService } from '@client-monorepo/common/location-management';
import { SearchResultProductsComponent } from '../../components/search-result-products/search-result-products.component';

@Component({
  selector: 'stores-applet-stores-search',
  standalone: true,
  imports: [
    CommonModule,
    SuggestedSearchesComponent,
    StorePreviewComponent,
    DpIconComponent,
    PageLayoutComponent,
    SearchHistoryComponent,
    SearchResultStoresComponent,
    SearchResultProductsComponent,
    NoItemComponent,
    NgxSearchBoxComponent,
    SharedCommonBannersComponent,
    NgxSearchBoxComponent,
  ],
  providers: [DistancePipe],
  templateUrl: './stores-search.component.html',
  styleUrl: './stores-search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoresSearchComponent implements OnInit, OnDestroy {
  // Injections
  backHandlerService = inject(BackHandlerService);
  productApiService = inject(ProductApiService);
  bottomNavigationService = inject(NgxBottomNavigationService);
  actionHandler = inject(ActionHandlerService);
  router = inject(Router);
  searchHistoryService = inject(SearchHistoryService);
  sortAndFilterService = inject(ProductsSortAndFilterService);

  // Variables
  sectionToShow = signal<'MAIN' | 'SUGGESTIONS' | 'SEARCH_RESULT'>('MAIN');
  suggestions = signal<Array<string>>([]);
  searchText = signal<string>('');
  searching = signal<boolean>(false);
  initialized = signal(false);
  hasHistory = signal<boolean>(true);
  showStoresResult = signal(true);
  showProductsResult = signal(true);
  ctaSearchText = computed(() => {
    return `جست‌و‌جوی "${this.trimmedSearchText()}"`;
  });
  trimmedSearchText = computed(() => this.searchText().trim());
  searchComponent = viewChild<SearchComponent>('searchComponent');
  rangeCreator = rangeCreator;
  searchSubscription!: Subscription;
  bannersData = computed<Banner[]>(() => this.extractUserBanners());
  allBannersData = signal<Banner[]>([]);
  route = inject(ActivatedRoute);
  bannersApiService = inject(BannersApiService);
  geoEntitiesBanner = signal<{ [key: string]: boolean }>({});
  geoEntitiesSlide = signal<{ [key: string]: boolean }>({});
  geoEntityService = inject(GeoEntityService);
  locationService = inject(LocationService);
  storesService = inject(StoresService);
  protected readonly BannerCategory = BannerCategory;

  constructor() {
    effect(() => {
      if (this.searchComponent()?.searchEl() && !this.initialized()) {
        setTimeout(() => {
          this.initialized.set(true);
          this.searchComponent()?.searchEl()?.nativeElement.focus();
        });
      }
    });
    effect(
      () => {
        if (this.searchHistoryService.searchHistory().length) {
          if (!this.hasHistory()) this.hasHistory.set(true);
        }
      },
      { allowSignalWrites: true },
    );
  }

  ngOnInit() {
    this.searchHistoryService.refreshSearchHistory();
    this.bottomNavigationService.hide();
    this.backHandlerService.setCustomBackUrl('/stores');
    this.getBanners();
    this.locationService.getGuaranteedLocation(false, this.storesService.ttlForOptionalLocation).subscribe(() => this.getGeoEntity());
  }

  doSearch(phrase = ''): void {
    const trimmed = phrase.trim();
    if (trimmed && trimmed.length > 1) {
      this.sectionToShow.set('SUGGESTIONS');
      this.searching.set(true);
      this.unsubSearch();
      this.searchSubscription = this.productApiService.getSearchSuggestions(trimmed).subscribe({
        next: (suggestionsRes) => {
          this.suggestions.set(suggestionsRes.topQuerySuggestions);
        },
        error: () => {
          this.suggestions.set([]);
        },
        complete: () => {
          this.searching.set(false);
          this.unsubSearch();
        },
      });
    } else {
      this.searching.set(false);
      this.sectionToShow.set('MAIN');
      this.sortAndFilterService.resetSortAndFilter();
    }
  }

  handleSearchState(phrase: string): void {
    if (phrase && phrase.length > 1) {
      this.unsubSearch();
      this.showStoresResult.set(true);
      this.showProductsResult.set(true);
      this.sectionToShow.set('SEARCH_RESULT');
    } else {
      this.sectionToShow.set('MAIN');
    }
  }

  suggestionClick(suggestion: string): void {
    this.searchText.set(suggestion);
    this.handleSearchState(suggestion);
  }

  handleSearchWithEnterKey(): void {
    this.suggestionClick(this.trimmedSearchText());
  }

  handleHasHistory(hasHistory: boolean): void {
    this.hasHistory.set(hasHistory);
  }

  unsubSearch(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  handleEmptyStores(): void {
    this.showStoresResult.set(false);
  }

  handleEmptyProducts(): void {
    this.showProductsResult.set(false);
  }

  ngOnDestroy() {
    this.unsubSearch();
    this.bottomNavigationService.show();
  }

  private getBanners(): void {
    const data = this.route.snapshot.data['initialData'] as BannerResponse;
    if (data) {
      this.allBannersData.set(data.banners);
    } else {
      this.bannersApiService.getBanners().subscribe({
        next: (result) => {
          this.allBannersData.set(result.banners);
        },
      });
    }
  }

  private getGeoEntity(): void {
    this.geoEntityService.getHashMapOfClassName(['banner', 'slide']).subscribe({
      next: (res) => {
        this.geoEntitiesBanner.set(res['banner'] || {});
        this.geoEntitiesSlide.set(res['slide'] || {});
      },
    });
  }

  extractUserBanners(): Banner[] {
    return this.allBannersData()
      .filter((banner) => {
        if (!banner.geoRestricted) {
          return true;
        }
        return this.geoEntitiesBanner()[banner.uuid];
      })
      .map((banner) => {
        const newSlides = banner.slides.filter((slide) => {
          if (!slide.geoRestricted) {
            return true;
          }
          return this.geoEntitiesSlide()[slide.uuid];
        });
        return { ...banner, slides: newSlides };
      });
  }
}
