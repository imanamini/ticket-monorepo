import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemOverview, ItemOverviewComponent, TitleSummaryComponent } from '@client-monorepo/common/ui-components';
import { OrderTypes, RestrictionTypes, SearchPayloadInterface } from '@client-monorepo/common/network';
import { Store, StoreRestrictionFields, StoresApiService, StoreSort, StoresService } from '@client-monorepo/stores';
import { ButtonIcon, NgxButtonComponent } from '@digipay/ngx-button';
import { DistancePipe } from '@digipay/ng-lib-pipes';
import { Router } from '@angular/router';
import { socialDefaultRestriction, SocialService, SocialStoreEventPrefix } from '@client-monorepo/social';

@Component({
  selector: 'stores-applet-social-search-result-stores',
  standalone: true,
  imports: [CommonModule, TitleSummaryComponent, ItemOverviewComponent, NgxButtonComponent],
  providers: [DistancePipe],
  templateUrl: './social-search-result-stores.component.html',
  styleUrl: './social-search-result-stores.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialSearchResultStoresComponent {
  // Injections
  storesApi = inject(StoresApiService);
  storesService = inject(StoresService);
  distancePipe = inject(DistancePipe);
  router = inject(Router);
  socialService = inject(SocialService);

  // Inputs
  searchText = input('');

  // Outputs
  onEmpty = output<void>();

  // variables
  searching = signal<boolean>(true);
  merchants = signal<Store[]>([]);
  initialized = signal(false);
  merchantsToShow = signal<ItemOverview[]>([]);
  showMoreBtn = computed(() => this.hasNextPage() && !this.searching() && this.initialized());
  hasNextPage = signal(true);
  page = 0;
  pageSize = 5;
  buttonIcon: ButtonIcon = {
    name: 'arrow-2-down',
    type: 'linear',
  };

  constructor() {
    effect(() => {
      if (this.initialized() && !this.merchants().length && !this.searching() && this.page === 0) {
        this.onEmpty.emit();
      }
    });
    effect(
      () => {
        if (this.searchText()) {
          this.searchMerchants();
        }
      },
      { allowSignalWrites: true },
    );
  }

  searchMerchants(): void {
    if (this.searchText() && this.searchText().length > 1) {
      this.searching.set(true);
      const payload: SearchPayloadInterface<StoreRestrictionFields> = {
        restrictions: [
          socialDefaultRestriction,
          {
            field: StoreRestrictionFields.KEYWORD,
            value: this.searchText(),
            type: RestrictionTypes.SIMPLE,
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
      this.storesApi.searchStores(payload, this.page, this.pageSize).subscribe({
        next: (res) => {
          this.hasNextPage.set(this.page < res.totalPages - 1);
          this.merchants.set(res.stores);
          this.merchantsToShow.update((v) => [
            ...(v ?? []),
            ...this.storesService.convertStoreToItemOverView(this.merchants(), this.distancePipe),
          ]);
        },
        complete: () => {
          this.searching.set(false);
          this.initialized.set(true);
        },
      });
    }
  }

  handleMerchantClick(id: string) {
    this.socialService.sendClickEvent(SocialStoreEventPrefix + id);
    this.router.navigate(['/stores/social/store/' + id]);
  }

  handleStoreNextPage(): void {
    this.page++;
    this.searchMerchants();
  }

  goToAllSocials(): void {
    this.router.navigate(['/stores/social/all-merchants']);
  }

  protected readonly socialDefaultRestriction = socialDefaultRestriction;
}
