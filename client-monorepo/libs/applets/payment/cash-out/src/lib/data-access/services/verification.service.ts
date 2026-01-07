import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ApiResultInterface, ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { OtpVerifyResponse } from '../models/otp-verify-response.model';

@Injectable({
  providedIn: 'root',
})
export class VerificationService {
  cellNumber = '';
  useCase = '';
  description = '';
  ticket = '';
  backUrl = '/home';
  features: Array<number> = [];

  verifiedFeatures: any;
  verificationResult = new BehaviorSubject<{ verified: boolean }>({ verified: false });

  constructor(private apiService: ApiService) {}

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders().append('Content-Type', 'application/json');
    if (this.ticket) {
      headers = headers.append('ticket', this.ticket);
    }
    return headers;
  }

  /**
   * Starts a new verification flow
   */
  startNewFlow(params: {
    useCase: string;
    description: string;
    features: Array<number>;
    cellNumber: string;
    backUrl: string;
    ticket?: string;
  }) {
    this.useCase = params.useCase;
    this.description = params.description;
    this.features = params.features;
    this.cellNumber = params.cellNumber;
    this.backUrl = params.backUrl;
    this.ticket = params.ticket ? params.ticket : '';
  }

  /**
   * Clear service data
   * CAUTION: does not clear the verified features
   */
  clearFlowData() {
    this.useCase = '';
    this.cellNumber = '';
    this.ticket = '';
    this.description = '';
    this.backUrl = '/home';
    this.features = [];
  }

  /**
   *
   */
  anyFlowInProgress(): boolean {
    return !!this.useCase;
  }

  sendOtp(params?: any): Observable<ApiResultInterface> {
    const request = new RequestBuilder(RequestTypeEnum.POST, 'users/otp', params);
    return this.apiService.call<ApiResultInterface>(request);
  }

  verifyOtp(smsToken: string, features: Array<number>): Promise<OtpVerifyResponse> {
    return new Promise((resolve, reject) => {
      const request = new RequestBuilder(RequestTypeEnum.POST, 'users/otp/verify', {
        smsToken,
        features,
      }).setHeader({ ticket: this.ticket });
      this.apiService.call<OtpVerifyResponse>(request).subscribe({
        next: (res) => {
          resolve(res);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }
}
