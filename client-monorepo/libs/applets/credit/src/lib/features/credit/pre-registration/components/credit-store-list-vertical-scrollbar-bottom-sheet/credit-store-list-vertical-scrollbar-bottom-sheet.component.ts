import { ChangeDetectionStrategy, Component, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { StoresDataService } from '../credit-store-list/stores-data.service';
import { SERVICE_TYPE } from '../../../data-access/models/credit/service-type/service-type.model';
import { STORE_PROVIDERS } from '../../../data-access/models/credit/store/store-providers';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxBottomSheetHeaderComponent, NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';
import { Subscription } from 'rxjs';
import { CreditStoreCardComponent } from '../credit-store-list/credit-store-card/credit-store-card.component';

@Component({
  selector: 'app-credit-store-list-bottom-sheet',
  templateUrl: './credit-store-list-vertical-scrollbar-bottom-sheet.component.html',
  styleUrls: ['./credit-store-list-vertical-scrollbar-bottom-sheet.component.scss'],
  imports: [NgxButtonComponent, NgxTrackableIdDirective, NgxBottomSheetHeaderComponent, CreditStoreCardComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditStoreListVerticalScrollbarBottomSheetComponent implements OnInit, OnDestroy {
  page = 0;
  storesSubscription: Subscription | null = null;

  pageSize = input(24);

  data = signal<{ serviceType: SERVICE_TYPE } | null>(null);

  storesList = signal<any[]>([]);
  showLoading = signal<boolean>(true);

  private bottomSheetService = inject(NgxBottomSheetService);
  private storesDataService = inject(StoresDataService);

  ngOnInit(): void {
    this.data.set(this.bottomSheetService.data());
    this.setFilterStore();
    this.loadStores();
  }

  private setFilterStore() {
    const serviceType = this.data()?.serviceType;
    if (serviceType === SERVICE_TYPE.BNPL) {
      this.storesDataService.setSelectedProvider(STORE_PROVIDERS.BNPL);
    } else {
      this.storesDataService.setSelectedProvider(STORE_PROVIDERS.C_CREDIT);
    }
  }

  private async loadStores() {
    try {
      const stores = await this.storesDataService.getStoresList(this.page, this.pageSize());
      this.storesList.set(stores);
      this.showLoading.set(false);
    } catch (error) {
      console.error('Error loading stores:', error);
    }
  }

  onScroll(event: any) {
    const scrollThreshold = 100;
    const scrollableElement = event.target;
    if (scrollableElement.scrollTop + scrollableElement.clientHeight + scrollThreshold >= scrollableElement.scrollHeight) {
      this.loadMore();
    }
  }

  async loadMore() {
    if (this.page * this.pageSize() >= this.storesList().length) {
      return; // Avoid loading more if all data is already fetched
    }
    this.page++;
    try {
      const newStores = await this.storesDataService.getStoresList(this.page, this.pageSize());
      this.storesList.update((stores) => [...stores, ...newStores]);
    } catch (error) {
      console.error('Error loading more stores:', error);
    }
  }

  onClose(): void {
    this.bottomSheetService.closeBottomSheet();
  }

  ngOnDestroy(): void {
    if (this.storesSubscription) {
      this.storesSubscription.unsubscribe();
    }
  }
}
