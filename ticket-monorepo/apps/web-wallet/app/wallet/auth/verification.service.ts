import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { GenericResponse } from '../../api/models/generic.response';
import { OtpVerifyResponse } from '../../api/models/otp-verify.response';
import { ApiService } from '../../core/http/api.service';

@Injectable({
  providedIn: 'root'
})
export class VerificationService {

  cellNumber = '';
  useCase = '';
  description = '';
  ticket = '';
  features: Array<number> = [];

  verificationResult: BehaviorSubject<{ verified: boolean }> = new BehaviorSubject({verified: false});

  verifiedFeatures = {};

  constructor(
    private apiService: ApiService,
  ) {
  }

  private getHeaders(): any {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.ticket) {
      Object.assign(headers, {
        ticket: this.ticket
      });
    }

    return headers;
  }

  sendOtp(): Observable<GenericResponse> {
    const headers = this.getHeaders();
    return this.apiService.post('users/otp', {}, {headers});
  }

  /**
   * Sends an API request to verify OTP
   * updates tokens and returns a promise
   */
  verifyOtp(smsToken: string, features: Array<number>): Promise<OtpVerifyResponse> {
    const headers = this.getHeaders();

    return new Promise((resolve, reject) => {
      this.apiService.post('users/otp/verify',
        {smsToken, features},
        {headers}
      ).subscribe(data => {
        // mark as verifiedFeatures
        this.verifiedFeatures[this.useCase] = this.cellNumber;

        resolve(data);

      }, e => {

        reject(e);
      });
    });

  }

  /**
   * Starts a new verification flow
   */
  startNewFlow(params: {
    useCase: string,
    description: string,
    features: Array<number>,
    cellNumber: string,
    ticket?: string,
  }) {
    this.useCase = params.useCase;
    this.description = params.description;
    this.features = params.features;
    this.cellNumber = params.cellNumber;
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
  isFeatureVerified(useCase, cellNumber) {
    return this.verifiedFeatures.hasOwnProperty(useCase) && this.verifiedFeatures[useCase] === cellNumber;
  }

  /**
   * Truncate verified features
   * to force user to be verified again
   */
  clearVerificationData() {
    this.verifiedFeatures = {};
  }
}
