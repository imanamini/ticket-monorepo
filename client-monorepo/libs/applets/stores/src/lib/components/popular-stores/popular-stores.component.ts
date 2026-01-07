import { ChangeDetectionStrategy, Component, computed, inject, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemOverview, ItemOverviewComponent, TitleSummaryComponent } from '@client-monorepo/common/ui-components';
import { rangeCreator } from '@client-monorepo/common/utilities';
import { Store, StoresApiService, StoresService } from '@client-monorepo/stores';
import { DistancePipe } from '@digipay/ng-lib-pipes';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';

@Component({
  selector: 'stores-applet-popular-stores',
  standalone: true,
  imports: [CommonModule, TitleSummaryComponent, ItemOverviewComponent, NgxSkeletonLoadingComponent],
  providers: [DistancePipe],
  templateUrl: './popular-stores.component.html',
  styleUrl: './popular-stores.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopularStoresComponent implements OnInit {
  rangeCreator = rangeCreator;
  distancePipe = inject(DistancePipe);
  storeApiService = inject(StoresApiService);
  storesService = inject(StoresService);
  isLoading = signal(false);
  stores = signal<Store[]>([]);
  popularStores = computed<ItemOverview[]>(() => this.storesService.convertStoreToItemOverView(this.stores(), this.distancePipe));
  itemClicked = output<Store>();

  ngOnInit() {
    this.getPopularStores();
  }

  getPopularStores(): void {
    this.isLoading.set(true);
    this.storeApiService.getPopularStores(0, 10).subscribe({
      next: (result) => {
        this.stores.set(result);
        this.isLoading.set(false);
      },
    });
  }

  handleItemClick(item: ItemOverview): void {
    this.itemClicked.emit(this.stores().filter((store) => store.trackingCode === item.id)[0]);
  }
}
