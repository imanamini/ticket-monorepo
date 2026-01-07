import { Injectable } from '@angular/core';
import { BaseHttpClient } from '../base-http-client';
import { Observable } from 'rxjs';
import { Rules } from '../../../modules/rules-selection/sandbox/models/rules-selection.model';

@Injectable({
  providedIn: 'root'
})
export class RulesSelectionApiService extends BaseHttpClient {
  baseUrl: string = 'merchant/credit';

  getRegistrationIdFromDetail(): Observable<any> {
    return super.get(`${this.baseUrl}/ticket-info/detail`);
  }

  getRules(registrationId: string): Observable<Rules> {
    return super.get(`${this.baseUrl}/rules/${registrationId}`,);
  }

  assignRule(registrationId: string, ruleId: string): Observable<{ creditId: string }> {
    return super.post(`${this.baseUrl}/${registrationId}/rule`, {
      ruleId
    });
  }

}
