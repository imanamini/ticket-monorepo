import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoresApiService } from '../../data-access/services/stores-api.service';
import { HorizontalScrollComponent, TitleSummaryComponent } from '@client-monorepo/common/ui-components';
import { Router, RouterLink } from '@angular/router';
import { RestrictionTypes, SearchPayloadInterface } from '@client-monorepo/common/network';
import { StorePreviewComponent } from '../store-preview/store-preview.component';
import { Store, StoreCategoryTitle, StoreCategoryTitleMapper, StoreType, StoreTypeMapper } from '../../data-access/models/store.type';
import { StoreRestrictionFields } from '../../data-access/constants/stores.const';

@Component({
  selector: 'common-stores-category-stores',
  standalone: true,
  imports: [CommonModule, HorizontalScrollComponent, TitleSummaryComponent, RouterLink, StorePreviewComponent],
  templateUrl: './category-stores.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryStoresComponent implements OnInit {
  category = input<StoreCategoryTitle>();
  storeType = input<StoreType>();
  searchKeyword = input<string>();
  stores = signal<Store[] | undefined>(undefined);
  storeApiService = inject(StoresApiService);
  router = inject(Router);
  sectionTitle = computed(() => this.decideForTitle());
  title = input<string>('');

  ngOnInit(): void {
    this.getStores();
  }

  getStores(): void {
    const body = this.makeApiBody();
    this.storeApiService.searchStores(body).subscribe({
      next: (res) => {
        this.stores.set(res.stores);
      },
    });
  }

  decideForTitle(): string {
    if (this.title()) {
      return this.title();
    }
    const category = this.category();
    if (category) {
      let tempTitle = '';
      if (this.storeType() === StoreType.ONSITE) {
        tempTitle += 'فروشگاه‌های حضوری ';
      }
      return tempTitle + StoreCategoryTitleMapper[category];
    }
    return 'فروشگاه‌های ' + StoreTypeMapper[this.storeType() ?? StoreType.ONSITE];
  }

  makeApiBody(): SearchPayloadInterface<StoreRestrictionFields> {
    const body: SearchPayloadInterface<StoreRestrictionFields> = {
      restrictions: [],
      orders: [],
    };
    if (this.category()) {
      body.restrictions = [
        {
          field: StoreRestrictionFields.CATEGORIES,
          type: RestrictionTypes.COLLECTION,
          operation: 'eq',
          values: [this.category() as string],
        },
      ];
    }

    if (this.storeType() !== undefined) {
      body.restrictions = [
        ...body.restrictions,
        {
          field: StoreRestrictionFields.STORE_TYPE,
          values: [this.storeType() ?? 0],
          type: RestrictionTypes.COLLECTION,
          operation: 'eq',
        },
      ];
    }

    if (this.searchKeyword()) {
      body.restrictions = [
        ...body.restrictions,
        {
          field: StoreRestrictionFields.KEYWORD,
          value: this.searchKeyword() as string,
          type: RestrictionTypes.SIMPLE,
          operation: 'eq',
        },
      ];
    }

    return body;
  }

  gotoFiltersBasedOnCategory(): void {
    const queryParams: { [key: string]: string | number } = {};
    const category = this.category();
    const type = this.storeType();
    if (category) {
      queryParams['categories'] = category;
    }
    if (type !== undefined) {
      queryParams['types'] = type;
    }
    this.router.navigate(['/stores/all-stores'], { queryParams }).then();
  }
}
