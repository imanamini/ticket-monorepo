import { Component, computed, inject, output, signal } from '@angular/core';
import {
  CreditInstallmentPaymentFooterComponent
} from '../../../components/credit-installment-payment-footer/credit-installment-payment-footer.component';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { IplDetailService } from '../../../services/ipl-detail/ipl-detail.service';
import { IplService } from '../../../services/ipl.service';
import {
  CreditInstallmentPaymentFooterRow
} from '../../../components/credit-installment-payment-footer/data-access/credit-installment-payment-footer-row';
import { DebtorInfoComponent } from '../debtor-info/debtor-info.component';
import { IplDigipayEnglishName } from '../../../data-access/ipl-digipay-english-name';

@Component({
  selector: 'app-ipl-detail-total-debt',
  standalone: true,
  imports: [
    CreditInstallmentPaymentFooterComponent,
    NgxCalloutComponent,
    DebtorInfoComponent
  ],
  templateUrl: './ipl-detail-total-debt.component.html',
})
export class IplDetailTotalDebtComponent {

  // Services
  private iplDetailService = inject(IplDetailService);
  private iplService = inject(IplService);

  // Signals
  userInfo = signal(this.iplService.userInfo());
  paymentFooterRows = computed<CreditInstallmentPaymentFooterRow[]>(() => this.makePaymentFooterRows());
  debtorInfoTitle = computed(() => {
    return this.userInfo().fundProviderDto.name === IplDigipayEnglishName ?
      'بدهی اعتبار اقساطی ' :
      this.userInfo().fundProviderDto.title.replace('اعتبار', 'وام');
  });

  // Outputs
  payClicked = output();

  goToApp() {
    this.iplDetailService.goToApp();
  }

  goToCellNumber() {
    this.payClicked.emit();
  }

  makePaymentFooterRows(): CreditInstallmentPaymentFooterRow[] {
    if (this.userInfo().totalPenalty) {
      const rows: CreditInstallmentPaymentFooterRow[] = [
        {
          title: 'مبلغ بدهی',
          value: this.userInfo().totalDebt - this.userInfo().totalPenalty + this.userInfo().totalPenaltyWaiver,
          status: 'default',
        },
        {
          title: 'جریمه دیرکرد',
          value: this.userInfo().totalPenalty,
          status: 'increase',
        }
      ];
      if (this.userInfo().totalPenaltyWaiver) {
        rows.push({
          title: 'بخشش جریمه',
          value: this.userInfo().totalPenaltyWaiver,
          status: 'decrease',
        });
      }

      return rows;
    } else {
      return [];
    }
  }
}
