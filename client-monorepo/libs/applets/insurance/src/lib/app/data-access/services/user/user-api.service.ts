import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { UserAuthService } from '../user-services/user-auth.service';
import { UserProfileModel } from '../../models/user-profile.model';
import { LoginResponse, User } from '../../../features/auth/models/auth.model';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})

export class UserApiService extends ApiService {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  private authService = inject(UserAuthService);

  baseUrl = '/users';

  getUserProfile(): Observable<UserProfileModel> {
    return super.get(this.baseUrl + '/profile');
  }

  postRefreshToken(): Observable<User> {
    return this.post(this.baseUrl + '/token/refresh', {refreshToken: this.authService.getAuthToken?.refresh});
  }

  login(params): Observable<LoginResponse> {
    return this.post(this.baseUrl + '/login', params);
  }
}
