import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ContractPurchasesResponse } from '../../data-access/models/credit/installment/contract-purchases.response';
import { ActivatedRoute } from '@angular/router';
import { CreditUrlService } from '../../data-access/utils/url';
import { CreditApiService } from '../../data-access/services/credit-api.service';
import { CreditPageLoadingComponent } from '../../components/credit-page-loading/credit-page-loading.component';
import { CreditPurchasesDetailComponent } from '../credit-purchases-detail/credit-purchases-detail.component';
import { MessageService } from '../../data-access/services/message.service';

@Component({
  selector: 'app-credit-contract-transactions',
  templateUrl: './credit-contract-transactions.component.html',
  styleUrls: ['./credit-contract-transactions.component.scss'],
  standalone: true,
  imports: [CreditPurchasesDetailComponent, CreditPageLoadingComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditContractTransactionsComponent implements OnInit {
  contractTrackingCode!: string;
  creditId!: string;
  data = signal<ContractPurchasesResponse | null>(null);
  gettingData = signal<boolean | null>(null);
  pageUrl = signal<string | null>(null);

  private activatedRoute = inject(ActivatedRoute);
  private creditUrlService = inject(CreditUrlService);
  private creditApiService = inject(CreditApiService);
  private messageService = inject(MessageService);

  ngOnInit(): void {
    this.contractTrackingCode = this.activatedRoute.snapshot.params['contractTrackingCode'];
    this.creditId = this.activatedRoute.snapshot.params['creditId'];
    this.pageUrl.set(this.creditUrlService.getInnerServicePath(`/contract-purchase/${this.contractTrackingCode}/${this.creditId}`));
    this.getData();
  }

  getData() {
    this.gettingData.set(true);
    this.creditApiService.getContractPurchases(this.contractTrackingCode).subscribe({
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
