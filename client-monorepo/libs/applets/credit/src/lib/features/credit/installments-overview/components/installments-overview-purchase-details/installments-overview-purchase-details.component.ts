import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { NgxBottomSheetHeaderComponent, NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { getMonthTitle, isStartAndEndOfMonth } from '../../../data-access/utils/date';
import { BillingCycleInfo } from '../../data-access/get-installments-overview-response';
import { CreditApiService } from '../../../data-access/services/credit-api.service';
import { MessageService } from '../../../data-access/services/message.service';
import { NgxIcon } from '@digipay/ngx-icon';
import { NgxTooltipDirective } from '@digipay/ngx-tooltip';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { ContractPurchasesResponse } from '../../../data-access/models/credit/installment/contract-purchases.response';
import { InstallmentsOverviewPurchaseDetail } from '../../data-access/installments-overview-purchase-detail';
import { ContractPurchaseItemType } from '../../../data-access/models/credit/installment/contract-purchase-item';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';
import { CreditDigipayImageComponent } from '../../../components/credit-digipay-image/credit-digipay-image.component';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-installments-overview-purchase-details',
  templateUrl: './installments-overview-purchase-details.component.html',
  styleUrl: './installments-overview-purchase-details.component.scss',
  standalone: true,
  imports: [
    NgxBottomSheetHeaderComponent,
    NgxIcon,
    NgxTooltipDirective,
    NgxButtonComponent,
    NgxSpinnerModule,
    CreditDigipayImageComponent,
    NgxDividerComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstallmentsOverviewPurchaseDetailsComponent implements OnInit {
  // Services
  private bottomSheet = inject(NgxBottomSheetService);
  private apiService = inject(CreditApiService);
  private messageService = inject(MessageService);
  private destroyRef = inject(DestroyRef);

  // Signals
  gettingData = signal(true);
  formattedPurchaseData = signal<InstallmentsOverviewPurchaseDetail[]>([]);
  title = computed<string>(() => {
    const billingCycleInfo = this.bottomSheet.data().billingCycleInfo as Omit<BillingCycleInfo, 'merchantsBusinessIds'>;
    if (billingCycleInfo) {
      const alongAMonth = isStartAndEndOfMonth(billingCycleInfo.startDate, billingCycleInfo.endDate);
      if (alongAMonth) {
        return 'خریدهای ' + getMonthTitle(billingCycleInfo.startDate) + ' ماه';
      } else {
        return 'خریدهای ' + getMonthTitle(billingCycleInfo.startDate, true) + ' تا ' + getMonthTitle(billingCycleInfo.endDate, true);
      }
    } else {
      return 'خریدها';
    }
  });

  // Variables
  protected readonly BorderColorsEnum = BorderColorsEnum;

  ngOnInit() {
    this.getData();
  }

  private getData() {
    this.apiService
      .getContractPurchases(this.bottomSheet.data().contractTrackingCode)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.formatPurchaseData(res);
          this.gettingData.set(false);
        },
        error: (e) => {
          this.gettingData.set(false);
          this.messageService.showErrorOfErrorResponse(e);
          this.close();
        },
      });
  }

  formatPurchaseData(data: ContractPurchasesResponse) {
    const temp: InstallmentsOverviewPurchaseDetail[] = [];
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
          });
        });
      }
    });

    temp.sort((a, b) => b.purchaseDate.localeCompare(a.purchaseDate));
    this.formattedPurchaseData.set(temp);
  }

  close() {
    this.bottomSheet.closeBottomSheet();
  }
}
