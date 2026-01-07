import { ChangeDetectionStrategy, Component, HostBinding, inject, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleSummaryComponent } from '@client-monorepo/common/ui-components';
import { PipesModule } from '@digipay/ng-lib-pipes';

import { BillApiResponse, BillApiService } from '@client-monorepo/daily-fintech/bill';
import { Observable, of, zip } from 'rxjs';
import { TransactionCardsComponent } from '../transaction-cards/transaction-cards.component';
import { TransactionCard } from '../../data-access/models/transaction-card';
import { TransactionCardService } from '../../data-access/services/transaction-card.service';
import { TransactionsApiService } from '../../data-access/services/transactions-api.service';
import { TransactionApiResponse } from '../../data-access/models/transaction-api.interface';

@Component({
  selector: 'payment-transactions-upcoming-transactions-summary',
  standalone: true,
  imports: [CommonModule, PipesModule, TitleSummaryComponent, TransactionCardsComponent],
  templateUrl: './upcoming-transactions-summary.component.html',
  styleUrl: './upcoming-transactions-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpcomingTransactionsSummaryComponent implements OnInit {
  transactionCards = signal<TransactionCard[]>([]);
  transactionCardService = inject(TransactionCardService);
  transactionApi = inject(TransactionsApiService);
  billApi = inject(BillApiService);
  isLoading = signal(true);
  types = input<Array<'bill' | 'installment'>>(['bill', 'installment']);
  title = input<string>('پرداخت‌های بعدی');
  hideAllButton = input<boolean>(false);

  @HostBinding('class.d-none')
  get hideSection(): boolean {
    return this.transactionCards().length === 0;
  }

  ngOnInit(): void {
    this.getUpcomingTransactions();
  }

  getUpcomingTransactions(): void {
    this.isLoading.set(true);
    zip([this.getUpcomingInstallmentTransactions(), this.getUpcomingBill()]).subscribe({
      next: ([installments, bills]) => {
        this.transactionCards.set(
          this.transactionCardService
            .mapUpcomingInstallmentTransactionsToTransactionCards(installments.paymentList)
            .concat(this.transactionCardService.mapUpcomingBillTransactionsToTransactionCards(bills.paymentList)),
        );
        this.isLoading.set(false);
      },
    });
  }

  getUpcomingInstallmentTransactions(): Observable<TransactionApiResponse> {
    if (!this.types().includes('installment')) {
      return of({
        result: { message: '', level: '', status: 0, title: '' },
        paymentList: [],
      });
    }
    return this.transactionApi.getUpcomingInstallmentTransactions();
  }

  getUpcomingBill(): Observable<BillApiResponse> {
    if (!this.types().includes('bill')) {
      return of({
        result: { message: '', level: '', status: 0, title: '' },
        paymentList: [],
      });
    }
    return this.billApi.getUpcomingBills();
  }
}
