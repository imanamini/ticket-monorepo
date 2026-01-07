import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { GeneralResponse } from '../../../features/equipment/api/models/api-result.model';
import { CancelReasonArgumentModel, PolicyModel } from '../../../features/equipment/api/models/policy/policy.model';
import { HttpClient } from '@angular/common/http';
import { CoverageModel } from '../../../features/equipment/api/models/coverage/coverage-multiselection.model';
import { PolicyTransferModel } from '../../../features/equipment/api/models/policy/policy-transfer.model';
import {
  PolicyTransferResponseModel
} from '../../../features/equipment/api/models/policy/policy-transfer-response.model';
import { InquiryResponseModel } from '../../../features/equipment/api/models/policy-inquiry/policy-inquiry.model';
import { EEIRegisterModel } from '../../../features/equipment/api/models/EEI-register.model';
import { PolicyCancelReasonsModel } from '../../../features/equipment/api/models/policy/policy-cancel-reasons.model';
import { RenewalModel } from '../../../features/equipment/api/models/policy/policy-renewal.model';
import { BulkOrderModel } from '../../../features/equipment/api/models/policy/policy-bulk-order.model';
import {
  UserAccountBodyModel,
  UserAccountModel
} from '../../../features/equipment/api/models/policy/user-account.model';
import { BaseApiService } from '../../../features/vehicle/data-access/services/shared/base-api.service';
import { OrderAndFilterParametersModel } from '../../models/order-and-filter-parameters.model';

@Injectable({
  providedIn: 'root',
})
export class PolicyApiService extends BaseApiService {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  getPolicyList(query: PolicyModel | {}): Observable<GeneralResponse<PolicyModel[]>> {
    return super.post('/insurance/policy/profile-list', query);
  }

  getPolicyListNew(data: OrderAndFilterParametersModel): Observable<GeneralResponse<PolicyModel[]>> {
    return super.post('/insurance/policy/list-brief?page=1&size=10000', data);
  }

  getCoverageList(policyId: string): Observable<GeneralResponse<CoverageModel[]>> {
    return super.post('insurance/claim/coverages', { policyId });
  }

  cancelPolicyBYUser(cancelReason: CancelReasonArgumentModel): Observable<GeneralResponse<null>> {
    return super.put('insurance/policy/cancel-by-customer', cancelReason);
  }

  policyActivate(PolicyDraftNo: number | string, SerialNo: string): Observable<GeneralResponse<CoverageModel[]>> {
    return super.post('insurance/policy/activate', { PolicyDraftNo, SerialNo });
  }

  policyTransfer(body: PolicyTransferModel): Observable<GeneralResponse<PolicyTransferResponseModel>> {
    return super.put('insurance/policy/transfer-request', body);
  }

  policyTransferById(policyDraftNo, transferProfile): Observable<PolicyTransferResponseModel> {
    return super.put('insurance/policy/transfer-by-id', { policyDraftNo, transferProfile });
  }

  policyTransferByCode(code: string, transferProfile: EEIRegisterModel): Observable<PolicyTransferResponseModel> {
    return super.put('insurance/policy/transfer-by-code', { code, transferProfile });
  }

  policyTransferDetail(transferCode: string): Observable<GeneralResponse<PolicyTransferResponseModel>> {
    return super.get(`insurance/policy/transfer-detail/${transferCode}`);
  }

  policyInquiry(body): Observable<GeneralResponse<InquiryResponseModel>> {
    return super.post('insurance/sales/inquiry', body);
  }

  getCancelReasons(body: { saleChannel: string }): Observable<GeneralResponse<PolicyCancelReasonsModel[]>> {
    return super.post('insurance/core/taxonomy/policy/cancel-reasons', body);
  }

  getRenewalListProfile(data: OrderAndFilterParametersModel): Observable<GeneralResponse<RenewalModel[]>> {
    return super.post(`/insurance/renewal/profile-list?page=1&size=10000`, data);
  }

  getBulkOrderListProfile(data: OrderAndFilterParametersModel): Observable<GeneralResponse<BulkOrderModel[]>> {
    return super.post(`/insurance/bulk-order/profile-list?page=1&size=10000`, data);
  }

  getPolicyListProfile(body: PolicyModel | {}, page: number): Observable<GeneralResponse<PolicyModel[]>> {
    const url = page ? '/insurance/policy/profile-list?page=' + String(page) : '/insurance/policy/profile-list';
    return super.post(url, body);
  }

  updateProfile(body: UserAccountBodyModel): Observable<GeneralResponse<UserAccountModel>> {
    return super.post('/insurance/user/update', body);
  }
}
