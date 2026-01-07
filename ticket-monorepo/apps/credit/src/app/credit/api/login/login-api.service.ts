import { Injectable } from '@angular/core';
import { CreditHttpService } from '../credit-http.service';
import { Observable } from 'rxjs';
import { SendSmsBody, SendSmsResponse } from './send-sms';
import { SendOtpBody, SendOtpResponse } from './send-otp';
import { LoginResponse } from './login.response';

@Injectable()
export class LoginApiService {

  constructor(
    private http: CreditHttpService,
  ) {
  }

  sendSms(body: SendSmsBody): Observable<SendSmsResponse> {
    return this.http.post('users/send-sms', body);
  }

  sendOtpCode(otpCode: SendOtpBody): Observable<SendOtpResponse> {
    return this.http.post('users/activate', otpCode);
  }

  login(params: any): Observable<LoginResponse> {
    return this.http.post('users/login', params);
  }
}
