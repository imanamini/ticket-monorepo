import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OtpModel } from '../models/otp-model';
import { UserinfoModel } from '../models/auth.model';
import { CheckAuthBodyModel } from '../models/check-auth-body.model';
import { CheckAuthModel } from '../models/check-auth.model';
import { GeneralResponse } from '../../equipment/api/models/api-result.model';
import { ApiService } from '../../../data-access/services/api.service';
import { NgxApiConfigService } from '@digipay/ngx-api-config';
import { IAuthUserLoginModel } from '../../../data-access/models/auth-user-login.model';
import { NoInterceptorService } from '../../../data-access/services/no-interceptor.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends ApiService {
  private apiConfigService = inject(NgxApiConfigService);
  private noInterceptorService = inject(NoInterceptorService);

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  httpOptions = {
    headers: new HttpHeaders({
      Authorization: this.apiConfigService.getBasicAuthHeader(),
    })
  };

  getOTP(body): Observable<OtpModel> {
    return this.post(`/users/send-sms`, body, this.httpOptions.headers);
  }

  sendOTP(body: any): Observable<IAuthUserLoginModel> {
    body.origin = 3;
    return this.post(`/users/activate`, body, this.httpOptions.headers);
  }

  userInfo(): Observable<GeneralResponse<UserinfoModel>> {
    return this.post(`/insurance/auth/user-info`, {});
  }

  checkAuth(body: CheckAuthBodyModel): Observable<GeneralResponse<CheckAuthModel>> {
    return this.post('/insurance/user/check-auth', body);
  }

  uatCheckAuth(): Observable<any> {
    return this.noInterceptorService.get('/auth/token/check', {
      tokenType: 'bearer'
    });
  }
}
