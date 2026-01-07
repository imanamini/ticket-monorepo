import { Component, computed, inject, output, signal } from '@angular/core';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { IplDetailService } from '../../../services/ipl-detail/ipl-detail.service';
import { IplService } from '../../../services/ipl.service';
import { DebtorInfoComponent } from '../debtor-info/debtor-info.component';
import { CreditInstallmentPaymentService } from '../../../../data-access/services/credit-installment-payment.service';
import { CreditInstallmentPaymentFooterComponent } from '../../../../components/credit-installment-payment-footer/credit-installment-payment-footer.component';
import { CreditInstallmentPaymentFooterRow } from '../../../../components/credit-installment-payment-footer/data-access/credit-installment-payment-footer-row';

@Component({
  selector: 'app-ipl-detail-total-debt',
  standalone: true,
  imports: [CreditInstallmentPaymentFooterComponent, NgxCalloutComponent, DebtorInfoComponent],
  templateUrl: './ipl-detail-total-debt.component.html',
})
export class IplDetailTotalDebtComponent {
  // Services
  public iplDetailService = inject(IplDetailService);
  private iplService = inject(IplService);
  public creditInstallmentPaymentService = inject(CreditInstallmentPaymentService);

  // Signals
  userInfo = signal(this.iplService.userInfo()!);
  paymentFooterRows = computed<CreditInstallmentPaymentFooterRow[]>(() => this.makePaymentFooterRows());

  // Outputs
  payClicked = output();

  goToApp() {
    this.iplDetailService.goToApp();
  }

  onPay() {
    this.payClicked.emit();
  }

  makePaymentFooterRows(): CreditInstallmentPaymentFooterRow[] {
    if (this.userInfo().totalPenalty) {
      const rows: CreditInstallmentPaymentFooterRow[] = [
        {
          title: 'مبلغ بدهی',
          value: this.userInfo().totalDebt - this.userInfo().totalPenalty + this.userInfo().totalPenaltyWaiver,
          status: 'default',
          type: 'default',
        },
        {
          title: 'جریمه دیرکرد',
          value: this.userInfo().totalPenalty,
          status: 'error',
          type: 'increase',
        },
      ];
      if (this.userInfo().totalPenaltyWaiver) {
        rows.push({
          title: 'بخشش جریمه',
          value: this.userInfo().totalPenaltyWaiver,
          status: 'success',
          type: 'decrease',
        });
      }

      return rows;
    } else {
      return [];
    }
  }
}
