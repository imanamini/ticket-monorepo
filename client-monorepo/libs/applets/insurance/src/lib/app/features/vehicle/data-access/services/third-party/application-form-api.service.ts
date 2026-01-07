import { Injectable } from '@angular/core';
import { BaseApiService } from '../shared/base-api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApplicationFormPostRequestModel } from '../../models/application-form/application-form-post-request.model';
import { ApplicationFormPutRequestModel } from '../../models/application-form/application-form-put-request.model';
import { UatGeneralResponse } from '../../models/uat-general.response';
import { ApplicationFormGetResponseModel } from '../../models/application-form/application-form-get-response.model';
import { ApplicationFormPostResponseModel } from '../../models/application-form/application-form-post-response.model';
import { VerifiedAllocationRequestModel } from '../../models/application-form/verified-allocations-request.model';
import { VerifiedAllocationsResponseModel } from '../../models/application-form/verified-allocations-response.model';
import { VEHICLE_ORDER_STATE_ENUM } from '../../../../../data-access/enums/vehicle-order-state.enum';
import { ERROR_HANDLE_KEY, ErrorHandleHeaderEnum } from '../../../../../data-access/enums/error-handle-header.enum';
import { UploadedDocumentModel } from '../../models/third-party/upload-document/uploaded-document.model';
import { InsuredPartyModel } from '../../models/application-form/insured-party.model';
import { UserAddressModel } from '../../models/application-form/user-address.model';
import { EnvironmentService } from '@client-monorepo/app-core';

@Injectable({
  providedIn: 'root',
})
export class ApplicationFormApiService extends BaseApiService {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  private applicationUrl = this.baseUrl + 'application-forms';

  postApplicationForm(data: ApplicationFormPostRequestModel): Observable<UatGeneralResponse<ApplicationFormPostResponseModel>> {
    return super.post(this.applicationUrl, data);
  }

  putApplicationForm(data: ApplicationFormPutRequestModel): Observable<UatGeneralResponse<ApplicationFormGetResponseModel>> {
    return super.put(this.applicationUrl, data);
  }

  getApplicationForm(id: string): Observable<UatGeneralResponse<ApplicationFormGetResponseModel>> {
    return super.get(this.applicationUrl + '/' + id);
  }

  createApplicationFormDraft(id: string, insurerPartyId: string): Observable<UatGeneralResponse<boolean>> {
    return super.put(`${this.applicationUrl}/${id}/draft`, { insurerPartyId });
  }

  getOrderState(id: string): Observable<UatGeneralResponse<{ currentState: VEHICLE_ORDER_STATE_ENUM }>> {
    return super.get(`${this.baseUrl}application-forms/${id}/state`);
  }

  getRequestData(id: string): Observable<UatGeneralResponse<ApplicationFormGetResponseModel>> {
    return super.get(this.applicationUrl + '/' + id + '/request-data');
  }

  getRequiredFiles(id: string): Observable<UatGeneralResponse<UploadedDocumentModel[]>> {
    return super.get(this.applicationUrl + `/${id}/required-files`);
  }

  putVerifyAllocation(
    id: string,
    userDetail: VerifiedAllocationRequestModel,
  ): Observable<UatGeneralResponse<VerifiedAllocationsResponseModel>> {
    const headers: HttpHeaders = new HttpHeaders({ [ERROR_HANDLE_KEY]: ErrorHandleHeaderEnum.NO_HANDLE });
    return super.put(`${this.applicationUrl}/${id}/verified-allocations`, userDetail, headers);
  }

  putInsuredParty(id: string, insuredPartyDetail: InsuredPartyModel): Observable<UatGeneralResponse<boolean>> {
    return super.put(`${this.applicationUrl}/${id}/insured-parties`, insuredPartyDetail);
  }

  putVerifyPostalCode(id: string, address: UserAddressModel): Observable<UatGeneralResponse<boolean>> {
    const headers: HttpHeaders = new HttpHeaders({ [ERROR_HANDLE_KEY]: ErrorHandleHeaderEnum.NO_HANDLE });
    return super.put(`${this.applicationUrl}/${id}/verify-postal-code`, address, headers);
  }
}
