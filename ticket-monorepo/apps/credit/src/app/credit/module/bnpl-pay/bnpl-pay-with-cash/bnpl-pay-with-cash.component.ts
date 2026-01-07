import { Component, computed, input, output } from '@angular/core';
import { BnplPayHeaderComponent } from '../bnpl-pay-header/bnpl-pay-header.component';
import { InstallmentPreview } from '../../../api/purchase/credit-wallet.model';
import { FooterPayComponent } from '../../../credit-ui/footer-pay/footer-pay.component';
import { BnplPayCashCardComponent } from '../bnpl-pay-cash-card/bnpl-pay-cash-card.component';
import { BnplPayCreditCardComponent } from '../bnpl-pay-credit-card/bnpl-pay-credit-card.component';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import moment from 'jalali-moment';
import { ScrollableViewComponent } from '../../../shared/components/scrollable-view/scrollable-view.component';

@Component({
  selector: 'app-bnpl-pay-with-cash',
  standalone: true,
  imports: [
    BnplPayHeaderComponent,
    FooterPayComponent,
    BnplPayCashCardComponent,
    BnplPayCreditCardComponent,
    NgxCalloutComponent,
    ScrollableViewComponent,
  ],
  templateUrl: './bnpl-pay-with-cash.component.html',
  styleUrl: './bnpl-pay-with-cash.component.scss'
})
export class BnplPayWithCashComponent {

  purchaseAmount = input<number>(null);
  couponAmount = input<number>(0);
  payableAmount = input<number>(null);
  creditAmount = input<number>(null);
  cashFee = input<number>(null);
  creditFee = input<number>(null);
  installmentCount = input<number>(null);
  installments = input<InstallmentPreview[]>(null);
  prePaymentAmount = input<number>(null);
  xPay = input<boolean>(null);
  disabled = input<boolean>(false);
  onEditCredit = output();
  onPay = output();
  
  nearPay = computed(() => this.computeNearPay(10));

  computeNearPay(threshold: number) {
    if (this.installments() && this.installments().length > 0) {
      const firstInstallmentEffectiveDate = [...this.installments()]
        ?.sort((a, b) => a.date - b.date)?.[0]?.date;
      const currentStartOfDay = moment().startOf('day');
      const diff = moment(firstInstallmentEffectiveDate).diff(currentStartOfDay, 'days');

      return diff <= threshold;
    } else {
      return false;
    }
  }
}

