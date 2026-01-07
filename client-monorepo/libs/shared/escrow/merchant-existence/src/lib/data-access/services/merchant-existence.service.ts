import { inject, Injectable } from '@angular/core';
import { ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { Observable } from 'rxjs';
import { UserRoleResponse } from '../models/merchant-exist.interface';
import { EscrowStorageService } from '@client-monorepo/escrow/utils';

@Injectable({
  providedIn: 'root',
})
export class MerchantExistenceService {
  private apiService = inject(ApiService);
  private storageService = inject(EscrowStorageService);

  getUserRole(): Observable<UserRoleResponse> {
    const header = { 'User-Id': this.storageService.getEscrowCellNumber() };
    let request = new RequestBuilder(RequestTypeEnum.GET, 'merchants/exist');
    request = request.setHeader(header);
    return this.apiService.call<UserRoleResponse>(request);
  }
}
