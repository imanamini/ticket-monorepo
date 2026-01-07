import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DpgCardService, FEATURE_NAMES, FEATURES, PayClientApiService, PaymentResultInterface } from '@client-monorepo/payment/purchase';
import { TransactionType } from '@client-monorepo/payment/transactions';
import { Base64 } from 'js-base64';

@Injectable({
  providedIn: 'root',
})
export class DpgPayService {
  payResponse: Subject<PaymentResultInterface> = new Subject();
  transactionType!: TransactionType;

  constructor(
    private router: Router,
    private cardService: DpgCardService,
    private payClientApiService: PayClientApiService,
    @Inject('APP_ENV') private environment: { [key: string]: string },
  ) {}

  ticket = '';

  homeUrl = '/hub';

  amount!: number;

  certFile!: string;

  certText!: string;

  initiated = new BehaviorSubject<boolean>(false);

  payApiEndPoint!: string;

  startPayFlow(ticket: string, homeUrl: string, amount: number) {
    this.ticket = ticket;
    this.homeUrl = homeUrl;
    this.amount = amount;
    this.payClientApiService.getPaymentInfoAndInAppTac(this.ticket).then((response) => {
      this.certFile = response.paymentInfo.certFile;
      this.amount = response.paymentInfo.amount;
      this.transactionType = response.inAppTac.transactionType as TransactionType;
      // todo handle setting userHasPassword value for intrack events if is needed
      const dpgPayFeature = response.inAppTac.features[FEATURES[FEATURE_NAMES.PAYMENT_DPG]];
      const prefix = this.environment['base_url'];
      this.payApiEndPoint = dpgPayFeature.url!.substr(dpgPayFeature.url!.indexOf(prefix) + prefix.length);
      this.payClientApiService.getCertFile(this.certFile).subscribe((certText) => {
        this.certText = certText;
        this.initiated.next(true);
      });
    });
    this.router.navigateByUrl('/payment/dpg/pay');
  }

  afterPay() {
    return this.payResponse.asObservable();
  }

  clear() {
    this.ticket = '';
  }

  goToPaymentResultPage(paymentResult: PaymentResultInterface, destinationUrl = '') {
    const dest = destinationUrl || '/payment/result/dpg';

    if (dest.includes('dgp://', 0) || dest.includes('https://', 0)) {
      return this.handleWithOriginDestination(dest, paymentResult);
    }

    this.router
      .navigateByUrl(dest, {
        state: {
          paymentResult,
        },
      })
      .then();
  }

  handleWithOriginDestination(destination: string, paymentResult: PaymentResultInterface) {
    const data = destination.includes('?') ? '&data=' : '?data=';
    const finalDestination = destination + `${data}${this.encodeData(paymentResult)}`;
    window.open(finalDestination, 'self');
  }

  private encodeData(data: any) {
    return encodeURIComponent(Base64.encode(JSON.stringify(data)));
  }

  finalizePay(data: { cardNumber: string; cvv2: string; password: string; expirationDate: string }): Observable<PaymentResultInterface> {
    const request = {
      type: 'card',
      ticket: this.ticket,
      source: this.cardService.getCardPanDto(this.certText, data.cardNumber, data.expirationDate),
      encryptedPinDto: this.cardService.encryptCvv2AndPass(this.certText, data.cvv2, data.password),
      certFile: this.certFile,
    };
    return this.payClientApiService.payByDpg(this.payApiEndPoint, this.ticket, request).pipe(
      map((response) => {
        this.payResponse.next(response);
        return response;
      }),
      catchError((response) => {
        this.payResponse.next(response);
        return throwError(response);
      }),
    );
  }

  sendDynamicPass(pan: string, expirationDate: string): Promise<any> {
    return this.cardService.sendDynamicPass(this.ticket, this.amount, pan, expirationDate, this.transactionType);
  }
}
