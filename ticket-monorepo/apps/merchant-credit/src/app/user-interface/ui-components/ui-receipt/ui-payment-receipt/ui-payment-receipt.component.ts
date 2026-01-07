import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PaymentResult } from '../../../../api/models/payment/payment-result.model';
import { Router } from '@angular/router';

@Component({
  selector: 'ui-payment-receipt',
  templateUrl: './ui-payment-receipt.component.html',
  styleUrls: ['./ui-payment-receipt.component.scss']
})
export class UiPaymentReceiptComponent implements OnInit {

  @Input()
  paymentResult!: PaymentResult;

  @Output()
  redirectClicked = new EventEmitter<PaymentResult>();

  constructor(
    private router: Router
  ) {
  }

  ngOnInit(): void {
  }

  redirectToNextStep() {
    if (!!this.paymentResult.redirectDetail) {
      const path = this.paymentResult.redirectDetail.path;
      if (!path) {
        this.redirectClicked.emit(this.paymentResult);
        return;
      }
      const queryParams = this.paymentResult.redirectDetail.data || '';
      window.location.href = path + (path.includes('?') ? '&' : '?') + queryParams;
    } else {
      this.redirectClicked.emit(this.paymentResult);
    }
  }

}
