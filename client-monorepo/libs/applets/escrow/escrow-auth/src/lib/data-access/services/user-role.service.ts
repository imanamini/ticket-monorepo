import { Injectable, inject } from '@angular/core';
import { ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { Observable } from 'rxjs';
import { UserRoleResponse } from '../models/user-role.interface';

@Injectable({
  providedIn: 'root',
})
export class UserRoleService {
  private apiService = inject(ApiService);

  getUserRole(cellNumber: string): Observable<UserRoleResponse> {
    const header = { 'User-Id': cellNumber };
    let request = new RequestBuilder(RequestTypeEnum.GET, 'merchants/exist');
    request = request.setHeader(header);
    return this.apiService.call<UserRoleResponse>(request);
  }
}
