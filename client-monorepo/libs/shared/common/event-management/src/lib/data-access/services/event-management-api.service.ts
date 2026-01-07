import { inject, Injectable } from '@angular/core';
import { ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { Observable, of } from 'rxjs';
import { CompletedAnalyticsEvent } from '../models/send-event.request';

@Injectable({
  providedIn: 'root',
})
export class EventManagementApiService {
  apiService = inject(ApiService);

  sendEvents(data: CompletedAnalyticsEvent[]): Observable<any> {
    try {
      const request = new RequestBuilder(RequestTypeEnum.POST, 'public/events/send-event', data);
      return this.apiService.call(request);
    } catch (error) {
      return of(null);
    }
  }
}
