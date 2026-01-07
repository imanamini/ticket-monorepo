import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorePaymentMethod, StoreRestrictionFields, StoresApiService } from '@client-monorepo/stores';
import { ItemInSlider, ServicesOrStoresSliderComponent } from '@client-monorepo/common/ui-components';
import { Restriction, RestrictionTypes, SearchPayloadInterface } from '@client-monorepo/common/network';
import { map } from 'rxjs';
import { AssetTypes, CreditAsset, UserAssetsApiService } from '@client-monorepo/common/user-assets';
import { ActionHandlerService, ActionType } from '@client-monorepo/common/action-handler';
import { FrequentServicesIdEnum } from '@client-monorepo/common/service-data';
import { NgxCalloutComponent } from '@digipay/ngx-callout';

@Component({
  selector: 'stores-applet-credit-stores',
  standalone: true,
  imports: [CommonModule, ServicesOrStoresSliderComponent, NgxCalloutComponent],
  templateUrl: './credit-stores.component.html',
  styleUrl: './credit-stores.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditStoresComponent implements OnInit {
  stores = signal<ItemInSlider[]>([]);
  hasCredits = signal(true);
  creditApiBody = signal<SearchPayloadInterface<StoreRestrictionFields> | undefined>(undefined);

  mode: 'temp' | 'api' = 'temp';
  storesApi = inject(StoresApiService);
  userAssetsApi = inject(UserAssetsApiService);
  actionHandler = inject(ActionHandlerService);

  ngOnInit(): void {
    this.getCreditWallets();
  }

  getCreditWallets(): void {
    this.userAssetsApi
      .getUserAssets()
      .pipe(
        map((res) => res.assets),
        map((assets) => assets.find((a) => a.type === AssetTypes.CREDIT) as CreditAsset),
      )
      .subscribe({
        next: (res: CreditAsset) => {
          if (!(res && res.balance > 0)) {
            this.hasCredits.set(true);
            // this.hasCredits.set(false);
          }
          if (this.mode === 'api') {
            this.createApiBody();
          } else {
            this.getCreditStores();
          }
        },
        error: () => {
          this.hasCredits.set(true);
          // this.hasCredits.set(false);
          if (this.mode === 'api') {
            this.createApiBody();
          } else {
            this.getCreditStores();
          }
        },
      });
  }

  createApiBody(): void {
    const restriction: Restriction<StoreRestrictionFields> = {
      type: RestrictionTypes.COLLECTION,
      field: StoreRestrictionFields.PAYMENT_METHODS,
      operation: 'eq',
      values: [StorePaymentMethod.C_CREDIT],
    };
    this.creditApiBody.set({
      restrictions: [restriction],
      orders: [],
    });
  }

  getCreditStores(): void {
    const restriction: Restriction<StoreRestrictionFields> = {
      type: RestrictionTypes.COLLECTION,
      field: StoreRestrictionFields.PAYMENT_METHODS,
      operation: 'eq',
      values: [StorePaymentMethod.C_CREDIT],
    };
    const body = {
      restrictions: [restriction],
      orders: [],
    };

    this.storesApi
      .searchStores(body, 0, this.ItemPerSlide * 6)
      .pipe(
        map((res) => res.stores),
        map((stores) => {
          let index = 0;
          return stores.map((s) => {
            const item: ItemInSlider = {
              title: s.title,
              image: s.logoImageId,
              url: '/stores/' + s.title,
            };
            if (index >= this.ItemPerSlide) {
              item.isFake = true;
            }
            index++;
            return item;
          });
        }),
      )
      .subscribe({
        next: (stores) => {
          this.stores.set(stores);
        },
      });
  }

  get ItemPerSlide(): number {
    return this.hasCredits() ? 12 : 8;
  }

  removeAllFaked(): void {
    this.stores.set([
      ...this.stores().map((store) => {
        store.isFake = false;
        return store;
      }),
    ]);
  }

  goToCreditPage(): void {
    this.actionHandler.handle({ type: ActionType.GO_TO_SERVICE, payload: { serviceId: FrequentServicesIdEnum.CREDIT } });
  }
}
