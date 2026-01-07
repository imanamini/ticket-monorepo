import { Component, OnInit } from '@angular/core';
import { CreditUiModule } from '../credit-ui/credit-ui.module';
import { PaymentResultService } from './payment-result.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentReceiptType } from './data-access/payment-receipt-type';
import { IplReceiptQueryParamKey } from '../installment-pay-link/data-access/ipl-receipt';
import { NgxPaymentResult } from '@digipay/ngx-payment-result';
import { PaymentResultServiceResponse } from '../credit-ui/credit-payment-result/credit-payment-result.model';

@Component({
  selector: 'app-payment-receipt',
  styleUrl: 'payment-receipt.component.scss',
  templateUrl: 'payment-receipt.component.html',
  standalone: true,
  imports: [
    CreditUiModule,
    NgxPaymentResult
  ],
  providers: [
    PaymentResultService
  ]
})
export class PaymentReceiptComponent implements OnInit {

  result: PaymentResultServiceResponse;

  ready = false;

  type = PaymentReceiptType.Default;
  protected readonly PaymentReceiptTrigger = PaymentReceiptType;

  constructor(
    private paymentResultService: PaymentResultService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.paymentResultService.getPaymentResult().then(result => {
      this.selectType();
      this.result = result;
      this.ready = true;
    });
  }

  selectType() {
    if (this.route.snapshot.queryParams[IplReceiptQueryParamKey]) {
      this.type = PaymentReceiptType.Ipl;
    }
  }

  onCloseHandler() {
    switch (this.type) {
      case PaymentReceiptType.Ipl:
        this.onIplClose();
        break;
      default:
    }
  }

  onIplClose() {
    const uuid = this.route.snapshot.queryParams[IplReceiptQueryParamKey];
    this.router.navigate(['ipl', uuid]);
  }
}
