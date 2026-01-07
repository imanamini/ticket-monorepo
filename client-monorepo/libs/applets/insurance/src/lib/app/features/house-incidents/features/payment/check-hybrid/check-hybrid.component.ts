import { Component, inject, OnInit } from '@angular/core';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';
import { WaitingPagesComponent } from '../../../../../components/waiting-pages/waiting-pages.component';
import { BaseComponent } from '../../../../../components/base/base.component';
import { ActivatedRoute } from '@angular/router';
import { HouseIncidentsApiService } from '../../../data-access/services/house-incidents-api.service';
import { QueryParamHouseIncidentEnum } from '../../../data-access/enums/query-param-house-incident.enum';
import { HouseIncidentsDataStorageService } from '../../../data-access/services/house-incidents-data-storage.service';
import { HOUSE_INCIDENTS_URLS } from '../../../data-access/constants/house-incidents-urls';
import { EnvironmentService } from '@client-monorepo/app-core';

@Component({
  standalone: true,
  imports: [NgxSpinnerModule, WaitingPagesComponent],
  templateUrl: './check-hybrid.component.html',
  styleUrl: './check-hybrid.component.scss',
})
export class CheckHybridComponent extends BaseComponent implements OnInit {
  private apiHouseIncidentsService = inject(HouseIncidentsApiService);
  private route = inject(ActivatedRoute);
  private storeDataForPaymentService = inject(HouseIncidentsDataStorageService);  private get environment() {
    return EnvironmentService.env.insurance || EnvironmentService.env;
  }

  constructor(

    ) {
    super();
  }

  ngOnInit(): void {
    const providerId = this.route.snapshot.queryParamMap.get(QueryParamHouseIncidentEnum.ProviderId);
    if (providerId) {
      this.init(providerId);
    } else {
      this.callbackRoute(providerId);
    }
  }

  private init(providerId: string): void {
    this.apiHouseIncidentsService.checkHybridPayment(providerId).subscribe({
      next: (response) => {
        setTimeout(() => {
          if (response?.result) {
            const orderData = this.storeDataForPaymentService.getOrderData();
            window.history.pushState(null, '', null);
            window.location.assign(
              response.result + (orderData?.referrer ? `&${QueryParamHouseIncidentEnum.Referrer}=${orderData.referrer}` : ''),
            );
            this.storeDataForPaymentService.removeOrderData();
          } else {
            this.callbackRoute(providerId);
          }
        }, 1000);
      },
      error: (err) => {
        this.callbackRoute(providerId);
      },
    });
  }

  private callbackRoute(providerId: string): void {
    setTimeout(() => {
      const orderData = this.storeDataForPaymentService.getOrderData();
      if (orderData) {
        window.location.assign(
          (orderData.isHybrid ? this.environment.schema_address : this.environment.domain_address) +
            this.environment.base_href +
            '/' +
            HOUSE_INCIDENTS_URLS.PAYMENT_RESULT +
            `?${[QueryParamHouseIncidentEnum.ApplicationId]}=${orderData.appId}&${[QueryParamHouseIncidentEnum.Referrer]}=${orderData.referrer}&${[QueryParamHouseIncidentEnum.ProviderId]}=${providerId}`,
        );
      } else {
        window.location.assign(this.environment.domain_address + this.environment.base_href);
      }
      this.storeDataForPaymentService.removeOrderData();
    }, 1000);
  }
}
