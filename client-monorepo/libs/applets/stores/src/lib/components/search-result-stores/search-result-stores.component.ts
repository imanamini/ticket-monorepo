import { ChangeDetectionStrategy, Component, effect, inject, input, OnDestroy, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemOverview, ItemOverviewComponent, TitleSummaryComponent } from '@client-monorepo/common/ui-components';
import { Store, StoreRestrictionFields, StoresApiService, StoreSort, StoresService } from '@client-monorepo/stores';
import { rangeCreator } from '@client-monorepo/common/utilities';
import { DistancePipe } from '@digipay/ng-lib-pipes';
import { OrderTypes, RestrictionTypes, SearchPayloadInterface } from '@client-monorepo/common/network';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { ButtonIcon, NgxButtonComponent } from '@digipay/ngx-button';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'stores-applet-search-result-stores',
  standalone: true,
  imports: [CommonModule, ItemOverviewComponent, TitleSummaryComponent, NgxSkeletonLoadingComponent, NgxButtonComponent],
  providers: [DistancePipe],
  templateUrl: './search-result-stores.component.html',
  styleUrl: './search-result-stores.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchResultStoresComponent implements OnDestroy {
  protected readonly rangeCreator = rangeCreator;
  // Injections
  storesService = inject(StoresService);
  storeApi = inject(StoresApiService);
  distancePipe = inject(DistancePipe);
  router = inject(Router);

  // Inputs
  searchText = input.required<string>();

  // Outputs
  onEmpty = output<void>();
  searched = output<boolean>();

  // Variables
  searching = signal<boolean>(true);
  stores = signal<Store[]>([]);
  subscriptions = new Subscription();
  storesToShow = signal<ItemOverview[]>([]);
  paginationInitialized = signal(false);
  pageSize = 5;
  page = 0;
  hasNextPage = signal(false);
  buttonIcon: ButtonIcon = {
    name: 'arrow-2-down',
    type: 'linear',
  };

  constructor() {
    effect(() => {
      if (!this.stores().length && !this.searching()) {
        this.onEmpty.emit();
      }
    });
    effect(
      () => {
        if (this.searchText()) {
          this.searchStores();
        }
      },
      { allowSignalWrites: true },
    );
  }

  searchStores(): void {
    if (this.searchText() && this.searchText().length > 1) {
      this.searching.set(true);
      this.searched.emit(false);
      const storesPayload: SearchPayloadInterface<StoreRestrictionFields> = {
        restrictions: [
          {
            type: RestrictionTypes.SIMPLE,
            field: StoreRestrictionFields.KEYWORD,
            value: this.searchText(),
            operation: 'eq',
          },
        ],
        orders: [
          {
            order: OrderTypes.ASC,
            field: StoreSort.PRIORITY,
          },
          { field: 'trackingCode', order: OrderTypes.ASC },
        ],
      };

      const sub = this.storeApi.searchStores(storesPayload, this.page, this.pageSize).subscribe({
        next: (res) => {
          this.hasNextPage.set(res.stores.length ? res.totalPages - 1 > this.page : false);
          this.stores.set(res.stores);
          this.storesToShow.update((v) => this.handleConvertedStores(v));
          this.paginationInitialized.set(true);
        },
        complete: () => {
          this.searched.emit(true);
          this.searching.set(false);
        },
      });
      this.subscriptions.add(sub);
    }
  }

  handleConvertedStores(previous: ItemOverview[]): ItemOverview[] {
    const news = this.storesService.convertStoreToItemOverView(this.stores(), this.distancePipe);
    const all = [...previous, ...news];
    return all.length
      ? all.map((item, index) => {
          item = { ...item, divider: index !== all.length - 1 };
          return item;
        })
      : [];
  }

  handleStoreClick(trackingCode: string) {
    this.router.navigate([`/stores/${trackingCode}`]);
  }

  handleStoreNextPage(): void {
    this.page++;
    this.searchStores();
  }

  ngOnDestroy(): void {
    if (this.subscriptions) this.subscriptions.unsubscribe();
  }
}
