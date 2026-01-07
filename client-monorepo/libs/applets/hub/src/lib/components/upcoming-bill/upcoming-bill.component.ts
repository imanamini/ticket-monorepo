import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { BillApiService, BillGeneralService, BillPayment } from '@client-monorepo/daily-fintech/bill';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { HorizontalScrollComponent } from '@client-monorepo/common/ui-components';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EventManagementService } from '@client-monorepo/common/event-management';

@Component({
  selector: 'hub-applet-upcoming-bill',
  standalone: true,
  imports: [ApiImageModule, HorizontalScrollComponent, NgxButtonComponent, PipesModule, NgxSkeletonLoadingComponent],
  templateUrl: './upcoming-bill.component.html',
  styleUrl: './upcoming-bill.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.d-none]': '!showComponent()',
    '[class.pt-plus]': 'showComponent()',
  },
})
export class UpcomingBillComponent implements OnInit {
  private billApiService = inject(BillApiService);
  private billService = inject(BillGeneralService);
  destroyRef = inject(DestroyRef);
  private eventManagementService = inject(EventManagementService);

  bills = signal<BillPayment[]>([]);
  showComponent = computed(() => {
    return this.bills() && this.bills().length;
  });

  ngOnInit() {
    this.getUpcomingBills();
  }

  billClick(bill: BillPayment): void {
    this.eventManagementService.triggerEvent({
      eventType: 'click',
      breadCrumbs: ['hub'],
      data: {
        target: `bill: ${bill.payload.billInfo.name}`,
      },
    });
    this.billService.billClick(bill);
  }
  getUpcomingBills(): void {
    this.billApiService
      .getUpcomingBills()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.bills.set(data.paymentList);
        },
        error: () => this.bills.set([]),
      });
  }
}
