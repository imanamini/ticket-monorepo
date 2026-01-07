import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiService, CacheService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { UserProfileInterface } from '../models/user-profile.interface';
import { ProfileInterface } from '../models/profile.interface';
import { UploadAvatarResponseInterface } from '../models/upload-avatar-response.interface';
import { ReferralData } from '../models/referral-reponse.interface';
import { UserFeature, UserFeaturesApiResponse } from '../models/user-features-api-response';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  apiService = inject(ApiService);
  cacheService = inject(CacheService);

  getProfile(): Observable<ProfileInterface> {
    let request = new RequestBuilder(RequestTypeEnum.GET, 'users/profile');
    request = request.enableCache(100000);
    return this.apiService.call<UserProfileInterface>(request).pipe(
      map((result: UserProfileInterface) => {
        return result.userDetail;
      }),
    );
  }

  updateProfile(params: object): Observable<ProfileInterface> {
    const url = 'users/profile';
    this.cacheService.deleteFromCache(url, false);
    const request = new RequestBuilder(RequestTypeEnum.PUT, url, params);
    return this.apiService.call<UserProfileInterface>(request).pipe(
      map((result: UserProfileInterface) => {
        return result.userDetail;
      }),
    );
  }

  uploadAvatar(params: object): Observable<UploadAvatarResponseInterface> {
    const request = new RequestBuilder(RequestTypeEnum.POST, `files/upload`, params);
    return this.apiService.call<UploadAvatarResponseInterface>(request);
  }

  getReferralInfo(): Observable<ReferralData> {
    const request = new RequestBuilder(RequestTypeEnum.GET, `users/referral`);
    return this.apiService.call<ReferralData>(request);
  }

  getUserFeatures(): Observable<UserFeaturesApiResponse> {
    const request = new RequestBuilder(RequestTypeEnum.GET, 'users/features');
    return this.apiService.call<UserFeaturesApiResponse>(request);
  }

  setUserFeatures(features: Record<number, UserFeature>): Observable<any> {
    const request = new RequestBuilder(RequestTypeEnum.POST, 'users/features', features);
    return this.apiService.call<UserFeaturesApiResponse>(request);
  }
}
