import { Component, inject, OnInit } from '@angular/core';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';
import { ApplicationFormService } from '../../../services/application-form.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreDataForPaymentService } from '../../../services/store-data-for-payment.service';
import { QueryParamsEnum } from '../../../enums/query-params.enum';
import { FlokiRoutesEnum } from '../../../enums/floki-routes.enum';
import { WaitingPagesComponent } from '../../../../../components/waiting-pages/waiting-pages.component';
import { BaseComponent } from '../../../../../components/base/base.component';

@Component({
  standalone: true,
  imports: [NgxSpinnerModule, WaitingPagesComponent],
  templateUrl: './check-hybrid.component.html',
  styleUrl: './check-hybrid.component.scss',
})
export class CheckHybridComponent extends BaseComponent implements OnInit {
  private applicationFormService = inject(ApplicationFormService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private storeDataForPaymentService = inject(StoreDataForPaymentService);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.getPaymentInfo();
  }

  private getPaymentInfo(): void {
    const paymentId = this.route.snapshot.queryParams.paymentId;
    this.applicationFormService.checkHybrid(paymentId).subscribe({
      next: (res) => {
        if (res.result.isHybrid) {
          this.routeInHybridMode(res.result.applicationFormId, res.result.referrer, paymentId);
        } else {
          this.routeInWebMode(res.result.applicationFormId, res.result.referrer, paymentId);
        }
      },
      error: (err) => this.callbackRoute(),
    });
  }

  private callbackRoute(): void {
    const orderData = this.storeDataForPaymentService.getOrderData();
    if (orderData) {
      if (orderData.isHybrid) {
        this.routeInHybridMode(orderData.appId, orderData.referrer, orderData.paymentId);
      } else {
        this.routeInWebMode(orderData.appId, orderData.referrer, orderData.paymentId);
      }
    } else {
    //  window.location.assign(environment.domain_address + environment.base_href);
    }
  }

  private routeInHybridMode(appId: string, referrer: string, paymentId: string): void {
    // window.location.assign(
    //   environment.schema_address +
    //     environment.base_href +
    //     FlokiRoutesEnum.Floki +
    //     FlokiRoutesEnum.Payment +
    //     FlokiRoutesEnum.PaymentResult +
    //     `?${[QueryParamsEnum.ApplicationId]}=${appId}&${[QueryParamsEnum.Referrer]}=${referrer}&${[QueryParamsEnum.PaymentId]}=${paymentId}}`,
    // );
    this.storeDataForPaymentService.removeOrderData();
  }

  private routeInWebMode(appId: string, referrer: string, paymentId: string): void {
    this.router
      .navigate([FlokiRoutesEnum.Floki, FlokiRoutesEnum.Payment, FlokiRoutesEnum.PaymentResult], {
        queryParams: {
          [QueryParamsEnum.ApplicationId]: appId,
          [QueryParamsEnum.Referrer]: referrer,
          [QueryParamsEnum.PaymentId]: paymentId,
        },
      })
      .then(() => {
        this.storeDataForPaymentService.removeOrderData();
      });
  }
}
