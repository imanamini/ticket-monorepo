import { ChangeDetectionStrategy, Component, input, OnInit, output, signal } from '@angular/core';
import { InstallmentPayConfigResponse } from '../../../data-access/models/credit/installment/installment-pay-config.response';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { CreditPaymentCardComponent } from '../../../components/credit-payment-card/credit-payment-card.component';
import { CreditScrollableViewComponent } from '../../../components/credit-scrollable-view/credit-scrollable-view.component';
import { CreditAppBarComponent } from '../../../components/credit-app-bar/credit-app-bar.component';

@Component({
  selector: 'app-credit-installment-payment-detail',
  templateUrl: './credit-installment-payment-detail.component.html',
  styleUrls: ['./credit-installment-payment-detail.component.scss'],
  standalone: true,
  imports: [CreditAppBarComponent, CreditScrollableViewComponent, CreditPaymentCardComponent, NgxCalloutComponent, NgxButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditInstallmentPaymentDetailComponent implements OnInit {
  installmentPayConfig = input<InstallmentPayConfigResponse>();
  amount = input<number>();
  paying = input<boolean>();

  prevStep = output<void>();
  nextStep = output<void>();
  descriptions = signal<string[]>([]);

  ngOnInit(): void {
    this.descriptions.set(this.installmentPayConfig()!.descriptionBody.split('\n'));
  }

  goBack() {
    this.prevStep.emit();
  }

  goForward() {
    this.nextStep.emit();
  }
}
