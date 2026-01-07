import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { HttpHeaders } from '@angular/common/http';
import { MessageService } from './message.service';
import { FEATURE_NAMES, FEATURES, GATEWAY_TO_FEATURE_MAP, PAYMENT_GATEWAYS } from './security.enum';
import { Feature, InAppTacResponse } from '../models/credit/in-app-tac.response';
import { CreditUrlService } from '../utils/url';
import { CreditWindow } from './credit-window';
import { NgxHybridServiceService } from '@digipay/ngx-hybrid-service';

declare const window: CreditWindow;

@Injectable({
  providedIn: 'root',
})
export class CreditPaymentService {
  constructor(
    private baseApiService: BaseApiService,
    private messageService: MessageService,
    private creditUrlService: CreditUrlService,
    private hybridService: NgxHybridServiceService,
  ) {}

  inAppTac(ticket: string): Observable<InAppTacResponse | any> {
    return this.baseApiService.post('users/in-app/tac', {}, new HttpHeaders().set('ticket', ticket));
  }

  pay(paymentType = 'credit', ticket: any, amount?: number, callbackPostfixUrl = '', relativeAfterResultUrl = ''): Promise<void> {
    return new Promise((resolve, reject) => {
      this.inAppTac(ticket).subscribe((tacResponse) => {
        if (tacResponse.gateways.length === 0) {
          // No gateways are available
          this.messageService.showErrorMessage('در حال حاضر امکان پرداخت وجود ندارد');
          reject(new Error('No payment gateways available'));
          return;
        }

        this.getAmountOfPayment(tacResponse, ticket, amount).then((newAmount) => {
          if (tacResponse.gateways.length >= 1) {
            const DEFAULT_GATEWAY = PAYMENT_GATEWAYS[tacResponse.gateways[0]];
            const featureCode = GATEWAY_TO_FEATURE_MAP[DEFAULT_GATEWAY];

            if (window.creditPayment && typeof window.creditPayment.pay === 'function') {
              const payload: any = {
                ticket,
                amount: newAmount!,
                fallbackUrl: this.creditUrlService.paymentCallbackUrl(paymentType, true, callbackPostfixUrl),
                payUrl: tacResponse.features[featureCode].url,
                callbackUrl: this.creditUrlService.paymentCallbackUrl(paymentType, true, callbackPostfixUrl),
                relativeCallbackUrl: this.creditUrlService.paymentCallbackUrl(paymentType, false, callbackPostfixUrl),
                relativeAfterResultUrl,
              };
              if (tacResponse.gateways.length === 1) {
                payload.preferredMethod = DEFAULT_GATEWAY;
              }
              window.creditPayment.pay(payload);
              resolve();
              return;
            }
            if (DEFAULT_GATEWAY === 'IPG') {
              this.goToIpg(tacResponse.features[featureCode].url, ticket);
              resolve();
              return;
            }
            this.messageService.showErrorMessage('خطا! مشکلی فنی رخ داده است.');
            reject(new Error('Payment gateway not supported'));
            return;
          }
        });
      });
    });
  }

  goToIpg(url: string, ticket: string): void {
    if (url) {
      if (url.slice(-1) !== '/') {
        url = url + '/';
      }
      if (this.hybridService.isHybrid()) {
        this.hybridService.openUrlInHybrid(url + ticket, false);
      } else {
        window.open(url + ticket, '_self');
      }
    }
  }

  private getAmountOfPayment(tacResponse: InAppTacResponse, ticket: string, amount?: number): Promise<number | undefined> {
    return new Promise<number | undefined>((resolve, reject) => {
      if (amount) {
        resolve(amount);
        return;
      }
      let infoUrl: string;
      try {
        const infoFeature = tacResponse.features[FEATURES[FEATURE_NAMES.SDK_INFO]] as Feature;
        infoUrl = infoFeature.url;
        infoUrl = infoUrl.split('/digipay/api/')[1];
      } catch (e) {
        reject(new Error('Failed to extract info URL from TAC response'));
        return;
      }
      if (!infoUrl!) {
        reject(new Error('Info URL is not available'));
        return;
      }
      this.baseApiService.get(infoUrl + ticket).subscribe({
        next: (payInfo) => {
          resolve(payInfo.amount);
        },
        error: (err) => {
          reject(new Error(`Failed to fetch payment info: ${err?.message || 'Unknown error'}`));
        },
      });
    });
  }
}
