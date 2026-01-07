import { Inject, inject, Injectable } from '@angular/core';
import { PaymentMethodService } from './payment-method.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TicketInfoService } from './ticket-info.service';
import { PaymentCheckoutApiService } from './payment-checkout-api.service';
import { TgsSelectFeatureResponse } from '../models/tgs-select-feature-response';
import { TgsSelectFeatureBody } from '../models/tgs-select-feature-body';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';
import { APP_ACTIONS } from '@client-monorepo/common/action-handler';
import { FactoryService } from './factory.service';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { MessageService } from '@client-monorepo/common/utilities';

@Injectable({
  providedIn: 'root',
})
export class FeatureInformationService {
  paymentCheckoutApiService = inject(PaymentCheckoutApiService);
  paymentMethodService = inject(PaymentMethodService);
  ticketInfoService = inject(TicketInfoService);
  factoryService = inject(FactoryService);
  bottomSheetService = inject(NgxBottomSheetService);
  messageService = inject(MessageService);
  constructor(@Inject('APP_ENV') private environment: { [key: string]: string }) {}

  public get(selectedFeatureName: any): Promise<TgsSelectFeatureResponse> {
    return new Promise<TgsSelectFeatureResponse>((resolve, reject) => {
      const selectFeatureApiBody: TgsSelectFeatureBody = {
        ticket: this.ticketInfoService.ticket(),
        featureName: selectedFeatureName,
        ...this.ticketInfoService.appPayFeaturesBody(),
      };

      this.paymentCheckoutApiService
        .tgsSelectFeature(selectFeatureApiBody)
        .pipe(
          switchMap((response) => (this.shouldModifyBpgPayUrl(selectedFeatureName) ? this.getModifiedBpgPayUrl(response) : of(response))),
        )
        .subscribe({
          next: resolve, // Ensures modified response is resolved
          error: (error: HttpErrorResponse) => {
            if (this.factoryService.isBottomSheetOpen()) {
              this.bottomSheetService.closeBottomSheet();
            }
            this.messageService.showErrorOfErrorResponse(error);
            reject(error);
          },
        });
    });
  }

  private shouldModifyBpgPayUrl(selectedFeatureName: any): boolean {
    return (
      selectedFeatureName.toString() === APP_ACTIONS.PAYMENT_BPG.toString() &&
      (this.paymentMethodService.selectedFeature()?.redirectToCustomPayUrl ?? false)
    );
  }

  private getModifiedBpgPayUrl(response: TgsSelectFeatureResponse): Observable<TgsSelectFeatureResponse> {
    return this.paymentCheckoutApiService.getPurchaseCreditInfoApi(this.ticketInfoService.ticket()).pipe(
      map((creditResponse) => {
        if (creditResponse?.creditDetails?.length === 0) {
          return response;
        }
        const selectedCreditInfo = creditResponse.creditDetails.find(
          (credit) => credit.creditId === this.paymentMethodService.selectedFeature()?.creditId,
        );
        return {
          ...response,
          payUrl: `${this.environment['bnpl_1pay_purchase_url']}/${this.ticketInfoService.ticket()}/${selectedCreditInfo?.fundProvider.businessId}/${selectedCreditInfo?.creditId}`,
        };
      }),
      // If API fails, return the pure response
      catchError(() => of(response)),
    );
  }

  async getLatestSelectedFeatureInfo(selectedFeatureName: number): Promise<TgsSelectFeatureResponse> {
    return await this.get(selectedFeatureName);
  }
}
