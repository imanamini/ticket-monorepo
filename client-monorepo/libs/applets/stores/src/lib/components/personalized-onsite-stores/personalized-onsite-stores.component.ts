import { ChangeDetectionStrategy, Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Store,
  StoreCategory,
  StoreCategoryTitle,
  StorePreviewComponent,
  StoreRestrictionFields,
  StoresApiService,
  StoreType,
} from '@client-monorepo/stores';
import { HorizontalScrollComponent, TitleSummaryComponent } from '@client-monorepo/common/ui-components';
import { OrderTypes, RestrictionTypes, SearchPayloadInterface } from '@client-monorepo/common/network';
import { Router } from '@angular/router';
import { rangeCreator } from '@client-monorepo/common/utilities';
import { LocationService } from '@client-monorepo/common/location-management';
import { StoreCategoriesFilterComponent } from '@client-monorepo/store-categories-filter';

@Component({
  selector: 'stores-applet-personalized-onsite-stores',
  standalone: true,
  imports: [CommonModule, StorePreviewComponent, TitleSummaryComponent, HorizontalScrollComponent, StoreCategoriesFilterComponent],
  templateUrl: './personalized-onsite-stores.component.html',
  styleUrl: './personalized-onsite-stores.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalizedOnsiteStoresComponent implements OnInit {
  stores = signal<Array<Array<Store | undefined>>>([]);
  selectedCategory = signal<StoreCategory | undefined>(undefined);
  scrollComponent = viewChild<HorizontalScrollComponent>('scrollComponent');
  storesApi = inject(StoresApiService);
  router = inject(Router);
  locationService = inject(LocationService);

  ngOnInit(): void {
    this.locationService.getGuaranteedLocation(true, 3600 * 1000, 2000, 60 * 1000).subscribe(() => {
      this.getPersonalizedStores();
    });
  }

  getPersonalizedStores(): void {
    this.stores.set([]);
    const payload: SearchPayloadInterface<StoreRestrictionFields> = {
      restrictions: [
        {
          type: RestrictionTypes.COLLECTION,
          values: [StoreType.ONSITE],
          field: StoreRestrictionFields.STORE_TYPE,
        },
      ],
      orders: [
        {
          field: 'distance',
          order: OrderTypes.ASC,
        },
      ],
    };
    if (this.selectedCategory()) {
      const oldCategoryIndex = payload.restrictions.findIndex((r) => r.field === StoreRestrictionFields.CATEGORIES);
      if (oldCategoryIndex !== -1) {
        payload.restrictions.splice(oldCategoryIndex, 1);
      }

      payload.restrictions.push({
        type: RestrictionTypes.COLLECTION,
        values: [StoreCategoryTitle[this.selectedCategory()!.title]],
        field: StoreRestrictionFields.CATEGORIES,
      });
    }
    this.storesApi.getAllStores(payload).subscribe((stores) => {
      this.chunkStores(stores);
    });
  }

  chunkStores(stores: Store[]): void {
    const grouped: Array<Array<Store | undefined>> = [];
    for (let i = 0; i < stores.length; i += 2) {
      grouped.push([stores[i], stores.length === i + 1 ? undefined : stores[i + 1]]);
    }
    this.stores.set(grouped);
    this.scrollComponent()!.scrollToStart('instant');
  }

  changeCategory(category: StoreCategory | undefined = undefined): void {
    this.selectedCategory.set(category);
    this.getPersonalizedStores();
  }

  goToStorePage(trackingCode: string | undefined): void {
    if (!trackingCode) {
      return;
    }
    this.router.navigate(['/stores', trackingCode]);
  }

  protected readonly rangeCreator = rangeCreator;
}
