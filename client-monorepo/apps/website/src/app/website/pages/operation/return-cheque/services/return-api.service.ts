import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Province } from '../models/province.model';
import { LogisticMethod } from '../models/delivery-method.model';
import { VerifyOtpResponseModel } from '../models/verify-otp-response.model';
import { AvailableReturnInperson } from '../models/available-return-inperson.model';
import { ReturnInpersonRequestModel } from '../models/return-inperson-request.model';
import { DeliveryDirectionEnum } from '../models/delivery-direction.enum';
import { ReturnPostRequestModel } from '../models/return-post-request.model';
import { ReturnCourierRequestModel } from '../models/return-courier-request.model';
import { AvailableReturnCourier } from '../models/available-return-courier.model';
import { ApiResponse } from '../models/api-response.model';
import { BaseHttpClient } from '../../../../../api/base-http-client';

@Injectable({
  providedIn: 'root',
})
export class ReturnApiService extends BaseHttpClient {
  constructor(public httpClient: HttpClient) {
    super(httpClient);
    this.api = 'digipay';
  }

  sendOtp(logisticToken: string, direction: DeliveryDirectionEnum = DeliveryDirectionEnum.Return) {
    return this.post('/back-office/logistic/send-otp', { logisticToken, direction });
  }

  verifyOtp(logisticToken: string, otpCode: string): Observable<VerifyOtpResponseModel> {
    return this.post('/back-office/logistic/verify-otp', { logisticToken, otpCode });
  }

  getProvinces(): Observable<{ items: Province[] }> {
    return this.get('/back-office/provices/lookup');
  }

  getLogesticMethods(deliveryDirection: DeliveryDirectionEnum = DeliveryDirectionEnum.Pickup): Observable<{ items: LogisticMethod[] }> {
    return this.get(`/back-office/logistic/methods/lookup?deliveryDirection=${deliveryDirection}`);
  }

  getAvailableReturnCourier(cityId: number): Observable<{ items: AvailableReturnCourier[] }> {
    return this.get(`/back-office/logistic/available/return-courier?cityId=${cityId}`);
  }

  getAvailableReturnInperson(cityId: number): Observable<{ items: AvailableReturnInperson[] }> {
    return this.get(`/back-office/logistic/available/return-inperson?cityId=${cityId}`);
  }

  submitReturnPost(params: ReturnPostRequestModel): Observable<ApiResponse> {
    return this.post('/back-office/delivery/reserve/return-post', params);
  }

  submitReturnInperson(params: ReturnInpersonRequestModel): Observable<ApiResponse> {
    return this.post('/back-office/delivery/reserve/return-inperson', params);
  }

  submitReturnCourier(params: ReturnCourierRequestModel): Observable<ApiResponse> {
    return this.post('/back-office/delivery/reserve/return-courier', params);
  }
}
