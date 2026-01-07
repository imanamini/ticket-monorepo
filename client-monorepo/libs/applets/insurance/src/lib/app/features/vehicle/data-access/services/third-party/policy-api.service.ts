import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { VehiclePolicyResultModel } from '../../models/third-party/policy/vehicle-policy-result.model';
import { UatGeneralResponse } from '../../models/uat-general.response';
import { BaseApiService } from '../shared/base-api.service';
import { ApplicationFormGetResponseModel } from '../../models/application-form/application-form-get-response.model';
import { InsuranceProductTypeEnum } from '../../../../../data-access/enums/Insurance-product-type.enum';
import {
  MotorPolicyResultModel,
  ResponseMotorPolicyResultModel,
} from '../../../features/third-party-motor/data-access/models/motor-policy-result-model';

import { map } from 'rxjs/operators';
import { OrderAndFilterParametersModel } from '../../../../../data-access/models/order-and-filter-parameters.model';
import { ThirdPartyDownloadPolicyModel } from '../../models/third-party/policy/third-party-download-policy.model';
import { DownloadEndorsementModel } from '../../models/download-endorsement.model';

@Injectable({
  providedIn: 'root',
})
export class PolicyApiService extends BaseApiService {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  downloadPolicyThirdparty(id: string): Observable<UatGeneralResponse<ThirdPartyDownloadPolicyModel>> {
    const params = new HttpParams().set('outputType', 'url');
    return super.get(this.baseUrlV2 + 'profile/application-forms/' + id + '/download-policy', params);
  }

  downloadPolicyThirdpartyMotor(id: string): Observable<UatGeneralResponse<ThirdPartyDownloadPolicyModel>> {
    const params = new HttpParams().set('outputType', 'url');
    return super.get(this.baseUrlV2 + 'motor/profile/application-forms/' + id + '/download-policy', params);
  }

  downloadPolicyBody(id: number): Observable<UatGeneralResponse<string>> {
    return super.get(this.baseUrl + 'white-label/' + id + '/download-policy');
  }

  getPolicyList(
    data: OrderAndFilterParametersModel,
    productType: InsuranceProductTypeEnum | null = null,
  ): Observable<UatGeneralResponse<VehiclePolicyResultModel>> {
    return super.post(this.baseUrl + 'profile/application-forms/list' + (productType ? '?productType=' + productType : ''), data);
  }

  getMotorPolicyList(data: OrderAndFilterParametersModel): Observable<UatGeneralResponse<ResponseMotorPolicyResultModel>> {
    return super.post(this.baseUrl + 'motor/profile/application-forms/list', data);
  }

  getPolicyDetail(
    id: string,
    productType: InsuranceProductTypeEnum | null = null,
  ): Observable<UatGeneralResponse<ApplicationFormGetResponseModel>> {
    return super.get(this.baseUrl + 'profile/application-forms/' + id + (productType ? '?productType=' + productType : '')).pipe(
      map((item) => {
        return {
          ...item,
          result: {
            ...item.result,
            state: {
              ...item.result.state,
              stateTitle: item.result.state.stateTitle.toLowerCase(),
            },
          },
        };
      }),
    );
  }

  getMotorPolicyDetail(id: string): Observable<UatGeneralResponse<MotorPolicyResultModel>> {
    return super.get(this.baseUrl + 'motor/profile/application-forms/' + id);
  }

  downloadCarEndorsement(appId: string, endorsementId: string): Observable<UatGeneralResponse<DownloadEndorsementModel>> {
    const params = new HttpParams().set('outputType', 'url').set('endorsementId', endorsementId);
    return super.get(`${this.baseUrl}profile/application-forms/${appId}/download-endorsement`, params);
  }

  downloadMotorEndorsement(appId: string, endorsementId: string): Observable<UatGeneralResponse<DownloadEndorsementModel>> {
    const params = new HttpParams().set('outputType', 'url').set('endorsementId', endorsementId);
    return super.get(`${this.baseUrl}motor/profile/application-forms/${appId}/download-endorsement`, params);
  }
}
