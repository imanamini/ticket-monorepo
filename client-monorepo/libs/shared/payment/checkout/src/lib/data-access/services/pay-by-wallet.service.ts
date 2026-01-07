import { inject, Injectable } from '@angular/core';
import { PaymentCheckoutApiService } from './payment-checkout-api.service';
import { TicketInfoService } from './ticket-info.service';
import { RedirectService } from './redirect.service';
import { TgsSelectFeatureResponse } from '../models/tgs-select-feature-response';
import { removeBaseUrlOfUrl, removeUrlOrigin } from '../../utils/operating-on-url';
import { Base64 } from 'js-base64';
import { Router } from '@angular/router';
import { PaymentResultInterface, TicketTypes } from '@client-monorepo/payment/purchase';
import { MessageService } from '@client-monorepo/common/utilities';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { FactoryService } from './factory.service';

@Injectable({
  providedIn: 'root',
})
export class PayByWalletService {
  private paymentCheckoutApiService = inject(PaymentCheckoutApiService);
  private ticketInfoService = inject(TicketInfoService);
  private redirectService = inject(RedirectService);
  private messageService = inject(MessageService);
  private bottomSheetService = inject(NgxBottomSheetService);
  private factoryService = inject(FactoryService);
  router = inject(Router);

  public async completePaymentProcess(selectedFeatureInfo: TgsSelectFeatureResponse): Promise<void> {
    const payUrl = removeBaseUrlOfUrl(selectedFeatureInfo.payUrl);
    this.paymentCheckoutApiService.tgsPayByWallet(payUrl, this.ticketInfoService.ticket()).subscribe({
      next: async (response: PaymentResultInterface) => {
        if (Number(this.ticketInfoService.state.type) === TicketTypes.UPG) {
          this.redirectToMerchantDirectly(selectedFeatureInfo, response);
        } else {
          this.redirectToReceipt(selectedFeatureInfo, response);
        }
      },
      error: (error) => {
        this.closeBottomSheetMethod();
        this.messageService.showErrorOfErrorResponse(error);
      },
    });
  }

  private closeBottomSheetMethod(): void {
    if (this.factoryService.isBottomSheetOpen()) {
      this.bottomSheetService.closeBottomSheet();
    }
  }

  private redirectToMerchantDirectly(selectedFeatureInfo: TgsSelectFeatureResponse, response: PaymentResultInterface): void {
    const redirectUrl: string = this.findRedirectUrl(response, selectedFeatureInfo);
    const result = this.populateResultPayment(selectedFeatureInfo, response);
    this.redirectService.url.next(redirectUrl);
    this.redirectService.setAndRedirect([...result]);
  }

  private populateResultPayment(selectedFeatureInfo: TgsSelectFeatureResponse, response: any) {
    return [
      { key: 'result', value: 'SUCCESS' },
      { key: 'type', value: TicketTypes.UPG },
      { key: 'psp', value: null },
      { key: 'amount', value: selectedFeatureInfo.amount },
      { key: 'providerId', value: this.ticketInfoService.state.providerId },
      { key: 'trackingCode', value: response?.payInfo.trackingCode },
    ];
  }

  private redirectToReceipt(selectedFeatureInfo: TgsSelectFeatureResponse, response: PaymentResultInterface): void {
    //When the user enters our app from the hybrid app,
    // since TGS is opened as a web view,
    // the user is still within the application.
    // Therefore, when they select the wallet feature,
    // we need to change the callback URL provided by the super app to HTTPS.
    const redirectUrl: string = selectedFeatureInfo.redirectUrl;
    const responseBase64 = Base64.encode(JSON.stringify(response));
    const removedUrlOrigin = removeUrlOrigin(redirectUrl);
    this.router
      .navigate([removedUrlOrigin], {
        queryParams: { data: responseBase64, result: response.paymentResult },
      })
      .then(() => {
        this.closeBottomSheetMethod();
      });
  }

  private findRedirectUrl(paymentResult: PaymentResultInterface, selectedFeatureInfo: TgsSelectFeatureResponse): string {
    if (paymentResult?.redirectDetail?.path) {
      return paymentResult?.redirectDetail?.path;
    } else {
      return selectedFeatureInfo.redirectUrl;
    }
  }
}
