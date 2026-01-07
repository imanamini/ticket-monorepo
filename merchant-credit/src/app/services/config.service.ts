import { Injectable } from '@angular/core';
import { GetConfigResponse } from '../api/clients/shared/response-models/get-config.response';
import { SharedApiService } from '../api/clients/shared/shared-api.service';
import { Observable, of } from 'rxjs';
import { GetSettlementConfigResponse } from '../api/clients/shared/response-models/get-settlement-config.response';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  config?: GetConfigResponse;
  settlementConfigs: { [key: string]: GetSettlementConfigResponse } = {};

  constructor(
    private sharedApiService: SharedApiService
  ) {
  }

  getConfig(): Observable<GetConfigResponse> {
    if (this.config) {
      return of(this.config);
    }
    return this.updateConfig();
  }

  updateConfig(): Observable<GetConfigResponse> {
    return new Observable((observer) => {
      this.sharedApiService.getConfig().subscribe(response => {
        this.config = response;
        observer.next(response);
      });
    });
  }

  getSettlementConfig(trackingCode: string, ruleId: string): Observable<GetSettlementConfigResponse> {
    if (this.settlementConfigs[trackingCode + '-' + ruleId]) {
      return of(this.settlementConfigs[trackingCode + '-' + ruleId]);
    }
    return this.updateSettlementConfig(trackingCode, ruleId);
  }

  updateSettlementConfig(trackingCode: string, ruleId: string): Observable<GetSettlementConfigResponse> {
    return new Observable((observer) => {
      if (ruleId) {
        this.sharedApiService.getSettlementConfig(trackingCode, ruleId).subscribe(response => {
          this.settlementConfigs[trackingCode + '-' + ruleId] = response;
          observer.next(response);
        }, error => {
          observer.error(error);
        });
      }
    });
  }

  exit(): void {
    const businessRegistrationUrl: any = sessionStorage.getItem('businessUrl');
    if (businessRegistrationUrl) {
      window.location.replace(businessRegistrationUrl);
    }
  }

}
