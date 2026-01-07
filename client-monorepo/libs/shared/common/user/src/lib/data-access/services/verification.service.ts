import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { FEATURE_NAMES } from '@client-monorepo/payment/purchase';
import { ApiResultInterface, ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { OtpVerifyResponseInterface } from '../models/otp-verify-response.interface';
import { StorageService } from '@client-monorepo/common/utilities';

type SendOtpResponse = {
  result: ApiResultInterface;
  userId: string;
};
@Injectable({
  providedIn: 'root',
})
export class VerificationService {
  cellNumber = '';
  useCase = '';
  description = '';
  ticket = '';
  backUrl = '/hub';
  features: Array<number> = [];

  verificationResult = new BehaviorSubject({ verified: false });

  verifiedFeatures = {} as typeof FEATURE_NAMES;

  constructor(
    private apiService: ApiService,
    private storageService: StorageService,
  ) {}

  private getHeaders(): any {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.ticket) {
      Object.assign(headers, {
        ticket: this.ticket,
      });
    }

    return headers;
  }

  public sendOtp(params?: object): Observable<SendOtpResponse> {
    const header = this.getHeaders();
    let request = new RequestBuilder(RequestTypeEnum.POST, 'users/otp', params);
    request = request.setHeader(header);
    return this.apiService.call<SendOtpResponse & 'userId'>(request);
  }

  /**
   * Sends an API request to verify OTP
   * updates tokens and returns a promise
   */
  verifyOtp(smsToken: string, features: Array<number>): Promise<OtpVerifyResponseInterface> {
    const header = this.getHeaders();
    return new Promise((resolve, reject) => {
      let request = new RequestBuilder(RequestTypeEnum.POST, 'users/otp/verify', {
        smsToken,
        features,
      });
      request = request.setHeader(header);
      this.apiService.call<OtpVerifyResponseInterface>(request).subscribe(
        (data) => {
          // mark as verifiedFeatures
          this.verifiedFeatures[this.useCase as keyof typeof FEATURE_NAMES] = this.cellNumber;

          if (data.accessToken) {
            this.storageService.updateAuth(data);
          }

          resolve(data);
        },
        (e) => {
          reject(e);
        },
      );
    });
  }

  /**
   * Starts a new verification flow
   */
  startNewFlow(params: Partial<VerificationService> = {}) {
    Object.assign(this, params);
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
    this.backUrl = '/hub';
    this.features = [];
  }

  /**
   *
   */
  anyFlowInProgress(): boolean {
    return !!this.useCase;
  }

  /**
   *
   */
  onVerify(): Observable<{ verified: boolean }> {
    return this.verificationResult.asObservable();
  }

  /**
   * Check if the given feature name is verified
   * using the given cell number
   */
  isFeatureVerified(featureName: keyof typeof FEATURE_NAMES, cellNumber: string) {
    return Object.prototype.hasOwnProperty.call(this.verifiedFeatures, featureName) && this.verifiedFeatures[featureName] === cellNumber;
  }

  /**
   * Truncate verified features
   * to force user to be verified again
   */
  clearVerificationData() {
    this.verifiedFeatures = {} as typeof FEATURE_NAMES;
  }
}
