import {environment} from '../../../environments/environment';
import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {TacApiService} from '../../api/digipay/tac-api.service';
import {InAppTacResponse} from '../../api/digipay/models/tac/in-app-tac.response';
import {PaymentGateways} from '../../api/digipay/models/tac/payment-gateways';
import {Protections} from '../../api/digipay/models/tac/protections';
import {UserService} from './user.service';
import {MatDialog} from '@angular/material/dialog';
import {UiDialogOtpComponent} from '../../ui/ui-components/ui-dialogs/ui-dialog-otp/ui-dialog-otp.component';
import {OtpDialogData} from '../../ui/ui-components/ui-dialogs/ui-dialog-otp/models/otp-dialog-data';
import {Features} from '../../api/digipay/models/tac/features';
import {OtpDialogResult} from '../../ui/ui-components/ui-dialogs/ui-dialog-otp/models/otp-dialog-result';
import {UiDialogPinComponent} from '../../ui/ui-components/ui-dialogs/ui-dialog-pin/ui-dialog-pin.component';
import {PinDialogData} from '../../ui/ui-components/ui-dialogs/ui-dialog-pin/models/pin-dialog-data';
import {PinDialogResult} from '../../ui/ui-components/ui-dialogs/ui-dialog-pin/models/pin-dialog-result';
import {WalletApiService} from '../../api/digipay/wallet-api.service';
import {PaymentResult, PaymentResultStatus} from '../../api/digipay/models/payment/payment-result';
import {HttpErrorResponse} from '@angular/common/http';
import {
  UiDialogPaymentResultComponent
} from '../../ui/ui-components/ui-dialogs/ui-dialog-payment-result/ui-dialog-payment-result.component';
import {ActivatedRoute, Router} from '@angular/router';
import {Base64} from 'js-base64';
import {fixActivityInfoArray} from '../../utils/object';
import {
  PaymentResultDialogData
} from '../../ui/ui-components/ui-dialogs/ui-dialog-payment-result/models/payment-result-dialog-data';
import {BehaviorSubject} from 'rxjs';
import {PayClient} from '@digipay/ng-payment';
import {MessageService} from '@client-monorepo/common/utilities';
import {StorageInterface} from '@digipay/ng-storage';
import {StorageSchema} from '../models/storage-schema';
import {GuestUserService} from './guest-user.service';
import {UiCarrier} from '../../ui/models/ui-carrier';
import {isPlatformBrowser} from "@angular/common";

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  walletBalance: BehaviorSubject<number> = new BehaviorSubject(0);

  notPossibleMsg = 'در حال حاضر امکان پرداخت با این روش وجود ندارد';

  // These routes themselves handle data of query param for payment result.
  routesWithoutPaymentResultDialog = ['/service/credit', '/services/car-fine'];

  constructor(
    @Inject('StorageInterface') public storage: StorageInterface<StorageSchema>,
    private tacApi: TacApiService,
    private user: UserService,
    private matDialog: MatDialog,
    private walletApi: WalletApiService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private guestUserService: GuestUserService,
    @Inject(PLATFORM_ID) private platformId: string,
  ) {
    this.route.queryParams.subscribe((params) => {
      // TEST
      // params.data = 'eyJyZXN1bHQiOnsidGl0bGUiOiJTVUNDRVNTIiwic3RhdHVzIjowLCJtZXNzYWdlIjoi2LnZhdmE24zYp9iqINio2Kcg2YXZiNmB2YLbjNiqINin2YbYrNin2YUg2LTYryIsImxldmVsIjoiSU5GTyJ9LCJwYXltZW50UmVzdWx0IjoxLCJwYXlJbmZvIjoie1widHJhY2tpbmdDb2RlXCI6XCIxOTQ3OTQyMjQ5MTYwNjc0NzkwMjYxMlwiLFwicnJuXCI6bnVsbCxcInBzcFwiOlwiMDA0XCIsXCJwcm92aWRlcklkXCI6XCIxOTQ3OTQyMjQ5MTYwNjc0NzkwMjYxMlwifSIsInN0YXR1cyI6ItmG2KfZhdmI2YHZgiIsImNvbG9yIjoxNDIzNTIzMiwiaW1hZ2VJZCI6Ik1UTiIsInRpdGxlIjoi2LTYp9ix2pgg2KfbjNix2KfZhtiz2YQiLCJhbW91bnQiOjEwMDAwMCwibWVzc2FnZSI6IjxodG1sPjxib2R5PjxkaXY-2K_YsSDYtdmI2LHYqiDaqdiz2LEg2LTYr9mGINmF2KjZhNi6LCDZiNis2Ycg2YXZiNix2K8g2YbYuNixINit2K_Yp9qp2KvYsSDYqtinIDxzdHJvbmc-27fbsiDYs9in2LnYqjxzdHJvbmc-INio2Ycg2K3Ys9in2Kgg2LTZhdinINio2KfYstqv2LTYqiDYr9in2K_ZhyDYrtmI2KfZh9ivINi02K8iLCJhY3Rpdml0eUluZm8iOnsiMCI6eyLYtNmF2KfYsdmHINmH2YXYsdin2YciOiIwOTAxODczNjQ5MiJ9LCIxIjp7ItmG2YjYuSDYtNin2LHamCI6ItmF2LPYqtmC24zZhSJ9LCIyIjp7Itiy2YXYp9mGIjoi27Hbs9u527kv27DbuS_bsduwIC0g27HbuDrbstuxIn0sIjMiOnsi2qnYr9ix2Yfar9uM2LHbjCI6IjE5NDc5NDIyNDkxNjA2NzQ3OTAyNjEyIn19fQ%3D%3D';
      let handleDataParam = true;
      this.routesWithoutPaymentResultDialog.forEach((routeUrl) => {
        if (this.router.url.split('?')[0].includes(routeUrl)) {
          handleDataParam = false;
        }
      });
      if (params.callbackUrl && !params.openApp) {
        this.router.navigate([params.callbackUrl], {
          queryParams: {
            data: params.data,
            trackingCode: params.trackingCode,
          },
        });
        handleDataParam = false;
      }
      if (!handleDataParam) {
        return;
      }
      if (params.data) {
        const url = this.handleDataParameter(params.data, params.callbackUrl, params.trackingCode);

        // remove the query parameter after processing it
        //  otherwise the user will see a dialog each time
        // that refreshes the page
        this.router.navigate([], {
          queryParams: {
            data: null,
          },
          queryParamsHandling: 'merge',
        });
      }
    });
  }

  getWalletBalance(): void {
    this.walletApi.getWalletBalance().subscribe((res) => {
      this.walletBalance.next(res.amount);
    });
  }

  generatePaymentUrl(
    serviceName: 'top-up' | 'internet' | 'bill' | 'toll' | 'c-wallet' | 'services/car-fine' = null,
    routeQueryParams = {},
  ): string {
    const queryParams: any = Object.assign({}, routeQueryParams);
    let queryParamsStr = '';

    const parts = [];
    Object.keys(queryParams).forEach((k) => {
      parts.push(k + '=' + queryParams[k]);
    });
    queryParamsStr += parts.join('&');

    const prefix = environment.pay_prefix || '';
    if (serviceName) {
      return window.location.origin + prefix + '/' + serviceName + queryParamsStr;
    }

    return window.location.origin + prefix + queryParamsStr;
  }

  payByWallet(paymentTicket: string, fallbackUrl?: string): Promise<PaymentResult | HttpErrorResponse | string> {
    this.storage.patch({
      insiderBody: {
        parameters: {
          pay: 'wallet',
        },
      },
    });
    return new Promise<any>((resolve, reject) => {
      this.getTacForPayment(paymentTicket)
        .then((tacResponse) => {
          if (tacResponse.gateways.indexOf(PaymentGateways.WALLET) < 0) {
            reject(this.notPossibleMsg);
            return;
          }

          if (!tacResponse.features.hasOwnProperty(Features.PAYMENT_WALLET)) {
            reject(this.notPossibleMsg);
            return;
          }

          const feature = tacResponse.features[Features.PAYMENT_WALLET];

          let payPromise = null;

          switch (feature.isProtected) {
            case Protections.PIN:
              payPromise = this.getPasswordThenFinalize(paymentTicket);
              break;
            case Protections.OTP:
            case Protections.IN_APP_VERIFICATION:
              payPromise = this.verifyWithOtp(paymentTicket);
              break;
            case Protections.NONE:
              // no protection, jump to finalize a step
              payPromise = new Promise<void>((r) => {
                r();
              });
              break;
          }

          if (payPromise) {
            return payPromise.then(() => {
              return this.finalizeWalletPayment(feature.relativeUrl, paymentTicket).then((paymentResult) => {
                if (fallbackUrl) {
                  this.router.navigateByUrl(fallbackUrl, {
                    state: {
                      paymentResult,
                    },
                  });
                } else {
                  if (!Array.isArray(paymentResult.activityInfo)) {
                    // convert the `activityInfo` object into Array
                    paymentResult.activityInfo = fixActivityInfoArray(paymentResult.activityInfo);
                    // there is a hard-coded message for successful
                    // transactions that needs to be set
                    paymentResult = this.setHarcodedMessage(paymentResult);
                  }
                  this.openResultDialog(paymentResult);
                }

                resolve(paymentResult);
              });
            });
          }
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  payByIpg(paymentTicket: string): Promise<void> {
    this.storage.patch({
      insiderBody: {
        parameters: {
          pay: 'ipg',
        },
      },
    });
    return new Promise<void>((resolve, reject) => {
      this.getTacForPayment(paymentTicket)
        .then((tacResponse) => {
          if (tacResponse.gateways.indexOf(PaymentGateways.IPG) < 0) {
            reject(this.notPossibleMsg);
            return;
          }

          if (!tacResponse.features.hasOwnProperty(Features.PAYMENT_IPG)) {
            reject(this.notPossibleMsg);
            return;
          }

          const feature = tacResponse.features[Features.PAYMENT_IPG];

          const URL = feature.url + '/' + paymentTicket + '?inbrowser=1';
          if (isPlatformBrowser(this.platformId)) {
            window.location.href = URL
          }

          resolve();
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  // payByDpg(
  //   paymentTicket: string, resultPageUrl: string = null, amount: number = 0
  // ): Promise<PaymentResult | HttpErrorResponse | string> {
  //   return new Promise<PaymentResult | HttpErrorResponse | string>((resolve, reject) => {
  //     this.getTacForPayment(paymentTicket).then(tacResponse => {
  //       this.dpgService.startPayFlow(paymentTicket, tacResponse).subscribe(result => {
  //         if (!result || result.status === 'failed') {
  //           reject();
  //         }
  //       });
  //       const paySubscription = this.dpgService.afterPay().subscribe(paymentResult => {
  //         if (paySubscription) {
  //           paySubscription.unsubscribe();
  //         }
  //         if (resultPageUrl) {
  //           this.router.navigateByUrl(resultPageUrl, {
  //             state: {
  //               paymentResult,
  //             }
  //           });
  //         } else {
  //           if (!Array.isArray(paymentResult.activityInfo)) {
  //             // convert the `activityInfo` object into array
  //             paymentResult.activityInfo = fixActivityInfoArray(paymentResult.activityInfo);
  //             // there is a hard-coded message for successful
  //             // transactions that needs to be set
  //             paymentResult = this.setHarcodedMessage(paymentResult);
  //           }
  //           this.openResultDialog(paymentResult);
  //         }
  //         resolve(paymentResult);
  //       });
  //     }).catch(e => reject(e));
  //   });
  // }

  openResultDialog(result: PaymentResult, redirect = true, backButtonText = null): void {
    const url = this.getTargetUrl(result);
    // const insiderBody = {
    //   'event_name': 'topUpResult',
    //   'parameters': {
    //     'status': result.status,
    //     'amount': result.amount,
    //   }
    // };
    this.storage.patch({
      insiderBody: {
        parameters: {
          status: result.status,
        },
      },
    });
    if (redirect && url) {
      this.router.navigate([url]).then(() => {
        this.openDialog(result, backButtonText);
      });
    } else {
      this.openDialog(result, backButtonText);
    }
  }

  payUsingTheNativeSdk(createTicketRes: any): boolean {
    if (environment.name === 'staging') {
      // for some reason, SDK is not available at the staging environment
      return false;
    }
    // useSDK is a variable that being injected
    // into the page by the DK's Application
    // @ts-ignore
    if (
      window.hasOwnProperty('useSDK') &&
      // window.useSDK &&
      PayClient.isSupported()
    ) {
      PayClient.pay({
        fallbackUrl: createTicketRes.fallbackUrl || '',
        payUrl: createTicketRes.payUrl || '',
        amount: 0,
        ticket: createTicketRes.ticket,
        callbackUrl: this.addQueryParamToUrl(
          window.location.origin,
          createTicketRes.callbackUrl
            ? {
              inapp: '1',
              callbackUrl: createTicketRes.callbackUrl,
            }
            : {
              inapp: '1',
            },
        ),
      });
      return true;
    }

    return false;
  }

  addQueryParamToUrl(
    url: string,
    params: {
      [key: string]: string | number;
    },
  ): string {
    let output = url;
    output += url.indexOf('?') >= 0 ? '&' : '?';
    const paramsStringArr = Object.keys(params).map((key) => {
      return key + '=' + params[key];
    });
    return output + paramsStringArr.join('&');
  }

  /**
   * Verify the user's identity with OTP then
   * call the finalize api
   */
  private verifyWithOtp(ticket: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.user.getCellNumber().then(
        (cellNumber) => {
          this.matDialog
            .open(UiDialogOtpComponent, {
              width: '360px',
              data: {
                cellNumber,
                ticket,
                features: [Features.PAYMENT_WALLET],
              } as OtpDialogData,
            })
            .afterClosed()
            .subscribe((result: OtpDialogResult) => {
              if (result && result.verified) {
                resolve();
              } else {
                reject();
              }
            });
        },
        (e) => {
          reject();
        },
      );
    });
  }

  private getPasswordThenFinalize(paymentTicket: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.user.getUserId().then(
        (userId) => {
          this.matDialog
            .open(UiDialogPinComponent, {
              data: {
                userId,
                features: [Features.PAYMENT_WALLET],
                ticket: paymentTicket,
              } as PinDialogData,
            })
            .afterClosed()
            .subscribe((result: PinDialogResult) => {
              if (result && result.verified) {
                resolve();
              } else {
                reject();
              }
            });
        },
        (e) => {
          reject();
        },
      );
    });
  }

  private getTacForPayment(ticket: string): Promise<InAppTacResponse> {
    return this.tacApi.getTac(ticket).toPromise();
  }

  private finalizeWalletPayment(payUrl: string, ticket: string): Promise<PaymentResult> {
    return this.walletApi.payByWallet(payUrl, ticket).toPromise();
  }

  private getTargetUrl(result: PaymentResult): string {
    // always return to service itself
    // const inService = window.location.href.indexOf('in-service-pay') >= 0;

    // if (inService) {
    // always return to service itself
    return null;
    // }

    // return result.paymentResult === 0 ? '/services/charge/.' : null;
  }

  private setHarcodedMessage(result: PaymentResult): PaymentResult {
    const m = '<p>پرداخت سریع و امن با دیجی‌پی</p>';
    if (result.paymentResult === 0) {
      result.message = m;
    }
    return result;
  }

  private handleDataParameter(data: string, callbackUrl = '', trackingCode = ''): string {
    data = decodeURIComponent(data);
    let decodedData = JSON.parse(Base64.decode(data));
    decodedData.activityInfo = fixActivityInfoArray(decodedData.activityInfo);
    decodedData = this.setHarcodedMessage(decodedData);
    this.openResultDialog(decodedData, true, 'بازگشت به دیجی‌پی');
    // redirect successful transactions to the homepage
    return this.getTargetUrl(decodedData);
  }

  private openDialog(result: PaymentResult, backButtonText = null): void {
    this.matDialog.open(UiDialogPaymentResultComponent, {
      width: '450px',
      maxWidth: '90%',
      panelClass: ['ui-dialog-container', 'ui-payment-dialog-container'],
      data: {
        paymentResult: result,
        backButtonText,
      } as PaymentResultDialogData,
    });
    if (result.paymentResult === PaymentResultStatus.SUCCESS) {
      if (!this.user.isLoggedIn.getValue() && result.imageId && result.activityInfo[0].value && result.activityInfo[0].value) {
        this.guestUserService.addNumberToCache(result.activityInfo[0].value, {
          icon: result.imageId,
          value: result.activityInfo[0].value,
          label: result.activityInfo[0].value,
        } as UiCarrier);
      }
      this.messageService.showSuccessMessage('در صورت شارژ نشدن سیم کارت انتخابی مبلغ به کیف پول دیجی پی واریز خواهد شد.');
    }
  }
}
