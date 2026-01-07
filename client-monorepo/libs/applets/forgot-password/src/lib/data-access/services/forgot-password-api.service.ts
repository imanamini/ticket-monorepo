import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DeviceInfo } from '@client-monorepo/common/utilities';
import { ApiResultInterface, ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { ForgotPasswordResetResponseModel } from '../models/forgot-password-reset-response.model';
import { ForgotPasswordResetRequestModel } from '../models/forgot-password-reset-request.model';

@Injectable({
  providedIn: 'root',
})
export class ForgotPasswordApiService {
  apiService = inject(ApiService);

  resetOtp(cellNumber: string, device: DeviceInfo): Observable<ApiResultInterface> {
    const payload = {
      cellNumber: cellNumber,
      deviceId: device.deviceId,
    };
    const request = new RequestBuilder(RequestTypeEnum.POST, 'users/password/reset/otp', payload);
    return this.apiService.call<ApiResultInterface>(request);
  }

  resetPassword(payload: ForgotPasswordResetRequestModel): Observable<ForgotPasswordResetResponseModel> {
    const request = new RequestBuilder(RequestTypeEnum.POST, 'users/password/reset', payload);
    return this.apiService.call<ForgotPasswordResetResponseModel>(request);
  }
}
