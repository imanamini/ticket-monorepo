import {inject, Injectable} from '@angular/core';
import {TgsSelectFeatureResponse} from '../../../../api/models/tgs-select-feature-response';
import {removeBaseUrlOfUrl} from '../../utils/operating-on-url';
import {TicketInfoService} from '../../services/ticket-info.service';
import {UrlService} from '../../services/url.service';
import {PaymentResult} from '../../../../api/models/payment-result.response';
import {TgsTicketInfoResponse} from '../../../../api/models/tgs-ticket-info.response';
import {BottomSheetService} from '../../services/bottom-sheet.service';
import {NewUpgService} from "../../../../api/services/new-upg/new-upg.service";
import {RedirectService} from "../../../../core/services/redirect.service";
import {TicketType} from '../../../../api/emuns/ticket-type.emun';
import {ConvertorDeepLinkToHttpsProtocol} from "../../services/convertor-deeplink-url.service";

@Injectable()
export class PayByWalletService {
  private newUpgService = inject(NewUpgService);
  private ticketInfoService = inject(TicketInfoService);
  private bottomSheetService = inject(BottomSheetService);
  private urlService = inject(UrlService);
  private redirectService = inject(RedirectService);
  private convertorDeepLinkToHttpsProtocol = inject(ConvertorDeepLinkToHttpsProtocol);

  public async completePaymentProcess(selectedFeatureInfo: TgsSelectFeatureResponse): Promise<void> {
    const payUrl = removeBaseUrlOfUrl(selectedFeatureInfo.payUrl);
    this.newUpgService.tgsPayByWallet(payUrl, this.ticketInfoService.ticket)
      .subscribe(async (response: PaymentResult) => {
        await this.closeBottomSheet();
        if (Number(this.ticketInfoService.state.type) === TicketType.UPG) {
          this.redirectToMerchantDirectly(selectedFeatureInfo , response)
        } else {
          this.redirectToReceipt(selectedFeatureInfo , response);
        }
      });
  }

  private redirectToMerchantDirectly(selectedFeatureInfo:TgsSelectFeatureResponse , response: PaymentResult): void {
    const redirectUrl:string = this.findRedirectUrl(response , selectedFeatureInfo);
    const result = this.populateResultPayment(selectedFeatureInfo, response);
    this.redirectService.url.next(redirectUrl);
    this.redirectService.setAndRedirect([...result]);
  }

  private populateResultPayment(selectedFeatureInfo: TgsSelectFeatureResponse, response: PaymentResult) {
    const result = [
      {key: 'result', value: 'SUCCESS'},
      {key: 'type', value: TicketType.UPG},
      {key: 'psp', value: null},
      {key: 'amount', value: selectedFeatureInfo.amount},
      {key: 'providerId', value: this.ticketInfoService.state.providerId},
      {key: 'trackingCode', value: response.payInfo.trackingCode},
    ];
    return result;
  }

  private navigateRoReceipt(paymentResult: PaymentResult, ticketInfo: TgsTicketInfoResponse): void {
    this.urlService.navigateToInternalUrlByUrl(`/payment/result/${this.ticketInfoService.ticket}`, {
      state: {
        result: paymentResult,
        ticketInfo: ticketInfo,
      }
    });
  }

  private closeBottomSheet(): void {
    this.bottomSheetService.close();
  }


  private redirectToReceipt(selectedFeatureInfo: TgsSelectFeatureResponse, response: PaymentResult): void {
    //When the user enters our app from the hybrid app,
    // since TGS is opened as a web view,
    // the user is still within the application.
    // Therefore, when they select the wallet feature,
    // we need to change the callback URL provided by the super app to HTTPS.
    const redirectUrl:string = this.findRedirectUrl(response , selectedFeatureInfo);
    const convertedRedirectUrl = this.convertorDeepLinkToHttpsProtocol.convert(redirectUrl)
    let newTicketInfo = {...this.ticketInfoService.state, redirectUrl: convertedRedirectUrl};
    if(response.redirectDetail){
      response = Object.assign(response, {
        redirectDetail: {
          path: convertedRedirectUrl
        }
      });
    }
    this.navigateRoReceipt(response, newTicketInfo);
  }

  private findRedirectUrl(paymentResult: PaymentResult , selectedFeatureInfo: TgsSelectFeatureResponse):string{
    if(paymentResult?.redirectDetail?.path){
      return paymentResult?.redirectDetail?.path
    }else{
      return selectedFeatureInfo.redirectUrl
    }
  }
}
