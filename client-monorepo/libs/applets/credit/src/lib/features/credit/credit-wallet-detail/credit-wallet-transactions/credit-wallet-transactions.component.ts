import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ContractPurchasesResponse } from '../../data-access/models/credit/installment/contract-purchases.response';
import { ActivatedRoute } from '@angular/router';
import { CreditUrlService } from '../../data-access/utils/url';
import { CreditApiService } from '../../data-access/services/credit-api.service';
import { CreditPageLoadingComponent } from '../../components/credit-page-loading/credit-page-loading.component';
import { CreditPurchasesDetailComponent } from '../credit-purchases-detail/credit-purchases-detail.component';
import { MessageService } from '../../data-access/services/message.service';

@Component({
  selector: 'app-credit-wallet-transactions',
  templateUrl: './credit-wallet-transactions.component.html',
  styleUrls: ['./credit-wallet-transactions.component.scss'],
  standalone: true,
  imports: [CreditPurchasesDetailComponent, CreditPageLoadingComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditWalletTransactionsComponent implements OnInit {
  creditId!: string;
  data = signal<ContractPurchasesResponse | null>(null);
  gettingData = signal<boolean>(true);
  pageUrl = signal<string | null>(null);

  private messageService = inject(MessageService);
  private activatedRoute = inject(ActivatedRoute);
  private creditUrlService = inject(CreditUrlService);
  private creditApiService = inject(CreditApiService);

  ngOnInit(): void {
    this.creditId = this.activatedRoute.snapshot.params['creditId'];
    this.pageUrl.set(this.creditUrlService.getInnerServicePath(`/wallet-transactions/${this.creditId}`));
    this.getData();
  }

  getData() {
    this.creditApiService.getWalletPurchases(this.creditId).subscribe({
      next: (response) => {
        this.data.set(response);
        this.gettingData.set(false);
      },
      error: (error) => {
        this.messageService.showErrorOfErrorResponse(error);
        this.goBack();
      },
    });
  }

  goBack() {
    window.history.back();
  }
}
