import { HouseIncidentProductCardModel } from '../../features/plp/data-access/models/house-incident-product-card.model';
import {
  HouseIncidentCompleteInfoModel
} from '../../features/complete-journey/model/house-incident-user-info-form.model';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { HouseIncidentsApiService } from './house-incidents-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MetricService } from '../../../../data-access/services/metric.service';
import { ReferrerService } from '../../../../data-access/services/referrer.service';
import { HouseIncidentsDataStorageService } from './house-incidents-data-storage.service';
import { NgxHybridService } from '@digipay/ngx-hybrid-service';
import { PolicyUserInfoModel } from '../../features/complete-journey/model/policy-user-info.model';
import { BottomSheetService } from '../../../../data-access/services/bottom-sheet.service';
import { NavigationService } from '../../../../data-access/services/navigation.service';
import { BaseComponent } from '../../../../components/base/base.component';

export abstract class HouseIncidentsDynamicService extends BaseComponent {
  public apiHouseIncidentsService = inject(HouseIncidentsApiService);
  public router = inject(Router);
  public activatedRoute = inject(ActivatedRoute);
  public metricService = inject(MetricService);
  public referrerService: ReferrerService = inject(ReferrerService);
  public storeDataForPaymentService: HouseIncidentsDataStorageService = inject(HouseIncidentsDataStorageService);
  public hybridService = inject(NgxHybridService);
  public bottomSheetService = inject(BottomSheetService);
  public navigationService = inject(NavigationService);

  abstract orderProduct(productCard: HouseIncidentProductCardModel, applicationId: string, orderDetail?: PolicyUserInfoModel): void;

  abstract sendToPayment(applicationFormId: string): void;

  abstract completeInfo(appId: string, data: HouseIncidentCompleteInfoModel): Observable<any>;

  abstract handlePaymentResult(providerId: string): Observable<boolean>;

  abstract leaveCompleteInfo(): void;

  abstract retryFailedPayment(applicationFormId: string): void;

  abstract openVoucherBottomSheet(orderDetail: PolicyUserInfoModel): any;
}
