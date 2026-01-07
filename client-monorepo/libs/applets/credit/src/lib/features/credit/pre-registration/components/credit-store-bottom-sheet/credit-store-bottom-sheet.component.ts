import { ChangeDetectionStrategy, Component, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { StoresDataService } from '../credit-store-list/stores-data.service';
import { SERVICE_TYPE } from '../../../data-access/models/credit/service-type/service-type.model';
import { STORE_PROVIDERS } from '../../../data-access/models/credit/store/store-providers';
import { CreditStoreListComponent } from '../credit-store-list/credit-store-list.component';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxIcon } from '@digipay/ngx-icon';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { Subscription } from 'rxjs';
import { CreditStoreListVerticalScrollbarBottomSheetComponent } from '../credit-store-list-vertical-scrollbar-bottom-sheet/credit-store-list-vertical-scrollbar-bottom-sheet.component';

@Component({
  selector: 'app-credit-store-bottom-sheet',
  templateUrl: './credit-store-bottom-sheet.component.html',
  styleUrls: ['./credit-store-bottom-sheet.component.scss'],
  imports: [CreditStoreListComponent, NgxButtonComponent, NgxIcon, NgxTrackableIdDirective, NgxSkeletonLoadingComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditStoreBottomSheetComponent implements OnInit, OnDestroy {
  data = signal<{ serviceType: SERVICE_TYPE } | null>(null);
  storesList = signal<any[]>([]);
  showLoading = signal<boolean>(true);
  page = 0;
  pageSize = input(24);
  slides = input(1);
  itemsPerSlide = input(8);
  hideButtons = input(false);
  columnCount = input(4);
  serviceType = input<SERVICE_TYPE | null>(null);
  showDots = input<boolean>(true);
  showMoreButton = input<boolean>(false);
  protected readonly ServiceType = signal(SERVICE_TYPE);
  private bottomSheetService = inject(NgxBottomSheetService);
  private storesDataService = inject(StoresDataService);
  private storesSubscription: Subscription | null = null;

  ngOnInit(): void {
    this.data.set(this.bottomSheetService.data());
    this.setFilterStore();
    this.loadStores();
  }

  private setFilterStore() {
    const serviceType = this.data()?.serviceType ?? this.serviceType();
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

  onConfirm(): void {
    this.bottomSheetService.outputData.set(true);
    this.close();
  }

  close() {
    this.bottomSheetService.closeBottomSheet();
  }

  ngOnDestroy(): void {
    if (this.storesSubscription) {
      this.storesSubscription.unsubscribe();
    }
  }

  showAllStoresBottomSheet() {
    this.bottomSheetService.openBottomSheet(
      CreditStoreListVerticalScrollbarBottomSheetComponent,
      {
        serviceType: this.serviceType(),
      },
      { noPadding: true, disableClose: true },
    );
  }
}
