import { ChangeDetectionStrategy, Component, effect, inject, input, output, signal } from '@angular/core';
import { CreditApiService } from '../../data-access/services/credit-api.service';
import { PurchaseDetailItem } from './model/purchase-detail-item';
import { ContractPurchasesResponse } from '../../data-access/models/credit/installment/contract-purchases.response';
import { ContractPurchaseItemType } from '../../data-access/models/credit/installment/contract-purchase-item';
import { MessageService } from '../../data-access/services/message.service';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { CreditDigipayImageComponent } from '../../components/credit-digipay-image/credit-digipay-image.component';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';
import { NgxIcon } from '@digipay/ngx-icon';

type PurchaseDetailStatus = 'INIT' | 'LOADING' | 'SUCCESS';

@Component({
  selector: 'app-contract-purchases-detail',
  templateUrl: './contract-purchases-detail.component.html',
  styleUrl: './contract-purchases-detail.component.scss',
  standalone: true,
  imports: [NgxSpinnerModule, CreditDigipayImageComponent, PipesModule, NgxIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContractPurchasesDetailComponent {
  contractTrackingCode = input<string | null>(null);
  detailsOpened = output<boolean>();

  status = signal<PurchaseDetailStatus>('INIT');
  detailIsOpen = signal<boolean>(false);
  formattedDetailData = signal<PurchaseDetailItem[]>([]);
  totalPurchases = signal<number>(0);

  private apiService = inject(CreditApiService);
  private messageService = inject(MessageService);

  constructor() {
    effect(() => {
      this.detailsOpened.emit(this.detailIsOpen());
    });
  }

  getData() {
    this.status.set('LOADING');
    this.apiService.getContractPurchases(this.contractTrackingCode()!).subscribe({
      next: (response) => {
        this.formatPurchaseData(response);
        this.status.set('SUCCESS');
        this.detailIsOpen.set(true);
      },
      error: (error) => {
        this.status.set('INIT');
        this.messageService.showErrorOfErrorResponse(error);
      },
    });
  }

  formatPurchaseData(data: ContractPurchasesResponse) {
    const temp: PurchaseDetailItem[] = [];
    data.businessTransactionDetails?.forEach((business) => {
      // Add purchase items
      const purchasesIndex = business.transactionDetails.findIndex(
        (transactions) => transactions.type === ContractPurchaseItemType.PURCHASE,
      );
      business.transactionDetails?.[purchasesIndex].transactionItems.forEach((transaction) => {
        temp.push({
          trackingCode: transaction.trackingCode,
          businessImageId: business.businessImageId,
          businessName: business.businessName.value,
          purchaseTitle: transaction.title.text,
          purchaseValue: transaction.title.value,
          purchaseDate: transaction.date.value,
          refunds: [],
        });
      });

      // Attach refund to Purchase
      const refundsIndex = business.transactionDetails.findIndex((transactions) => transactions.type === ContractPurchaseItemType.REFUND);
      if (refundsIndex > -1) {
        business.transactionDetails[refundsIndex].transactionItems.forEach((refund) => {
          const parentPurchaseIndex = temp.findIndex((item) => item.trackingCode === refund.parentTrackingCode);
          temp[parentPurchaseIndex].refunds.push({
            title: refund.title.text,
            value: refund.title.value,
            iconId: refund.icon,
          });
        });
      }
    });

    temp.sort((a, b) => b.purchaseDate.localeCompare(a.purchaseDate));

    this.formattedDetailData.set(temp);
  }

  menuClickHandler() {
    if (this.status() === 'SUCCESS') {
      this.detailIsOpen.update((prev) => !prev);
    } else {
      this.getData();
    }
  }
}
