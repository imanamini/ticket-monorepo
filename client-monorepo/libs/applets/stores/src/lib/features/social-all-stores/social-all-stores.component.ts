import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { NgxSearchBoxComponent } from '@digipay/ngx-search-box';
import { ItemOverview, ItemOverviewComponent, NoItemComponent } from '@client-monorepo/common/ui-components';
import { Store, StoreRestrictionFields, StoresApiService, StoreSort, StoresService } from '@client-monorepo/stores';
import { OrderTypes, RestrictionTypes, SearchPayloadInterface } from '@client-monorepo/common/network';
import { socialDefaultRestriction, SocialStoreEventPrefix } from '@client-monorepo/social';
import { NgxBottomNavigationService } from '@digipay/ngx-bottom-navigation';
import { DistancePipe } from '@digipay/ng-lib-pipes';
import { ScrolledToEndDirective } from '@client-monorepo/common/utilities';
import { Router } from '@angular/router';
import { BackHandlerService } from '@client-monorepo/back-handler';
import { debounceTime, Subject, Subscription } from 'rxjs';
import { SocialService } from '@client-monorepo/social';

@Component({
  selector: 'stores-applet-social-all-stores',
  standalone: true,
  imports: [CommonModule, NgxAppBarComponent, NgxSearchBoxComponent, ScrolledToEndDirective, ItemOverviewComponent, NoItemComponent],
  providers: [DistancePipe],
  templateUrl: './social-all-stores.component.html',
  styleUrl: './social-all-stores.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialAllStoresComponent implements OnInit, OnDestroy {
  // Injections
  storesApi = inject(StoresApiService);
  storesService = inject(StoresService);
  bottomNavigationService = inject(NgxBottomNavigationService);
  distancePipe = inject(DistancePipe);
  router = inject(Router);
  backHandler = inject(BackHandlerService);
  socialService = inject(SocialService);

  // Variables
  foundText = computed(() => this.totalItemsCount() + ' فروشنده یافت شد');
  trimmedSearchText = computed(() => this.searchText().trim());
  searchText = signal<string>('');
  merchantsToShow = signal<ItemOverview[]>([]);
  merchants = signal<Store[]>([]);
  hasNextPage = signal(false);
  totalItemsCount = signal<number>(0);
  loading = signal(false);
  page = 0;
  pageSize = 12;
  scrollEndSubject = new Subject<void>();
  initialized = signal(false);
  subs = new Subscription();

  ngOnInit(): void {
    this.bottomNavigationService.hide();
    this.getMerchants(false);
    this.initialized.set(false);
    this.subOnScrollEnd();
  }

  subOnScrollEnd(): void {
    this.subs.add(
      this.scrollEndSubject.pipe(debounceTime(300)).subscribe({
        next: () => {
          if (this.initialized() && !this.loading()) {
            this.page += 1;
            this.getMerchants(false);
          }
        },
      }),
    );
  }

  getMerchants(reset = false): void {
    if (this.loading()) return;
    this.loading.set(true);
    if (reset) {
      this.page = 0;
      this.merchants.set([]);
      this.merchantsToShow.set([]);
    }
    const payload: SearchPayloadInterface<StoreRestrictionFields> = {
      restrictions: [socialDefaultRestriction],
      orders: [
        {
          order: OrderTypes.ASC,
          field: StoreSort.PRIORITY,
        },
        { field: 'trackingCode', order: OrderTypes.ASC },
      ],
    };
    if (this.trimmedSearchText() !== '' && this.trimmedSearchText()!.length > 1) {
      payload.restrictions.push({
        type: RestrictionTypes.SIMPLE,
        field: StoreRestrictionFields.KEYWORD,
        value: this.searchText()!,
        operation: 'eq',
      });
    }
    this.storesApi.searchStores(payload, this.page, this.pageSize).subscribe({
      next: (res) => {
        this.hasNextPage.set(this.page < res.totalPages - 1);
        this.totalItemsCount.set(res.totalElements);
        this.merchants.set(res.stores);
        this.merchantsToShow.update((v) => [
          ...(v ?? []),
          ...this.storesService.convertStoreToItemOverView(this.merchants(), this.distancePipe),
        ]);
        this.loading.set(false);
        this.initialized.set(true);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  doSearch(phrase: string): void {
    if (phrase === '' || phrase.trim().length > 1) {
      this.searchText.set(phrase!);
      this.merchants.set([]);
      this.getMerchants(true);
    }
  }

  handleGoToNextPage(): void {
    if (this.hasNextPage()) {
      this.scrollEndSubject.next();
    }
  }

  goBack(): void {
    this.backHandler.goBack();
  }

  handleClickOnStore(trackingCode: string): void {
    this.socialService.sendClickEvent(SocialStoreEventPrefix + trackingCode);
    this.router.navigate(['stores', 'social', 'store', trackingCode]);
  }

  handleSearchWithEnterKey(): void {
    if (this.trimmedSearchText() !== '' && this.trimmedSearchText().length > 1) {
      this.getMerchants(true);
    }
  }

  ngOnDestroy(): void {
    this.bottomNavigationService.show();
    this.subs.unsubscribe();
  }
}
