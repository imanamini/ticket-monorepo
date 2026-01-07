import { Injectable } from '@angular/core';
import { BaseHttpClient } from '../base-http-client';
import { Observable } from 'rxjs';
import { GetConfigResponse } from './response-models/get-config.response';
import { GetSettlementConfigResponse } from './response-models/get-settlement-config.response';

@Injectable({
  providedIn: 'root'
})
export class SharedApiService extends BaseHttpClient {
  baseUrl: string = 'merchant/credit';

  getHtml(relativeUrl: string): Observable<string> {
    return super.get(relativeUrl, {}, {
      responseType: 'text',
      headers: {
        Accept: 'text/html,application/xhtml+xml;'
      }
    });
  }

  getConfig(): Observable<GetConfigResponse> {
    return super.get(`${this.baseUrl}/config`);
  }

  getSettlementConfig(trackingCode: string, ruleId?: string): Observable<GetSettlementConfigResponse> {
    return super.get(`${this.baseUrl}/settlements/config/${trackingCode}/${ruleId}`);
  }
}
