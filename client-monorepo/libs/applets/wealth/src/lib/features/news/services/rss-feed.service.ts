import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { NEWS_API } from '../../../data-access/constants/api';
import { RssFeed } from '../../../data-access/models/rss-feed.model';
import { BaseApiService } from '../../../components/core/services/base-api.service';
import { TServiceResult } from '../../../data-access/models/base/t-service-resutl';

@Injectable({
  providedIn: 'root',
})
export class RssFeedService {
  constructor(private baseApiService: BaseApiService) {
  }

  getFeed(): Observable<TServiceResult<RssFeed[]>> {
    const params = new HttpParams();
    return this.baseApiService.get(NEWS_API, params);
  }
}
