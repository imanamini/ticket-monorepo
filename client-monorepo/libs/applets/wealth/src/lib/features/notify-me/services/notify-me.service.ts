import { Observable, of } from 'rxjs';
import { INotifyValues } from '../models';
import { catchError, map } from 'rxjs/operators';
import { inject, Injectable } from '@angular/core';
import { TServiceResult } from '../../../data-access/models/base/t-service-resutl';
import { BaseApiService } from '../../../components/core/services/base-api.service';
import { NOTIFY_ME_HAS_INFORM_API, NOTIFY_ME_INFORM_API } from '../../../data-access/constants/api';

export const NOTIFY_ME_INFORM_KEY = 'notify-me-inform-key';

@Injectable({
  providedIn: 'root',
})
export class NotifyMeService {
  private baseApiService = inject(BaseApiService);

  inform(subjectId: string): Observable<TServiceResult<number>> {
    return this.baseApiService.post(`${NOTIFY_ME_INFORM_API}?subjectId=${subjectId}`).pipe(
      map((res) => {
        this.updateFeatures(subjectId, res.result);
        return res;
      }),
      catchError((e) => {
        return of(e);
      }),
    );
  }

  hasInform(subjectId: string): Observable<TServiceResult<number>> {
    const features: INotifyValues[] = JSON.parse(localStorage.getItem(NOTIFY_ME_INFORM_KEY));
    const existFeature = features?.find((feature) => feature.subjectId === subjectId && feature.value);
    if (existFeature) {
      return of(new TServiceResult<number>(+existFeature.value, '', null, true));
    } else {
      return this.baseApiService.get(`${NOTIFY_ME_HAS_INFORM_API}?subjectId=${subjectId}`).pipe(
        map((res) => {
          this.updateFeatures(subjectId, res.result);
          return res;
        }),
        catchError((e) => {
          return of(e);
        }),
      );
    }
  }

  private getFeatures(): INotifyValues[] {
    return JSON.parse(localStorage.getItem(NOTIFY_ME_INFORM_KEY)) || [];
  }

  private updateFeatures(subjectId: string, value: string): void {
    const features = this.getFeatures();
    if (features?.length > 0) {
      features?.forEach((feature) => {
        if (!feature?.subjectId?.includes(subjectId) || feature?.value != value) {
          features.push({
            subjectId,
            value,
          });
          localStorage.setItem(NOTIFY_ME_INFORM_KEY, JSON.stringify(features));
        }
      });
    } else {
      features.push({
        subjectId,
        value,
      });
      localStorage.setItem(NOTIFY_ME_INFORM_KEY, JSON.stringify(features));
    }
  }
}
