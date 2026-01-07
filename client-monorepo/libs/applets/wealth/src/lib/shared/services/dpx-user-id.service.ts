import { Injectable } from '@angular/core';
import { BaseApiService } from '../../components/core/services/base-api.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GET_DPX_USER_ID_API } from '../../data-access/constants/api';

@Injectable({
  providedIn: 'root',
})
export class DPXUserIdService {
  constructor(private baseApiService: BaseApiService) {}

  getUserProfile(): Observable<IDPXUserId> {
    return this.baseApiService.getDPX(GET_DPX_USER_ID_API).pipe(
      map((res: IDPXUserId) => {
        localStorage.setItem('userId', res.userDetail.userId);
        return res;
      }),
    );
  }
}

interface IDPXUserId {
  result: {
    title: string;
    status: number;
    message: string;
    level: string;
  };
  userDetail: {
    userId: string;
    name: string;
    surname: string;
    zoneId: string;
    cellNumber: string;
    nationalCode: string;
    active: boolean;
    gender: number;
    email: {};
    businesses: [];
    isNationalCodeVerified: boolean;
  };
}
