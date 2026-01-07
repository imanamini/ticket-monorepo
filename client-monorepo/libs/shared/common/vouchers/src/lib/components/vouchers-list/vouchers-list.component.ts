import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoItemComponent, PageLayoutComponent, SearchComponent } from '@client-monorepo/common/ui-components';
import { normalizeSearchText, rangeCreator, ScrolledToEndDirective } from '@client-monorepo/common/utilities';
import { Voucher } from '../../data-access/models/voucher.model';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { BackHandlerService } from '@client-monorepo/back-handler';
import { NgxBottomNavigationService } from '@digipay/ngx-bottom-navigation';
import { VoucherCardComponent } from '../voucher-card/voucher-card.component';
import { StoreCategory, StoresApiService } from '@client-monorepo/stores';
import { StoreCategoriesFilterComponent } from '@client-monorepo/store-categories-filter';
import { isInitialized } from '@sentry/angular-ivy';
import { Router } from '@angular/router';
import { VoucherDetailBottomSheetComponent } from '../voucher-detail-bottom-sheet/voucher-detail-bottom-sheet.component';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';

@Component({
  selector: 'common-vouchers-vouchers-list',
  standalone: true,
  imports: [
    CommonModule,
    PageLayoutComponent,
    SearchComponent,
    ScrolledToEndDirective,
    NgxSkeletonLoadingComponent,
    NoItemComponent,
    VoucherCardComponent,
    StoreCategoriesFilterComponent,
  ],
  templateUrl: './vouchers-list.component.html',
  styleUrl: './vouchers-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VouchersListComponent implements OnInit, OnDestroy {
  protected readonly rangeCreator = rangeCreator;
  backHandler = inject(BackHandlerService);
  bottomNavigationService = inject(NgxBottomNavigationService);
  storeApi = inject(StoresApiService);
  bottomSheetService = inject(NgxBottomSheetService);
  router = inject(Router);
  searchText = signal<string | undefined>(undefined);
  initialized = signal<boolean>(false);
  vouchers = signal<Voucher[]>([]);
  vouchersLoading = signal<boolean>(false);
  selectedCategory = signal<StoreCategory | undefined>(undefined);
  page = 0;
  size = 20;
  haveNextPage = true;

  ngOnInit(): void {
    this.bottomNavigationService.hide();
    this.searchVouchers();
  }

  private searchVouchers(reset = false): void {
    if (this.vouchersLoading()) return;
    if (reset) this.vouchers.set([]);
    this.vouchersLoading.set(true);
    this.storeApi
      .searchVouchers(this.page, this.size, 'store-summary', true, undefined, this.selectedCategory(), this.searchText())
      .subscribe({
        next: (res) => {
          if (res) {
            this.vouchers.update((vouchers) => [...vouchers, ...(res.vouchers as Voucher[])]);
          } else {
            this.vouchers.set([]);
          }
          this.initialized.set(true);
          this.vouchersLoading.set(false);
          this.haveNextPage = res.totalElements > this.vouchers().length;
        },
        error: (err) => {
          this.initialized.set(true);
          this.vouchersLoading.set(false);
          if (err instanceof Error) {
            console.error('searchVouchers failed', err);
          } else {
            console.error('searchVouchers failed with non-error', err);
          }
        },
      });
  }

  changeCategory(category: StoreCategory | undefined = undefined): void {
    this.selectedCategory.set(category);
    if (isInitialized()) {
      this.searchVouchers(true);
    }
  }

  doSearch(query: string | undefined): void {
    this.searchText.set(normalizeSearchText(query));
    if (this.initialized()) {
      this.searchVouchers(true);
    }
  }

  listEnded(): void {
    if (this.haveNextPage && this.initialized() && this.vouchers().length > 0) {
      this.page++;
      this.searchVouchers();
    }
  }

  openVoucherBottomSheet(voucher: Voucher) {
    this.bottomSheetService.openBottomSheet(
      VoucherDetailBottomSheetComponent,
      { voucher },
      {
        noPadding: true,
      },
    );
  }
  goBack(): void {
    this.backHandler.goBack();
  }

  ngOnDestroy(): void {
    this.bottomNavigationService.show();
  }
}
