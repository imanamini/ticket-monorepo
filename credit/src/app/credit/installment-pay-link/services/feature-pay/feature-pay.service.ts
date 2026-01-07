import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ExistencePayFeatures, PAYMENT_GATEWAYS } from './payment-gateways';
import { MessageService } from '../../../core/services/message.service';
import { CreditApiService } from '../../../api/credit-api.service';
import { DpgPayService } from '../dpg/dpg-pay/dpg-pay.service';

@Injectable()
export class FeaturePayService {

  paySubscription: Subscription = null;

  constructor(
    private messageService: MessageService,
    private creditApiService: CreditApiService,
    private dpgPayService: DpgPayService,
  ) {
  }

  selectFeature(ticket: string): Observable<ExistencePayFeatures> {
    return new Observable(observer => {
      this.creditApiService.inAppTac(ticket).subscribe({
        next: res => {
          if (res.gateways.length >= 1) {
            const DEFAULT_GATEWAY = PAYMENT_GATEWAYS[res.gateways[0]];
            observer.next(DEFAULT_GATEWAY);
          }
        },
        error: e => {
          this.messageService.showErrorIfExists(e);
        }
      });
    });
  }

  payByIpg(payUrl: string) {
    window.location.replace(payUrl);
  }

  payByDpg(ticket: string, homeUrl: string, resultPageUrl: string, amount: number) {
    this.dpgPayService.startPayFlow(ticket, homeUrl, amount);
    this.paySubscription = this.dpgPayService.afterPay().subscribe(payResult => {
      if (payResult.result.status === 0) {
        this.dpgPayService.clear();
        if (this.paySubscription) {
          this.paySubscription.unsubscribe();
        }
        this.dpgPayService.goToPaymentResultPage(payResult, resultPageUrl);
      } else {
        this.messageService.showErrorMessage(payResult.result.message);
      }
    });
  }
}
