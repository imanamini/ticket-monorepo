import { Injectable } from '@angular/core';
import { Base64 } from 'js-base64';
import { ActivatedRoute, Router } from '@angular/router';
import { CreditUrlService } from '../utils/url';
import { CreditNavigationService } from './credit-navigation.service';
import { map } from 'rxjs/operators';
import { fixActivityInfoArray } from '../utils/strings';
import { PaymentResult, statusPaymentResultType } from '@digipay/ngx-payment-result/lib/model/payment-result.model';

enum PaymentResultStatus {
  SUCCESS,
  FAILED,
}

const PaymentResultStatusMapper: Record<PaymentResultStatus, statusPaymentResultType> = {
  [PaymentResultStatus.SUCCESS]: 'success',
  [PaymentResultStatus.FAILED]: 'error',
};

@Injectable({
  providedIn: 'root',
})
export class CreditPaymentResultService {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private creditUrlService: CreditUrlService,
    private creditNavigationService: CreditNavigationService,
  ) {}

  public static getFixedData(result: any): PaymentResult {
    result.items = fixActivityInfoArray(result.activityInfo);
    if (result.paymentResult) {
      result.paymentResult = PaymentResultStatusMapper[result.paymentResult as PaymentResultStatus];
    } else {
      result.paymentResult = this.getPaymentResultFromPersianStatus(result.status);
    }
    return result;
  }

  private static getPaymentResultFromPersianStatus(status: string): statusPaymentResultType {
    const testRegexWithStatus = (reg: RegExp) => reg.test(status);

    let paymentResult: statusPaymentResultType;
    switch (true) {
      case testRegexWithStatus(/ناموفق/):
        paymentResult = 'error';
        break;
      case testRegexWithStatus(/موفق/):
        paymentResult = 'success';
        break;
      case testRegexWithStatus(/در انتظار/):
        paymentResult = 'waiting';
        break;
      case testRegexWithStatus(/منقضی شده/):
        paymentResult = 'error';
        break;
      case testRegexWithStatus(/لغو شده/):
        paymentResult = 'error';
        break;
      case testRegexWithStatus(/برگشت خورده/):
        paymentResult = 'error';
        break;
      case testRegexWithStatus(/نامشخص/):
        paymentResult = 'unKnown';
        break;
      default:
        paymentResult = 'error';
    }
    return paymentResult;
  }

  getPaymentResult(): Promise<PaymentResult> {
    return new Promise((resolve, reject) => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('data')) {
          const data = urlParams.get('data');
          if (data) {
            try {
              const decodedData = this.decodeData(data);
              // handle if data doesn't have activityInfo to prevent from crash
              if (!decodedData.activityInfo) {
                this.handleGetPaymentResultDefectiveData(resolve, reject);
                return;
              }
              return resolve(CreditPaymentResultService.getFixedData(decodedData));
            } catch (decodeError) {
              console.warn('[CreditPaymentResultService] Failed to decode payment result data:', decodeError);
              this.handleGetPaymentResultDefectiveData(resolve, reject);
              return;
            }
          }
        } else {
          this.handleGetPaymentResultDefectiveData(resolve, reject);
        }
      } catch (error) {
        console.error('[CreditPaymentResultService] Unexpected error in getPaymentResult:', error);
        reject(error || new Error('Unknown error occurred'));
      }
    });
  }

  handleGetPaymentResultDefectiveData(resolve: any, reject: any) {
    this.route.paramMap
      .pipe(map(() => window.history.state))
      .subscribe({
        next: (data) => {
          if (data?.paymentResult) {
            return resolve(CreditPaymentResultService.getFixedData(data.paymentResult));
          } else {
            this.creditNavigationService.closeService();
            reject(new Error('Operation failed: No payment result in state'));
          }
        },
        error: (error) => {
          console.warn('[CreditPaymentResultService] Error getting payment result from route state:', error);
          this.creditNavigationService.closeService();
          reject(new Error('Operation failed: Route state error'));
        },
      });
  }

  decodeData(data: string) {
    return JSON.parse(Base64.decode(decodeURIComponent(data)));
  }

  navigateTo(url: string) {
    this.router.navigateByUrl(this.creditUrlService.getInnerServicePath(url));
  }
}
