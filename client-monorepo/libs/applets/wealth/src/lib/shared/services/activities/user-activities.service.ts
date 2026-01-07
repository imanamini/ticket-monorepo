import { Observable, take } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { API } from '../../../data-access/constants/api';
import { IUserActivity } from './models/user-activities.interface';
import { ServiceResult } from '../../../data-access/models/base/service-result';
import { BaseApiService } from '../../../components/core/services/base-api.service';

@Injectable({
  providedIn: 'root',
})
export class UserActivitiesService {
  private baseApiService = inject(BaseApiService);

  action(data: IUserActivity): Observable<ServiceResult> {
    return this.baseApiService.post(API.user.activities, data).pipe(take(1));
  }
}
