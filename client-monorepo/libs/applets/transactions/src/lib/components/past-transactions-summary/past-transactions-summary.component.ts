import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitleSummaryComponent } from '@client-monorepo/common/ui-components';
import {
  TransactionCard,
  TransactionCardsComponent,
  TransactionCardService,
  TransactionsApiService,
  TransactionSearchPayloadInterface,
} from '@client-monorepo/payment/transactions';
import { NgxCalloutComponent } from '@digipay/ngx-callout';

@Component({
  selector: 'transactions-applet-past-transactions-summary',
  standalone: true,
  imports: [CommonModule, TitleSummaryComponent, TransactionCardsComponent, NgxCalloutComponent],
  templateUrl: './past-transactions-summary.component.html',
  styleUrl: './past-transactions-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PastTransactionsSummaryComponent implements OnInit {
  isLoading = signal<boolean>(true);
  transactionCards = signal<TransactionCard[]>([]);
  messages = signal<Array<string>>([
    'از همین‌جا کارت‌به‌کارت کنید',
    'از صفحه‌ی خدمات شارژ بخرید',
    'با دریافت اعتبار از فروشگاه‌های متعدد ما خرید کنید.',
  ]);
  transactionsApiService = inject(TransactionsApiService);
  transactionCardService = inject(TransactionCardService);

  ngOnInit() {
    this.initPage();
  }

  private initPage(): void {
    const payload: TransactionSearchPayloadInterface = {
      page: 0,
      size: 10,
      orders: [
        {
          field: 'exerciseDate',
          order: 'desc',
        },
      ],
    };
    this.transactionsApiService.getTransactionsList(payload).subscribe({
      next: (result) => {
        this.transactionCards.set(this.transactionCardService.mapPastTransactionsToTransactionCards(result.activities));
        this.isLoading.set(false);
      },
      error: () => {
        this.transactionCards.set([]);
      },
    });
  }
}
