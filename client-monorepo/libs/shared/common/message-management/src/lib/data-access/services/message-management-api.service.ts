import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, GenericApiResponse, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { MessagesResponse } from '../models/messages-response';

@Injectable({
  providedIn: 'root',
})
export class MessageManagementApiService {
  private readonly apiService = inject(ApiService);

  getAllMessagesApi(page: number, pageSize: number, categories?: number[]): Observable<MessagesResponse> {
    let url = `app/app-messaging?page=${page}&pageSize=${pageSize}`;

    if (categories && categories.length > 0) {
      url += `&categories=${categories.join(',')}`;
    }
    const request = new RequestBuilder(RequestTypeEnum.GET, url);
    return this.apiService.call(request);
  }

  readAllMessagesApi(): Observable<GenericApiResponse> {
    const request = new RequestBuilder(RequestTypeEnum.PUT, 'app/app-messaging/read');
    return this.apiService.call(request);
  }

  readMessageApi(messageId: string, isForceSend = true): Observable<GenericApiResponse> {
    const request = new RequestBuilder(RequestTypeEnum.POST, `app/app-messaging/${messageId}/read`);
    request.forceSend = isForceSend;
    return this.apiService.call(request);
  }
}
