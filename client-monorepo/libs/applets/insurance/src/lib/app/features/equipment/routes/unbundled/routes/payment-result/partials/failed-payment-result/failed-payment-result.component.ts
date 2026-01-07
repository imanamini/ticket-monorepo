import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import Clipboard from '../../../../../../../../util/clipboard';
import { NgForOf, NgIf } from '@angular/common';
import { UiButtonComponent } from '../../../../../../../../components/ui-button/ui-button/ui-button.component';
import { PaymentResultModel } from '../../../../../../api/models/lead/payment-result.model';
import { INSURANCE_APP_PREFIX } from '../../../../../../../../data-access/constants/insurance-app-prefix.constant';

@Component({
  selector: 'failed-payment-result',
  templateUrl: './failed-payment-result.component.html',
  styleUrls: ['./failed-payment-result.component.scss'],
  imports: [
    NgForOf,
    NgIf,
    UiButtonComponent
  ],
  standalone: true
})
export class FailedPaymentResultComponent {

  @Input()
  result: PaymentResultModel;

  @Input()
  resultList: any[] = [];

  constructor(private router: Router,
  ) {
  }

  copy(clickable, val): void {
    if (clickable) {
      Clipboard.copy(val);
    }
    const trackingCode = document.getElementById('trackingCode');
    trackingCode.classList.add('clicked');
    setTimeout(() => {
      trackingCode.classList.remove('clicked');
    }, 1000);
  }

  returnToLead(): void {
    if (this.result && this.result.leadCode) {
      this.router.navigate([`${INSURANCE_APP_PREFIX}/equipment/unbundled/home`], {queryParams: {code: this.result.leadCode}}).then();
    } else {
      this.router.navigate([`${INSURANCE_APP_PREFIX}/equipment/unbundled/home`]).then();
    }
  }

}
