import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSearchBoxComponent } from '@digipay/ngx-search-box';
import {
  ItemOverview,
  ItemOverviewComponent,
  NoItemComponent,
  TitleSummaryComponent,
} from '@client-monorepo/common/ui-components';
import { Store, StoreCategoryTitle, StoreCategoryTitleMapper, StoreRestrictionFields, StoresApiService } from '@client-monorepo/stores';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { rangeCreator, ScrolledToEndDirective } from '@client-monorepo/common/utilities';
import { Restriction, RestrictionTypes, SearchPayloadInterface } from '@client-monorepo/common/network';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { ViolationService } from '../../data-access/services/violation.service';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { ViolationBottomSheetItemsMapper } from '../../data-access/constants/violation.const';
import { ServiceImagesType } from '@client-monorepo/common/service-data';

@Component({
  selector: 'stores-applet-violation-stores',
  standalone: true,
  imports: [
    CommonModule,
    NgxSearchBoxComponent,
    TitleSummaryComponent,
    ItemOverviewComponent,
    PipesModule,
    ScrolledToEndDirective,
    NoItemComponent,
    NgxButtonComponent,
  ],
  templateUrl: './violation-stores.component.html',
  styleUrl: './violation-stores.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViolationStoresComponent implements OnInit {
  // Injections
  storesApi = inject(StoresApiService);
  violationService = inject(ViolationService);
  bottomSheetService = inject(NgxBottomSheetService);
  destroyRef = inject(DestroyRef);

  // Variables
  protected readonly rangeCreator = rangeCreator;
  searchText = signal<string>('');
  stores = signal<Store[]>([]);
  storesToShow = signal<ItemOverview[]>([]);
  storesLoading = signal(false);
  selectedStore = signal<ItemOverview | undefined>(undefined);

  page = 0;
  pageSize = 20;
  haveNextPage = true;

  ngOnInit(): void {
    this.getAllStores();
  }

  getAllStores(reset = false, phrase?: string): void {
    if (this.storesLoading()) return;
    this.storesLoading.set(true);
    if (reset) {
      this.page = 0;
      this.stores.set([]);
    }
    const restrictions: Restriction<StoreRestrictionFields>[] = [];
    if (phrase && phrase.trim().length > 1) {
      restrictions.push({
        type: RestrictionTypes.SIMPLE,
        field: StoreRestrictionFields.KEYWORD,
        value: phrase,
        operation: 'eq',
      });
    }
    const payload: SearchPayloadInterface<StoreRestrictionFields> = {
      restrictions,
      orders: [],
      page: this.page,
      size: this.pageSize,
    };
    this.storesApi.getAllStores(payload).subscribe({
      next: (res) => {
        this.stores.update((v) => [...v, ...res]);
        this.convertStoreToItem(res, reset);
        this.haveNextPage = res.length >= this.pageSize;
        this.storesLoading.set(false);
      },
    });
  }

  handleStoreSelect(store: ItemOverview): void {
    this.selectedStore.set(store);
  }

  convertStoreToItem(stores: Store[], reset = false): void {
    if (reset) this.storesToShow.set([]);
    const newOnes = stores.map((store, index) => {
      return {
        id: store.trackingCode,
        image: { type: ServiceImagesType.IMAGE_ID, name: store.logoImageId },
        title: store.title,
        subTitleNormal: StoreCategoryTitleMapper[store.categories[0] as StoreCategoryTitle],
        divider: index !== stores.length - 1,
      };
    });
    this.storesToShow.update((v) => [...v, ...newOnes]);
  }

  doSearch(phrase: string) {
    this.getAllStores(true, phrase);
  }

  handleNextPage(): void {
    if (!this.haveNextPage || this.storesLoading()) return;
    this.page++;
    this.getAllStores(false, this.searchText());
  }

  handleContinueClick(): void {
    if (!this.selectedStore()) return;
    const store = this.stores().filter((store) => store.trackingCode === this.selectedStore()!.id)[0];
    this.violationService.store.set(store);
    if (store.types.length === 1) {
      this.violationService.paymentMethod.set(store.types[0]);
      this.violationService.nextStep();
    } else {
      this.showBottomSheet();
    }
  }

  showBottomSheet(): void {
    const items = this.violationService.store()?.types?.map((type) => ViolationBottomSheetItemsMapper[type]);
    this.violationService.showBottomSheet(items, 'روش مراجعه');
  }
}
