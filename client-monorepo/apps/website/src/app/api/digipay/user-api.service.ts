import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { User } from './models/user.model';
import { BaseHttpClient } from '../base-http-client';
import { HttpClient } from '@angular/common/http';
import { BaseApiResponse } from './models/base-api.response';
import { LoginWithPasswordRequest } from './models/user/login-with-password.request';
import { UserProfileResponse } from './models/user-profile.response';

@Injectable({
  providedIn: 'root',
})
export class UserApiService extends BaseHttpClient {
  constructor(private httpClient: HttpClient) {
    super(httpClient);
    this.api = 'digipay';
  }

  refreshToken(refreshToken: string): Observable<User> {
    return super.post('/users/token/refresh', { refreshToken });
  }

  loginUsingIdAndPassword(request: LoginWithPasswordRequest): Observable<BaseApiResponse> {
    return super.post('users/login', request);
  }

  loginUsingIdAndPasswordWithTicket(request: LoginWithPasswordRequest, ticket: string): Observable<BaseApiResponse> {
    return super.post('users/login', request, {
      headers: {
        ticket,
      },
    });
  }

  getUserData(): Observable<UserProfileResponse> {
    return super.get('users/profile');
  }
}
