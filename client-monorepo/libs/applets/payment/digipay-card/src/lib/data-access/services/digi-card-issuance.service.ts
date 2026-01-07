import { Inject, inject, Injectable, signal } from '@angular/core';
import { ApiResultInterface, ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { SubscriptionPlan } from '@client-monorepo/common/subscription';
import { Observable } from 'rxjs';
import {
  confirmPlanResponse,
  DigiCardIssuanceInitResponse,
  DigiCardIssuanceResponse,
  IdentityInput,
  IssuanceDetail,
  UserIdentity,
  UserIdentityResponse,
} from '../models/digi-card-issuance-response.interface';
import { RequiredPlanResponse, UserPlanResponse } from '../models/digi-card-subscription.interface';

@Injectable()
export class DigiCardIssuanceService {
  private apiService = inject(ApiService);
  constructor(@Inject('APP_ENV') private environment: { [key: string]: string }) {}

  issuanceDetail = signal<IssuanceDetail | null>(null);
  requiredPlans = signal<SubscriptionPlan[]>([]);
  userPlan = signal<SubscriptionPlan | null>(null);
  addressDetail = signal<UserIdentity | null>(null);

  getIssueProcesses(): Observable<DigiCardIssuanceResponse> {
    return this.apiService.call<DigiCardIssuanceResponse>(new RequestBuilder(RequestTypeEnum.GET, '/digicard/issue-processes'));
  }
  initIssuanceProcess(nationalCode: string): Observable<DigiCardIssuanceInitResponse> {
    return this.apiService.call<DigiCardIssuanceInitResponse>(
      new RequestBuilder(RequestTypeEnum.POST, '/digicard/issue-processes/actions/init', { nationalCode }),
    );
  }
  getRequiredPlan(): Observable<RequiredPlanResponse> {
    return this.apiService.call<RequiredPlanResponse>(new RequestBuilder(RequestTypeEnum.GET, 'digicard/subscriptions/required-plan'));
  }
  getUserPlan(): Observable<UserPlanResponse> {
    return this.apiService.call<UserPlanResponse>(new RequestBuilder(RequestTypeEnum.GET, '/digicard/subscriptions/user-plan'));
  }
  setIdentity(entity: IdentityInput): Observable<UserIdentityResponse> {
    return this.apiService.call<UserIdentityResponse>(
      new RequestBuilder(RequestTypeEnum.POST, 'digicard/issue-processes/actions/identity/submit', entity),
    );
  }
  addressApprove(description: string): Observable<ApiResultInterface> {
    return this.apiService.call<ApiResultInterface>(
      new RequestBuilder(RequestTypeEnum.POST, 'digicard/issue-processes/actions/address/approve', { description }),
    );
  }
  confirmPlan(): Observable<confirmPlanResponse> {
    return this.apiService.call<confirmPlanResponse>(
      new RequestBuilder(RequestTypeEnum.POST, 'digicard/issue-processes/actions/template/confirm', {
        templateCode: this.environment['cardTemplateCode'] ?? '1022',
      }),
    );
  }
}
