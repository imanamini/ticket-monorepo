import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemInSlider, ServicesOrStoresSliderComponent } from '@client-monorepo/common/ui-components';
import { StorePaymentMethod, StoreRestrictionFields, StoresApiService } from '@client-monorepo/stores';
import { Restriction, RestrictionTypes, SearchPayloadInterface } from '@client-monorepo/common/network';
import { map } from 'rxjs';
import { AssetTypes, BnplAsset, UserAssetsApiService } from '@client-monorepo/common/user-assets';
import { ActionHandlerService, ActionType } from '@client-monorepo/common/action-handler';
import { FrequentServicesIdEnum } from '@client-monorepo/common/service-data';
import { NgxCalloutComponent } from '@digipay/ngx-callout';

@Component({
  selector: 'stores-applet-bnpl-stores',
  standalone: true,
  imports: [CommonModule, ServicesOrStoresSliderComponent, NgxCalloutComponent],
  templateUrl: './bnpl-stores.component.html',
  styleUrl: './bnpl-stores.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BnplStoresComponent implements OnInit {
  stores = signal<ItemInSlider[]>([]);
  bnplApiBody = signal<SearchPayloadInterface<StoreRestrictionFields> | undefined>(undefined);
  initialized = signal(false);
  hasBnpl = signal(true);
  mode: 'temp' | 'api' = 'temp';
  storesApi = inject(StoresApiService);
  userAssetsApi = inject(UserAssetsApiService);
  actionHandler = inject(ActionHandlerService);

  ngOnInit(): void {
    this.getBNPLWallets();
  }

  getBNPLWallets(): void {
    this.userAssetsApi
      .getUserAssets()
      .pipe(
        map((res) => res.assets),
        map((assets) => assets.find((a) => a.type === AssetTypes.BNPL) as BnplAsset),
      )
      .subscribe({
        next: (res: BnplAsset) => {
          if (res && res.status === 1) {
            this.hasBnpl.set(true);
            // this.hasBnpl.set(false);
          }
          if (this.mode === 'api') {
            this.createApiBody();
          } else {
            this.getBnplStores();
          }
        },
        error: () => {
          this.hasBnpl.set(true);
          // this.hasBnpl.set(false);
          if (this.mode === 'api') {
            this.createApiBody();
          } else {
            this.getBnplStores();
          }
        },
      });
  }

  createApiBody(): void {
    const restriction: Restriction<StoreRestrictionFields> = {
      type: RestrictionTypes.COLLECTION,
      field: StoreRestrictionFields.PAYMENT_METHODS,
      operation: 'eq',
      values: [StorePaymentMethod.BNPL],
    };
    this.bnplApiBody.set({
      restrictions: [restriction],
      orders: [],
    });
  }

  get ItemPerSlide(): number {
    return this.hasBnpl() ? 12 : 8;
  }

  getBnplStores(): void {
    const restriction: Restriction<StoreRestrictionFields> = {
      type: RestrictionTypes.COLLECTION,
      field: StoreRestrictionFields.PAYMENT_METHODS,
      operation: 'eq',
      values: [StorePaymentMethod.BNPL],
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

  removeAllFaked(): void {
    this.stores.set([
      ...this.stores().map((store) => {
        store.isFake = false;
        return store;
      }),
    ]);
  }

  goToBnblPage(): void {
    this.actionHandler.handle({ type: ActionType.GO_TO_SERVICE, payload: { serviceId: FrequentServicesIdEnum.BNPL } });
  }
}
