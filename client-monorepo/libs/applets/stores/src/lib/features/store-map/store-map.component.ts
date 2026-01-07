import {
  ChangeDetectionStrategy,
  Component,
  computed,
  createComponent,
  EnvironmentInjector,
  inject,
  OnDestroy,
  OnInit,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapBounds, MapLocateMeButtonModel, MapPoint, SharedCommonMapComponent } from '@client-monorepo/common/map';
import { NgxBottomNavigationService } from '@digipay/ngx-bottom-navigation';
import { ItemOverview } from '@client-monorepo/common/ui-components';
import { ServiceImagesType } from '@client-monorepo/common/service-data';
import { debounceTime, Subject, Subscription } from 'rxjs';
import {
  BranchModel,
  GeoQueryPolygonResponse,
  GeoQueryResponse,
  StoreCategory,
  StoreCategoryToLogoMapper,
  StoresApiService,
  StoreSearchBranchesConfig
} from '@client-monorepo/stores';
import { ApiImageComponent, ApiImageModule } from '@digipay/ng-ui-api-image';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { BackHandlerService } from '@client-monorepo/back-handler';
import { AbTestService, DeviceDetector } from '@client-monorepo/common/utilities';
import { MapOverlayMobileComponent } from '../../components/map-overlay-mobile/map-overlay-mobile.component';
import { MapOverlayDesktopComponent } from '../../components/map-overlay-desktop/map-overlay-desktop.component';
import { Coordination, LocationService } from '@client-monorepo/common/location-management';
import { MapHeaderMobileComponent } from '../../components/map-header-mobile/map-header-mobile.component';
import { ActivatedRoute } from '@angular/router';
import { StoreFiltersService } from '../../data-access/services/store-filters.service';
import { MapHeaderService } from '../../data-access/services/map-header.service';
import { MapSearchResultComponent } from '../../components/map-search-result/map-search-result.component';

@Component({
  selector: 'stores-applet-store-map',
  standalone: true,
  imports: [
    CommonModule,
    SharedCommonMapComponent,
    ApiImageModule,
    NgxBadgeModule,
    MapOverlayMobileComponent,
    MapOverlayDesktopComponent,
    MapHeaderMobileComponent,
    MapSearchResultComponent,
  ],
  templateUrl: './store-map.component.html',
  styleUrl: './store-map.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreMapComponent implements OnInit, OnDestroy {
  // Injections
  private injector = inject(EnvironmentInjector);
  bottomNavigationService = inject(NgxBottomNavigationService);
  storesApiService = inject(StoresApiService);
  backHandler = inject(BackHandlerService);
  deviceDetector = inject(DeviceDetector);
  locationService = inject(LocationService);
  activatedRoute = inject(ActivatedRoute);
  filtersService = inject(StoreFiltersService);
  mapHeaderService = inject(MapHeaderService);

  // Variables
  selectedBranch = signal<BranchModel | undefined>(undefined);
  branchList = signal<BranchModel[]>([]);
  currentLocation = signal<Coordination | null>(null);
  loadingBranches = signal<boolean>(true);
  activeSnap = signal<number>(1);
  locateMeButtonConfig = computed<MapLocateMeButtonModel>(() => {
    if (this.branchList().length === 0) {
      return { bottom: '150px', right: '16px' };
    }
    const active = this.activeSnap();
    let config = { bottom: '120px', right: '16px' };
    if (this.isDesktop) {
      config = { bottom: '32px', right: '364px' };
    } else {
      if (!this.branchesListToShow().length) {
        return config;
      }
      if (active === 0) {
        config = { ...config, bottom: '64px' };
      } else if (active === 1) {
        config = { ...config, bottom: '264px' };
      } else if (active === 2) {
        config = { ...config, bottom: '0' };
      }
    }
    return config;
  });
  branchesListToShow = computed<{ item: ItemOverview; branch: BranchModel }[]>(() => {
    return this.branchList().map((branch, index: number) => {
      const store = branch.store;
      const item: ItemOverview = {
        image: {
          type: ServiceImagesType.IMAGE_ID,
          name: store.logoImageId,
        },
        title: `${store.title} ${branch.title}`,
        badge:
          store.badges.length > 0
            ? { text: store.badges[0].content, status: store.badges[0].status, mode: store.badges[0].mode }
            : undefined,
        subTitleNormal: store.subtitle,
        subTitleBold: branch.title,
        divider: index !== this.branchList().length - 1,
      };
      return { item, branch };
    });
  });
  userLocation = signal<Coordination | undefined>(undefined);
  isPartition21 = computed(() => AbTestService.loadIranAccessMap());
  points = computed<MapPoint[]>(() => {
    const branches = this.branchList();
    return branches.map((branch: BranchModel, index: number) => {
      // Create the container div that will be used as the marker's HTML
      const container = document.createElement('div');
      container.style.position = 'relative';
      container.style.overflow = 'hidden';
      container.style.backgroundImage = "url('assets/map/icon-bg.svg')";
      container.style.backgroundSize = 'cover';
      container.style.width = '41px';
      container.style.height = '41px';

      const imageWrapper = document.createElement('div');
      imageWrapper.style.position = 'absolute';
      imageWrapper.style.left = '50%';
      imageWrapper.style.top = '50%';
      imageWrapper.style.transform = 'translate(-50%, -50%)';
      imageWrapper.style.borderRadius = '100%';
      imageWrapper.style.overflow = 'hidden';

      const fallbackImg = document.createElement('img');
      fallbackImg.src = StoreCategoryToLogoMapper[String(branch.store.categories[0])]
        ? 'assets/shared/stores/store-categories/logo/' + StoreCategoryToLogoMapper[String(branch.store.categories[0])]
        : 'assets/map/icon-store.svg';
      fallbackImg.alt = 'Store';
      fallbackImg.style.width = '24px';
      fallbackImg.style.height = '24px';
      fallbackImg.style.display = 'block';

      imageWrapper.appendChild(fallbackImg);
      container.appendChild(imageWrapper);

      return {
        id: '' + index,
        html: container,
        lat: +branch.location.latitude,
        lng: +branch.location.longitude,
      };
    });
  });
  totalAvailableItems = signal<number>(0);
  selectedCategory = signal<StoreCategory | undefined>(undefined);
  showSearchResults = signal<boolean>(false);
  mapBounds = new Subject<MapBounds>();
  isDesktop = this.deviceDetector.isDesktop();
  queryParams: { [key: string]: string } = {};
  subscriptions = new Subscription();
  latestBounds: MapBounds | undefined = undefined;

  ngOnInit() {
    this.bottomNavigationService.hide();
    this.getLocation();
    this.mapHeaderService.initService();
    this.subOnSearchText();
    this.subOnSelectedCategory();
    this.subscribeOnMapBounds();
  }

  subscribeOnMapBounds(): void {
    this.subscriptions.add(
      this.mapBounds.pipe(debounceTime(1000)).subscribe((res) => {
        this.latestBounds = res;
        this.getBranches();
      }),
    );
  }

  getLocation(): void {
    this.locationService.getGuaranteedLocation(true).subscribe({
      next: (val) => {
        const coordination = val.coordination;
        this.userLocation.set(coordination);
        this.currentLocation.set(coordination);
      },
    });
  }

  onAreaChange($event: MapBounds) {
    this.mapBounds.next($event);
  }

  onPointSelect($event: MapPoint) {
    this.selectedBranch.set(this.branchList()[+$event.id]);
  }

  subOnSelectedCategory() {
    this.subscriptions.add(
      this.mapHeaderService.getSelectedCategory().subscribe((category) => {
        this.selectedCategory.set(category);
        this.getBranches();
      }),
    );
  }

  subOnSearchText(): void {
    this.subscriptions.add(
      this.mapHeaderService.getSearchText().subscribe((text) => {
        this.showSearchResults.set(text.length > 1);
      }),
    );
  }

  goToStoreShop(branch: BranchModel) {
    const store = branch?.store;
    if (store && branch.title) {
      this.currentLocation.set(branch.location);
    }
    this.selectedBranch.set(branch);
  }

  private getBranches() {
    const mapBounds = this.latestBounds;
    const polygon = mapBounds ? (this.mapBoundsToGeoRequest(mapBounds, 'polygon') as GeoQueryPolygonResponse).corners : undefined;
    if (!polygon) return;
    this.loadingBranches.set(true);
    const config: StoreSearchBranchesConfig = {
      size: 100,
      polygon: polygon,
      storeCategories: this.selectedCategory() ? [this.selectedCategory()!.title] : undefined,
    };
    this.storesApiService.searchBranches(config).subscribe((res) => {
      this.branchList.set(res.branches);
      this.totalAvailableItems.set(res.totalElements);
      this.loadingBranches.set(false);
    });
  }

  handleSearchResultBranchSelect(branch: BranchModel): void {
    this.showSearchResults.set(false);
    this.goToStoreShop(branch);
  }

  private mapBoundsToGeoRequest(mapBounds: MapBounds, type: 'polygon' | 'circle'): GeoQueryResponse {
    if (type === 'polygon') {
      return {
        corners: [
          { longitude: mapBounds.west, latitude: mapBounds.south },
          { longitude: mapBounds.east, latitude: mapBounds.south },
          { longitude: mapBounds.east, latitude: mapBounds.north },
          { longitude: mapBounds.west, latitude: mapBounds.north },
        ],
      };
    }
    return {
      center: {
        longitude: mapBounds.circle.center.lng,
        latitude: mapBounds.circle.center.lat,
      },
      radius: mapBounds.circle.radius / 1000,
    };
  }

  handleBackBtn(): void {
    if (this.selectedBranch()?.title) {
      this.resetSelectedBranch();
    } else {
      this.goBack();
    }
  }

  resetSelectedBranch() {
    this.selectedBranch.set(undefined);
    this.currentLocation.set(null);
  }

  goBack() {
    this.backHandler.setCustomBackUrl('stores?mode=onsite');
    this.backHandler.goBack();
  }

  /**
   * Not Used until we find a better way**/
  loadUiApiImageDynamically(imageId: string): void {
    // Dynamically create the UiApiImageComponent
    const componentRef = createComponent(ApiImageComponent, {
      environmentInjector: this.injector,
    });
    // Set the component
    componentRef.setInput('imageId', imageId);
    componentRef.setInput('width', '32px');
    componentRef.setInput('height', '32px');
    componentRef.setInput('showLoading', false);
    componentRef.setInput('showFall', false);
    componentRef.setInput('fallbackImage', 'assets/map/icon-store.svg');
    componentRef.changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.bottomNavigationService.show();
  }
}
