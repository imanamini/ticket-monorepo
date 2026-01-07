import { inject, Injectable } from '@angular/core';
import { defer, map, noop, Observable, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';
import { AuthResponse } from '../models/auth-response.interface';
import { LoginBodyInterface } from '../models/login-body.interface';
import {
  ApiResultInterface,
  ApiService,
  CacheService,
  MarketCacheService,
  RequestBuilder,
  RequestTypeEnum,
} from '@client-monorepo/common/network';
import { AppNameService, DeviceInfoService, MessageService, StorageService } from '@client-monorepo/common/utilities';
import { SendSmsRequest, SendSmsResponse, UserZone } from '../models/send-sms-interface';
import { VerifyOtpRequest, VerifyOtpResponse } from '../models/verify-otp.interface';
import { NgxApiConfigService } from '@digipay/ngx-api-config';
import { UserDataService } from './user-data.service';
import { NgxHybridService } from '@digipay/ngx-hybrid-service';
import moment from 'jalali-moment';
import { SessionsResponse } from '../models/sessions-response';
import { UserAssetsService } from '@client-monorepo/common/user-assets';
import { NgxEventTrackerService } from '@digipay/ngx-event-tracker';
import { MessageManagementService } from '@client-monorepo/shared/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  ngxApiConfigService = inject(NgxApiConfigService);
  deviceInfoService = inject(DeviceInfoService);
  router = inject(Router);
  apiService = inject(ApiService);
  storageService = inject(StorageService);
  cacheService = inject(CacheService);
  userDataService = inject(UserDataService);
  private ngxHybridService = inject(NgxHybridService);
  private messageService = inject(MessageService);
  private userAssetService = inject(UserAssetsService);
  private eventService = inject(NgxEventTrackerService);
  private messageManagementService = inject(MessageManagementService);
  private appNameService = inject(AppNameService);
  private marketCacheService = inject(MarketCacheService);

  public refreshToken(): Observable<AuthResponse> {
    let request = new RequestBuilder(RequestTypeEnum.POST, 'users/token/refresh', {
      refreshToken: this.storageService.getRefreshToken(),
    });
    request = this.checkEscrowZone(request);
    return this.apiService.call<AuthResponse>(request);
  }

  public isLoggedIn() {
    return !!this.storageService.getToken();
  }

  public login(params: LoginBodyInterface, requestHeaders?: Record<string, string>): Observable<AuthResponse> {
    const header = { ...requestHeaders };
    let request = new RequestBuilder(RequestTypeEnum.POST, 'users/login', params);
    request = request.setHeader(header);
    return this.apiService.call<AuthResponse>(request);
  }

  public logout(): void {
    this.logoutUserApi().subscribe({
      next: () => this.performLocalLogout(),
      error: (err) => this.messageService.showErrorOfErrorResponse(err),
    });
  }

  public performLocalLogout() {
    this.ngxHybridService.userLogoutEvent(this.storageService.getUserId());
    localStorage.removeItem('__dp_storage');
    localStorage.removeItem('__wealth_token');
    localStorage.removeItem('userId');
    localStorage.removeItem('__dp_userId');
    localStorage.removeItem('zone');
    localStorage.removeItem('ab_test_partition');
    this.storageService.removeNativeUpdateTimeStamp();
    this.storageService.removeLocationTimeStamp();
    this.storageService.removeSetLocation();
    this.storageService.removeLastLocation();
    this.storageService.removeLocationEventTimeStamp();
    this.storageService.removeAppMessageTimeStamp();
    this.storageService.removeVpnCheckTimeStamp();
    this.storageService.removeDigiCardOnboardingChecked();
    this.userAssetService.resetHideAssetStatus();
    sessionStorage.clear();
    this.cacheService.flushCache();
    this.marketCacheService.clearCache();
    this.storageService.removePasswordData();
    this.storageService.removeHasBiometric();
    this.storageService.removeTimeStamp();
    this.eventService.logoutIntrack();
    this.ngxHybridService.removePin().then();
    this.storageService.removeHubSearchHistory();
    if (this.appNameService.isPillar()) {
      this.router.navigate(['/auth'], { queryParamsHandling: 'preserve' });
    } else {
      this.router.navigate(['/auth/login']);
    }
    this.userDataService.userDetail.next(null);
    this.messageManagementService.messages.set(null);
  }

  public sendSms(params: SendSmsRequest, zone: UserZone = 'app'): Observable<SendSmsResponse> {
    let request = new RequestBuilder(RequestTypeEnum.POST, 'users/send-sms', params);
    if (zone === 'merchant-app') {
      request = request.setHeader({ Zone: zone });
    }
    return this.apiService.call<SendSmsResponse>(request);
  }

  verifyOtp(params: VerifyOtpRequest, zone: UserZone = 'app'): Observable<VerifyOtpResponse> {
    let request = new RequestBuilder(RequestTypeEnum.POST, 'users/activate', params);
    if (zone === 'merchant-app') {
      request = request.setHeader({ Zone: zone });
    }
    return this.apiService.call(request);
  }

  setUserPassword(password: string): Observable<ApiResultInterface> {
    const request = new RequestBuilder(RequestTypeEnum.POST, 'users/password', {
      password,
    });
    return this.apiService.call<ApiResultInterface>(request);
  }

  deleteUserPassword(): Observable<ApiResultInterface> {
    const request = new RequestBuilder(RequestTypeEnum.DELETE, 'users/password');
    return this.apiService.call<ApiResultInterface>(request);
  }

  async getCode(
    phoneNumber: string,
    referralCode: string | undefined = undefined,
    zone: UserZone | undefined = undefined,
  ): Promise<Observable<SendSmsResponse>> {
    const device = await this.deviceInfoService.getDeviceInfo();
    const passToServer: SendSmsRequest = {
      cellNumber: phoneNumber,
      device: device,
    };
    if (referralCode) {
      passToServer.referralCode = referralCode;
    }
    return this.sendSms(passToServer, zone).pipe(tap((res) => this.storageService.setUserData({ userId: res.userId, phoneNumber })));
  }

  verifyReferral(code: string): Observable<{ result: ApiResultInterface }> {
    const request = new RequestBuilder(RequestTypeEnum.POST, 'campaigns/referral/verify', { referralCode: code });
    return this.apiService.call<{ result: ApiResultInterface }>(request);
  }

  logoutUserApi(): Observable<ApiResultInterface> {
    return defer(() => this.deviceInfoService.getDeviceInfo()).pipe(
      switchMap((device) => {
        const request = new RequestBuilder(RequestTypeEnum.POST, 'users/logout', { ...device });
        return this.apiService.call<ApiResultInterface>(request);
      }),
    );
  }

  getSessionsData(): Observable<SessionsResponse> {
    const request = new RequestBuilder(RequestTypeEnum.GET, 'auth/token/clients');
    return this.apiService.call<SessionsResponse>(request).pipe(
      map((res) => {
        res.clients.forEach((client) => {
          const value = new Date(client.loginTime!);
          client.loginTime = moment(value).locale('fa').format('YYYY/M/D -  HH:mm');
        });
        return res;
      }),
    );
  }

  revokeSession(deviceId: string): Observable<{ result: ApiResultInterface }> {
    const request = new RequestBuilder(RequestTypeEnum.POST, 'auth/token/revoke', { deviceId });
    return this.apiService.call<{ result: ApiResultInterface }>(request);
  }

  revokeOtherSessions(excludedDeviceIds: string[]): Observable<{ result: ApiResultInterface }> {
    const request = new RequestBuilder(RequestTypeEnum.POST, 'auth/token/revoke-all', { excludedDeviceIds });
    return this.apiService.call<{ result: ApiResultInterface }>(request);
  }

  checkEscrowZone(request: RequestBuilder): RequestBuilder {
    const escrowStorage = localStorage.getItem('__dp_storage_escrow');
    if (escrowStorage) {
      try {
        const jsonEscrowStorage = JSON.parse(escrowStorage).escrow;
        const zone = jsonEscrowStorage['zone'];
        if (zone) {
          request = request.setHeader({ Zone: zone });
        }
      } catch {
        noop();
      }
    }
    return request;
  }
}
