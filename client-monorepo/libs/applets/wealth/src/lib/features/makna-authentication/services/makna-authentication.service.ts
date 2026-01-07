import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of, take, throwError } from 'rxjs';
import { ForgetPasswordModel } from '../models/forget-password.model';
import { ResetPasswordTokenModel } from '../models/reset-password.model';
import { ResetPasswordModel } from '../models/reset-password-token.model';
import { BaseApiService } from '../../../components/core/services/base-api.service';
import { ServiceResult } from '../../../data-access/models/base/service-result';
import {
  ADD_PASSWORD_API,
  CHANGE_EXPIRE_PASSWORD_API,
  CHANGE_PASSWORD_API,
  CONFIRM_NATIONAL_ID_API,
  CONFIRM_PHONE_NUMBER_API,
  CONFIRM_SEJAMI_API,
  FORGET_PASSWORD_CONFIRM_2FA_API,
  FORGOT_PASSWORD_API,
  IS_USER_COMPLETELY_REGISTERED,
  REFRESH_TOKEN_API,
  REGISTER_API,
  RESET_PASSWORD_API,
  REVOKE_API,
  SESSION_HEALTH_API,
  SESSIONS_API,
  WEALTH_LOGIN_API,
  WEALTH_LOGIN_DGP_API,
} from '../../../data-access/constants/api';
import { TServiceResult } from '../../../data-access/models/base/t-service-resutl';
import { TokenModel } from '../../../data-access/models/base/token.model';
import { WEALTH_TOKEN } from '../../../components/utils/variables';
import { PageList } from '../../../data-access/models/base/pagelist.model';
import { UserLoginActivityModel } from '../../user-profile/models/user-login-activity.model';

@Injectable({
  providedIn: 'root',
})
export class MaknaAuthenticationService {
  constructor(private baseApiService: BaseApiService) {}

  /**
   * @param phoneNumber
   * Send OTP to recived phone number
   *
   * Example: phoneNumber: 09123456789 --> OTP: 123456
   */
  registerOtp(phoneNumber: string): Observable<ServiceResult> {
    return this.baseApiService.post(REGISTER_API, { phoneNumber }).pipe(
      catchError((err) => {
        return of(new ServiceResult(err.error, err.message, false));
      }),
    );
  }

  /**
   *
   * @param phoneNumber
   * @param otp
   * @returns TokenModel
   *
   * Example: (phoneNumber: 09123456789, OTP: 123456) --> TokenModel
   */
  confirmPhoneNumber(phoneNumber: string, otp: string): Observable<TServiceResult<TokenModel>> {
    return this.baseApiService.post(CONFIRM_PHONE_NUMBER_API, { phoneNumber, otp }).pipe(
      catchError((err) => {
        return of(new ServiceResult(err.error, err.message, false));
      }),
    );
  }

  /**
   *
   * @param nationalId
   * @returns ServiceResult
   * @description for example
   */
  confirmNationalId(nationalId: string): Observable<ServiceResult> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${JSON.parse(localStorage.getItem(WEALTH_TOKEN)).accessToken}`);
    return this.baseApiService.post(CONFIRM_NATIONAL_ID_API, { nationalId }, headers).pipe(
      catchError((err) => {
        return of(new ServiceResult(err.error, err.message, false));
      }),
    );
  }

  /**
   *
   * @param password
   * @returns Tserviceresult Token Model
   */
  addPassword(password: string): Observable<TServiceResult<TokenModel>> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${JSON.parse(localStorage.getItem(WEALTH_TOKEN)).accessToken}`);
    return this.baseApiService.post(ADD_PASSWORD_API, { password }, headers).pipe(
      map((res: TServiceResult<TokenModel>) => {
        if (res?.success) {
          localStorage.setItem(WEALTH_TOKEN, JSON.stringify(res.result) || '{}');
        }
        return res;
      }),
      catchError((err) => {
        return of(new TServiceResult<TokenModel>(null, '', err?.error, false));
      }),
    );
  }

  login(stamp: string): Observable<TServiceResult<TokenModel>> {
    return this.baseApiService.post(WEALTH_LOGIN_API, { stamp }).pipe(
      map((res: TServiceResult<TokenModel>) => {
        if (res?.success) {
          localStorage.setItem(WEALTH_TOKEN, JSON.stringify(res.result) || '{}');
        }
        return res;
      }),
      catchError((err) => {
        return of(new TServiceResult<TokenModel>(null, '', err, false));
      }),
    );
  }

  /**
   *
   * @param nationalId
   * @returns ForgetPasswordModel
   */
  forgotPassword(nationalId: string): Observable<TServiceResult<ForgetPasswordModel>> {
    return this.baseApiService.post(FORGOT_PASSWORD_API, { nationalId }).pipe(
      take(1),
      catchError((err) => {
        return of(new ServiceResult(err.error, err.message, false));
      }),
    );
  }

  /**
   *
   * @param nationalId
   * @param otp
   * @returns
   */
  forgotPasswordConfirm2fa(nationalId: string, otp: string): Observable<TServiceResult<ResetPasswordTokenModel>> {
    return this.baseApiService.post(FORGET_PASSWORD_CONFIRM_2FA_API, { nationalId, otp }).pipe(
      catchError((err) => {
        return of(new ServiceResult(err.error, err.message, false));
      }),
    );
  }

  /**
   *
   * @param nationalId
   * @param resetPasswordToken
   * @param newPassword
   * @returns ResetPasswordModel
   */
  resetPassword(nationalId: string, resetPasswordToken: string, newPassword: string): Observable<TServiceResult<ResetPasswordModel>> {
    return this.baseApiService.post(RESET_PASSWORD_API, { nationalId, resetPasswordToken, newPassword }).pipe(
      catchError((err) => {
        return of(new ServiceResult(err.error, err.message, false));
      }),
    );
  }

  /**
   *
   * @returns ServiceResult
   */
  revoke(): Observable<ServiceResult> {
    return this.baseApiService.post(REVOKE_API).pipe(
      map((res) => {
        localStorage.removeItem(WEALTH_TOKEN);
        localStorage.removeItem('userId');
        return res;
      }),
      catchError((err) => {
        return of(new ServiceResult(err.error, err.message, false));
      }),
    );
  }

  /**
   *
   * @returns PageList UserLoginActivityModel
   */
  sessions(): Observable<TServiceResult<PageList<UserLoginActivityModel>>> {
    return this.baseApiService.get(SESSIONS_API).pipe(
      catchError((err) => {
        return of(new ServiceResult(err.error, err.message, false));
      }),
    );
  }

  /**
   *
   * @returns TokenModel
   */
  loginDGP(): Observable<TServiceResult<TokenModel>> {
    const wrt: TokenModel = JSON.parse(localStorage.getItem(WEALTH_TOKEN));
    return this.baseApiService.post(WEALTH_LOGIN_DGP_API, { refreshToken: wrt?.refreshToken || null }).pipe(
      map((res: TServiceResult<TokenModel>) => {
        if (res?.success) {
          localStorage.setItem(WEALTH_TOKEN, JSON.stringify(res?.result) || '{}');
        }
        return res;
      }),
      catchError((err) => {
        return throwError(() => err);
      }),
    );
  }

  /**
   *
   * @returns TokenModel
   */
  refresh(): Observable<TServiceResult<TokenModel>> {
    return this.baseApiService.post(REFRESH_TOKEN_API, JSON.parse(localStorage.getItem(WEALTH_TOKEN))).pipe(
      map((res: TServiceResult<TokenModel>) => {
        if (res?.success) {
          localStorage.setItem(WEALTH_TOKEN, JSON.stringify(res.result) || '{}');
        }
        return res;
      }),
      catchError((err) => {
        return of(new TServiceResult<TokenModel>(null, '', err, false));
      }),
    );
  }

  /**
   *
   * @param currentPassword
   * @param newPassword
   * @returns ServiceResult
   */
  changePassword(currentPassword: string, newPassword: string): Observable<ServiceResult> {
    return this.baseApiService
      .post(CHANGE_PASSWORD_API, {
        currentPassword,
        newPassword,
        accessToken: `${JSON.parse(localStorage.getItem(WEALTH_TOKEN))?.accessToken}`,
      })
      .pipe(
        map((res) => {
          return res;
        }),
        catchError((err) => {
          return of(new ServiceResult(err.error, err.message, false));
        }),
      );
  }

  changeExpiredPassword(currentPassword: string, newPassword: string): Observable<ServiceResult> {
    return this.baseApiService
      .post(CHANGE_EXPIRE_PASSWORD_API, {
        currentPassword,
        newPassword,
        accessToken: `${JSON.parse(localStorage.getItem(WEALTH_TOKEN))?.accessToken}`,
      })
      .pipe(
        map((res) => {
          return res;
        }),
        catchError((err) => {
          return of(new ServiceResult(err.error, err.message, false));
        }),
      );
  }

  isUserCompletelyRegistered(): Observable<TServiceResult<boolean>> {
    return this.baseApiService.get(IS_USER_COMPLETELY_REGISTERED).pipe(
      map((res) => {
        return res;
      }),
      catchError((err) => {
        return of(new TServiceResult(false, '', err, false));
      }),
    );
  }

  confirmSejami(nationalId): Observable<TServiceResult<boolean>> {
    return this.baseApiService.post(CONFIRM_SEJAMI_API, { nationalId }).pipe(
      catchError((err) => {
        return of(new ServiceResult(err.error, err.message, false));
      }),
    );
  }

  checkSessionHealth(): Observable<ServiceResult> {
    return this.baseApiService.get(SESSION_HEALTH_API);
  }
}
