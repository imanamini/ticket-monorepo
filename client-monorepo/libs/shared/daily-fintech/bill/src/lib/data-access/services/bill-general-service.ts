import { inject, Injectable } from '@angular/core';
import { ActionHandlerService, ActionType, SERVICE_ROUTES } from '@client-monorepo/common/action-handler';
import { FrequentServicesIdEnum } from '@client-monorepo/common/service-data';
import { BillPayment } from '../models/upcoming-bill.type';

@Injectable({
  providedIn: 'root',
})
export class BillGeneralService {
  actionHandlerService = inject(ActionHandlerService);

  billClick(bill: BillPayment): void {
    this.actionHandlerService.handle({
      type: ActionType.REDIRECT,
      payload: {
        url: SERVICE_ROUTES[FrequentServicesIdEnum.BILL] + '/identifier/0',
        params: {
          billId: bill.payload.billInfo.billId,
          payId: bill.payload.billInfo.payId,
        },
      },
    });
  }

  recommendationClick(recommendation: any): void {
    this.actionHandlerService.handle(recommendation.action);
  }
}
