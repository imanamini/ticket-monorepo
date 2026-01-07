import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { PaymentResult } from './models/payment-result.model';
import { PayClientService } from '../pay-client/pay-client.service';
import { CardService } from '../card/card.service';
import { FEATURE_NAMES } from './models/features';
import { environment } from '../../../../../../environments/environment';
import { FeaturesService } from '../features/features.service';
import { catchError, map } from 'rxjs/operators';
import { IplService } from '../../ipl.service';
import { RefererShortKey } from '../../../models/referer.model';

@Injectable()
export class DpgPayService {

  payResponse: Subject<PaymentResult> = new Subject();
  transactionType: number;
  ticket = null;
  homeUrl = `ipl/${this.iplService.userInfo().uuid}/cell-number?${RefererShortKey}=${this.iplService.referer()}`;
  amount: number;
  certFile: string;
  certText: string;
  initiated = new BehaviorSubject<boolean>(false);
  payApiEndPoint: string;

  constructor(
    private router: Router,
    private cardService: CardService,
    private featuresService: FeaturesService,
    private payClient: PayClientService,
    private iplService: IplService,
  ) {
  }

  startPayFlow(ticket: string, homeUrl: string, amount: number) {
    this.ticket = ticket;
    this.homeUrl = homeUrl;
    this.amount = amount;
    this.payClient.getPaymentInfoAndInAppTac(this.ticket).then(response => {
      this.certFile = response.paymentInfo.certFile;
      this.amount = response.paymentInfo.amount;
      this.transactionType = response.inAppTac.transactionType;
      this.featuresService.setFeatures(response.inAppTac);
      const dpgPayFeature = this.featuresService.getFeature(FEATURE_NAMES.PAYMENT_DPG);
      const prefix = environment.api_url;
      this.payApiEndPoint = dpgPayFeature.url.substr(dpgPayFeature.url.indexOf(prefix) + prefix.length);
      this.payClient.getCertFile(this.certFile).subscribe(certText => {
        this.certText = certText;
        this.initiated.next(true);
      });
    });
    this.router.navigateByUrl(`ipl/${this.iplService.userInfo().uuid}/dpg/pay`);
  }

  afterPay() {
    return this.payResponse.asObservable();
  }

  clear() {
    this.ticket = null;
  }

  goToPaymentResultPage(paymentResult: PaymentResult, destinationUrl: string = null) {
    const dest = destinationUrl || '/payment/result/dpg';
    this.router.navigateByUrl(dest, {
      state: {
        paymentResult,
      }
    });
  }

  finalizePay(data: {
    cardNumber: string,
    cvv2: string,
    password: string,
    expirationDate: string
  }): Observable<PaymentResult> {
    const request = {
      type: 'card',
      ticket: this.ticket,
      source: this.cardService.getCardPanDto(this.certText, data.cardNumber, data.expirationDate),
      encryptedPinDto: this.cardService.encryptCvv2AndPass(this.certText, data.cvv2, data.password),
      certFile: this.certFile
    };
    return this.payClient.payByDpg(this.payApiEndPoint, this.ticket, request).pipe(map(response => {
      this.payResponse.next(response);
      return response;
    }), catchError(response => {
      this.payResponse.next(response);
      return throwError(response);
    }));
  }

  sendDynamicPass(pan: string, expirationDate: string): Promise<any> {
    return this.cardService.sendDynamicPass(
      this.ticket, this.amount, pan, expirationDate, this.transactionType
    );
  }
}
