import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { HttpParams } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { TServiceResult } from '../../../data-access/models/base/t-service-resutl';
import { UserInfoModel } from '../../../features/user-profile/models/user-info.model';
import {
  GET_PHONE_NUMBER_API,
  GET_PROFILE_API,
  ONBOARD_API,
  UPDATE_SEJAMI_PROFILE_API,
  VERIFY_PORTFOLIO_API,
  VERIFY_SEJAMI_API,
  VERIFY_SHAHKAR_API,
} from '../../../data-access/constants/api';
import { ServiceResult } from '../../../data-access/models/base/service-result';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private profileInfoSubject: BehaviorSubject<TServiceResult<UserInfoModel>> = new BehaviorSubject<TServiceResult<UserInfoModel>>(null);
  public profileInfo$ = this.profileInfoSubject.asObservable();

  constructor(private baseApiService: BaseApiService) {}

  getProfile(): Observable<TServiceResult<UserInfoModel>> {
    const params = new HttpParams();

    if (this.profileInfoSubject.value) {
      return this.profileInfo$;
    }
    return this.baseApiService.get(GET_PROFILE_API, params).pipe(
      map((res: TServiceResult<UserInfoModel>) => {
        this.profileInfoSubject.next(res);
        return res;
      }),
    );
  }

  clearProfile() {
    this.profileInfoSubject.next(null);
  }

  verifySejami(symbol: string): Observable<TServiceResult<{ symbol: string }>> {
    return this.baseApiService.post(VERIFY_SEJAMI_API, { symbol });
  }

  verifyShahkar(nationalId: string) {
    return this.baseApiService.post(VERIFY_SHAHKAR_API, { nationalId });
  }

  // TODO: remove
  verifyPortfolio(symbol: string) {
    return this.baseApiService.post(VERIFY_PORTFOLIO_API, { symbol });
  }

  getUserPhoneNumber() {
    const params = new HttpParams();
    return this.baseApiService.get(GET_PHONE_NUMBER_API, params);
  }

  clearProfileData() {
    this.profileInfoSubject.next(null);
  }

  updateSejamiProfile(): Observable<TServiceResult<UserInfoModel>> {
    return this.baseApiService.post(UPDATE_SEJAMI_PROFILE_API).pipe(
      map((res: TServiceResult<UserInfoModel>) => {
        this.profileInfoSubject.next(res);
        return res;
      }),
      catchError((e) => {
        return of(e);
      }),
    );
  }

  onboard(onboardBinary: string): Observable<ServiceResult> {
    return this.baseApiService.post(ONBOARD_API, { section: onboardBinary }).pipe(
      catchError((e) => {
        return of(e);
      }),
    );
  }
}
