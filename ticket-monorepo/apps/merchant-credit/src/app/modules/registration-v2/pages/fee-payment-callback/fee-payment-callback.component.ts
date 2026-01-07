import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Base64 } from 'js-base64';
import { PaymentResult, PaymentResultStatus } from '../../../../api/models/payment/payment-result.model';
import { fixActivityInfoArray } from '../../../../utils/strings';

@Component({
  selector: 'fee-payment-callback',
  templateUrl: './fee-payment-callback.component.html',
  styleUrls: ['./fee-payment-callback.component.scss']
})
export class FeePaymentCallbackComponent implements OnInit {

  result!: PaymentResult;

  creditId = '';

  successfulPayment = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    const params = this.route.snapshot.queryParams;
    this.creditId = this.route.snapshot.params.creditId;
    let data = params.data;
    if (data) {
      data = decodeURIComponent(data);
      const decodedData = JSON.parse(Base64.decode(data));
      this.fixDataAndStore(decodedData);
    }
  }

  private fixDataAndStore(result: PaymentResult) {
    result.activityInfo = fixActivityInfoArray(result.activityInfo);
    this.result = result;
    this.successfulPayment = this.result.paymentResult === PaymentResultStatus.SUCCESS;
  }

  onBackClick(): void {
    this.router.navigate([
      '/registration-v2/' + this.creditId
    ]);
  }

  onRedirectClick(): void {
    this.router.navigate([
      '/registration-v2/' + this.creditId + '/overview'
    ]);
  }

}
