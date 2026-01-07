import {inject, Injectable} from '@angular/core';
import {UpgFeatureName} from '../../../../../api/emuns/upg-feature-name.emun';
import {TgsSelectFeatureResponse} from '../../../../../api/models/tgs-select-feature-response';
import {TgsSelectFeatureBody} from '../../../../../api/models/tgs-select-feature-body';
import {PaymentMethodService} from './payment-method.service';
import {HandleErrorService} from '../../../services/handle-error.service';
import {ApiResult} from '../../../../../api/models/api-result';
import {TicketInfoService} from '../../../services/ticket-info.service';
import {NewUpgService} from "../../../../../api/services/new-upg/new-upg.service";
import {HttpErrorResponse} from "@angular/common/http";

@Injectable()
export class FeatureInformationService {
  newUpgService = inject(NewUpgService);
  paymentMethodService = inject(PaymentMethodService);
  handleErrorService = inject(HandleErrorService);
  ticketInfoService = inject(TicketInfoService);

  public get(selectedFeatureName: UpgFeatureName): Promise<TgsSelectFeatureResponse> {
    return new Promise<TgsSelectFeatureResponse>((resolve, reject) => {
      const selectFeatureApiBody: TgsSelectFeatureBody = {
        ticket: this.ticketInfoService.ticket,
        featureName: selectedFeatureName
      };
      this.newUpgService.tgsSelectFeature(selectFeatureApiBody)
        .subscribe(
          (response: TgsSelectFeatureResponse) => {
            resolve(response);
          },
          (errorResponse: HttpErrorResponse) => {
            reject(errorResponse);
            this.handleErrorService.check(errorResponse.error.result);
          }
        );
    });
  }

  async getLatestSelectedFeatureInfo(selectedFeatureName: number): Promise<TgsSelectFeatureResponse> {
    if (this.paymentMethodService.selectedFeatureInfo) {
      return this.paymentMethodService.selectedFeatureInfo;
    }
    return await this.get(selectedFeatureName);
  }
}
