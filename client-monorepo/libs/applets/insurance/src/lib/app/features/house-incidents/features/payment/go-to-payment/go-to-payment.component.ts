import { Component, inject, OnInit } from '@angular/core';
import { WaitingPagesComponent } from '../../../../../components/waiting-pages/waiting-pages.component';
import { ActivatedRoute } from '@angular/router';
import {
  HouseIncidentsDataStorageService
} from '../../../data-access/services/house-incidents-data-storage.service';
import { QueryParamHouseIncidentEnum } from '../../../data-access/enums/query-param-house-incident.enum';

@Component({
  selector: 'go-to-payment',
  standalone: true,
  imports: [
    WaitingPagesComponent
  ],
  templateUrl: './go-to-payment.component.html',
  styleUrl: './go-to-payment.component.scss'
})
export class GoToPaymentComponent implements OnInit {
  private router = inject(ActivatedRoute);
  private storeDataForPaymentService = inject(HouseIncidentsDataStorageService);

  ngOnInit(): void {
    this.setInitItems();
  }

  private setInitItems(): void {
    const queryParam = this.router.snapshot.queryParamMap;
    this.storeDataForPaymentService.storeOrderData({
      isHybrid: queryParam.get('isHybrid') === 'true',
      referrer: queryParam.get(QueryParamHouseIncidentEnum.UrlGoToPayment),
      appId: queryParam.get(QueryParamHouseIncidentEnum.ApplicationId),
      providerId: queryParam.get(QueryParamHouseIncidentEnum.ProviderId),
    });
    try {
      window.location.assign(queryParam.get(QueryParamHouseIncidentEnum.UrlGoToPayment));
    } catch (e) {
      window.location.href = queryParam.get(QueryParamHouseIncidentEnum.UrlGoToPayment);
    }
  }
}
