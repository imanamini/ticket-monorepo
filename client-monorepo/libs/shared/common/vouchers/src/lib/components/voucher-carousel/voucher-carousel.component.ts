import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HorizontalScrollComponent } from '@client-monorepo/common/ui-components';
import { VoucherCardComponent } from '../voucher-card/voucher-card.component';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { Voucher } from '../../data-access/models/voucher.model';
import { StoresApiService } from '@client-monorepo/stores';
import { PerformanceTierService, rangeCreator } from '@client-monorepo/common/utilities';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { VoucherDetailBottomSheetComponent } from '../voucher-detail-bottom-sheet/voucher-detail-bottom-sheet.component';
import { EventManagementService } from '@client-monorepo/common/event-management';

@Component({
  selector: 'common-vouchers-voucher-carousel',
  standalone: true,
  imports: [CommonModule, HorizontalScrollComponent, VoucherCardComponent, NgxButtonComponent, NgxSkeletonLoadingComponent],
  templateUrl: './voucher-carousel.component.html',
  styleUrl: './voucher-carousel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VoucherCarouselComponent implements OnInit {
  protected readonly rangeCreator = rangeCreator;
  storesApi = inject(StoresApiService);
  router = inject(Router);
  bottomSheetService = inject(NgxBottomSheetService);
  wrapperClasses = input<string[]>([]);
  inputVouchers = input<Voucher[] | undefined>(undefined);
  vouchers = signal<Voucher[]>([]);
  computedVouchers = computed(() => this.inputVouchers() ?? this.vouchers());
  isLoading = signal(true);
  nothingToShow = output<boolean>();
  bgMode = input<'surface-elevated' | 'surface-back'>('surface-elevated');
  processedWrapperClasses = computed(() => this.wrapperClasses().join(' '));
  routeUrl = '';
  activatedRoute = inject(ActivatedRoute);

  eventManager = inject(EventManagementService);
  performanceTierService = inject(PerformanceTierService);
  loadingEffect = computed(() => this.performanceTierService.tier() !== 'low');

  ngOnInit(): void {
    if (this.inputVouchers()) {
      this.isLoading.set(false);
    } else {
      this.getVouchers();
    }
    this.computeUrl();
  }

  getVouchers(): void {
    this.isLoading.set(true);
    this.storesApi.searchVouchers(0, 10, 'store-summary', true).subscribe({
      next: (res) => {
        if (res.vouchers.length > 0) {
          this.vouchers.set(res.vouchers);
        } else {
          this.nothingToShow.emit(true);
        }
      },
      error: (err) => {
        if (err instanceof Error) {
          console.error('getVouchers failed', err);
        } else {
          console.error('getVouchers failed with non-error', err);
        }
        this.nothingToShow.emit(true);
      },
      complete: () => {
        this.isLoading.set(false);
      },
    });
  }

  handleShowAll(): void {
    this.router.navigate(['stores', 'all-vouchers']).then();
  }

  openVoucherBottomSheet(voucher: Voucher) {
    this.bottomSheetService.openBottomSheet(
      VoucherDetailBottomSheetComponent,
      { voucher },
      {
        noPadding: true,
      },
    );
    this.sendOpenBottomSheetEvent();
  }

  sendOpenBottomSheetEvent(): void {
    this.eventManager.triggerEvent({
      eventType: 'click',
      data: {
        target: 'voucher-' + this.routeUrl,
      },
    });
  }

  computeUrl(): void {
    const url = this.activatedRoute.snapshot.queryParamMap.get('mode');
    if (url) {
      this.routeUrl = 'stores';
    } else {
      this.routeUrl = 'store-details';
    }
  }
}
