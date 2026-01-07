import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TransactionApiResponse,
  TransactionCard,
  TransactionCardComponent,
  TransactionCardService,
  TransactionsApiService,
} from '@client-monorepo/payment/transactions';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { Observable, zip } from 'rxjs';
import { AppNameService, rangeCreator } from '@client-monorepo/common/utilities';
import { BillApiResponse, BillApiService } from '@client-monorepo/daily-fintech/bill';

@Component({
  selector: 'transactions-applet-upcoming-transactions',
  standalone: true,
  imports: [CommonModule, NgxSkeletonLoadingComponent, TransactionCardComponent],
  templateUrl: './upcoming-transactions.component.html',
  styleUrl: './upcoming-transactions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpcomingTransactionsComponent implements OnInit {
  transactions = signal<TransactionCard[]>([]);
  transactionCardService = inject(TransactionCardService);
  transactionApi = inject(TransactionsApiService);
  billApi = inject(BillApiService);
  appNameService = inject(AppNameService);
  isLoading = signal(true);
  rangeCreator = rangeCreator;

  ngOnInit(): void {
    this.getUpcomingTransactions();
  }

  getUpcomingTransactions(): void {
    this.isLoading.set(true);
    if (this.appNameService.isPillar()) {
      this.getUpcomingInstallmentTransactions().subscribe({
        next: (installments) => {
          this.transactions.set(
            this.transactionCardService.mapUpcomingInstallmentTransactionsToTransactionCards(
              installments.paymentList,
              'details',
            ),
          );
          this.isLoading.set(false);
        },
      });
    } else {
      zip([this.getUpcomingInstallmentTransactions(), this.getUpcomingBill()]).subscribe({
        next: ([installments, bills]) => {
          this.transactions.set(
            this.transactionCardService
              .mapUpcomingInstallmentTransactionsToTransactionCards(installments.paymentList, 'details')
              .concat(
                this.transactionCardService.mapUpcomingBillTransactionsToTransactionCards(
                  bills.paymentList,
                  'details',
                ),
              ),
          );
          this.isLoading.set(false);
        },
      });
    }
  }

  getUpcomingInstallmentTransactions(): Observable<TransactionApiResponse> {
    return this.transactionApi.getUpcomingInstallmentTransactions();
  }

  getUpcomingBill(): Observable<BillApiResponse> {
    return this.billApi.getUpcomingBills();
  }
}
