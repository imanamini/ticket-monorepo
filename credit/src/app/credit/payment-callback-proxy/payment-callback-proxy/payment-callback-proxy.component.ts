import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

declare var window: {
  Android: {
    sendPaymentResult: (paymentResultData: string) => void;
  }
};

@Component({
  selector: 'app-payment-callback-proxy',
  templateUrl: './payment-callback-proxy.component.html',
  styleUrls: ['./payment-callback-proxy.component.scss']
})
export class PaymentCallbackProxyComponent implements OnInit {

  constructor(
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    const queryParams = this.route.snapshot.queryParams;
    this.sendMessage(queryParams);
  }


  sendMessage(queryParams: { [key: string]: any }): void {
    if (typeof window.Android !== 'undefined') {
      window.Android.sendPaymentResult(queryParams.data);
      return;
    }
    console.error('interface is not accessible');
  }
}
