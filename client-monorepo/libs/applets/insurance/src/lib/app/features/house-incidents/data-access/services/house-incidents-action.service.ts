import { inject, Injectable, signal } from '@angular/core';
import { HouseIncidentProductCardModel } from '../../features/plp/data-access/models/house-incident-product-card.model';
import { HouseIncidentsDynamicService } from './house-incidents-dynamic-action.service';
import {
  HouseIncidentCompleteInfoModel
} from '../../features/complete-journey/model/house-incident-user-info-form.model';
import { Observable, ReplaySubject } from 'rxjs';
import { HouseIncidentsBActionsService } from './house-incidents-b-actions.service';
import { HouseIncidentsServiceActionType } from '../enums/house-incidents-service-action-type.enum';
import { HouseIncidentsAActionsService } from './house-incidents-a-actions.service';
import { PolicyUserInfoModel } from '../../features/complete-journey/model/policy-user-info.model';

@Injectable({
  providedIn: 'root'
})
export class HouseIncidentsActionService extends HouseIncidentsDynamicService {
  private planService = signal<HouseIncidentsDynamicService>(null);
  public serviceType = new ReplaySubject<HouseIncidentsServiceActionType>();
  private AServiceInstance = inject(HouseIncidentsAActionsService);
  private BServiceInstance = inject(HouseIncidentsBActionsService);

  setServiceType(type: string): void {
    switch (type) {
      case 'PaymentFirst':
        this.serviceType.next(HouseIncidentsServiceActionType.A);
        this.planService.set(this.AServiceInstance);
        break;
      case 'InfoFirst':
        this.serviceType.next(HouseIncidentsServiceActionType.B);
        this.planService.set(this.BServiceInstance);
        break;
    }
  }

  orderProduct(productCard: HouseIncidentProductCardModel, applicationId: string, orderDetail?: PolicyUserInfoModel): void {
    this.planService().orderProduct(productCard, applicationId, orderDetail);
  }

  sendToPayment(applicationId: string): void {
    this.planService().sendToPayment(applicationId);
  }

  completeInfo(applicationId: string, data: HouseIncidentCompleteInfoModel): Observable<boolean> {
    return this.planService().completeInfo(applicationId, data);
  }

  handlePaymentResult(providerId: string): Observable<boolean> {
    return this.planService().handlePaymentResult(providerId);
  }

  leaveCompleteInfo(): void {
    return this.planService().leaveCompleteInfo();
  }

  retryFailedPayment(applicationFormId: string): void {
    return this.planService().retryFailedPayment(applicationFormId);
  }

  openVoucherBottomSheet(orderDetail: PolicyUserInfoModel): any {
    return this.planService().openVoucherBottomSheet(orderDetail);
  }
}
