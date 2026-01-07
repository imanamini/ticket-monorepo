import { Component, inject, OnInit } from '@angular/core';
import { NgxHybridServiceService } from '@digipay/ngx-hybrid-service';
import { QueryParamsEnum } from '../../../enums/query-params.enum';
import { StoreDataForPaymentService } from '../../../services/store-data-for-payment.service';
import { ActivatedRoute } from '@angular/router';
import { WaitingPagesComponent } from '../../../../../components/waiting-pages/waiting-pages.component';

@Component({
  selector: 'go-to-payment',
  standalone: true,
  imports: [WaitingPagesComponent],
  templateUrl: './go-to-payment.component.html',
  styleUrl: './go-to-payment.component.scss',
})
export class GoToPaymentComponent implements OnInit {
  private hybridService = inject(NgxHybridServiceService);
  private router = inject(ActivatedRoute);
  private storeDataForPaymentService = inject(StoreDataForPaymentService);

  ngOnInit(): void {
    this.setInitItems();
  }

  private setInitItems(): void {
    const queryParam = this.router.snapshot.queryParamMap;
    this.storeDataForPaymentService.storeOrderData({
      isHybrid: this.hybridService.isHybrid(),
      referrer: queryParam.get(QueryParamsEnum.UrlGoToPayment),
      appId: queryParam.get(QueryParamsEnum.ApplicationId),
      paymentId: queryParam.get(QueryParamsEnum.PaymentId),
    });
    try {
      window.location.assign(queryParam.get(QueryParamsEnum.UrlGoToPayment));
    } catch (e) {
      window.location.href = queryParam.get(QueryParamsEnum.UrlGoToPayment);
    }
  }
}
