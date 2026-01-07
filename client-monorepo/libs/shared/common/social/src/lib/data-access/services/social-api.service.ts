import { Inject, inject, Injectable } from '@angular/core';
import { ApiService, OrderTypes, RequestBuilder, RequestTypeEnum, Restriction, RestrictionTypes } from '@client-monorepo/common/network';
import { Observable } from 'rxjs';
import { SocialRestrictionFields } from '../constants/social.constant';
import { SocialSearchBodyModel } from '../models/social-search-body.model';
import { SocialPostResponseModel } from '../models/social-post.model';
import { SocialSearchPostConfig } from '../models/social-search-post.config';
import { SearchSuggestionApiResponseInterface } from '@client-monorepo/stores';
import { SocialLatestPostsResponse } from '../models/social-latest-posts.model';

@Injectable({
  providedIn: 'root',
})
export class SocialApiService {
  apiService = inject(ApiService);
  baseSocialUrl = 'app/store/social/';

  constructor(@Inject('APP_ENV') private environment: { [key: string]: string }) {}

  searchPosts(config: SocialSearchPostConfig): Observable<SocialPostResponseModel> {
    const restrictions: Restriction<SocialRestrictionFields>[] = [
      {
        type: RestrictionTypes.SIMPLE,
        field: SocialRestrictionFields.EXPIRED,
        value: 0,
        operation: 'eq',
      },
    ];
    if (config.socialUserName) {
      restrictions.push({
        type: RestrictionTypes.SIMPLE,
        field: SocialRestrictionFields.USER_NAME,
        value: config.socialUserName,
        operation: 'eq',
      });
    }
    if (config.postId && config.postId !== '') {
      restrictions.push({
        type: RestrictionTypes.SIMPLE,
        field: SocialRestrictionFields.POST_ID,
        value: config.postId,
        operation: 'eq',
      });
    } else if (config.postIds) {
      restrictions.push({
        type: RestrictionTypes.COLLECTION,
        field: SocialRestrictionFields.POST_ID,
        values: config.postIds,
      });
    }
    const body: SocialSearchBodyModel = {
      searchRequest: {
        restrictions,
        orders: config.orders?.length ? config.orders : [{ field: SocialRestrictionFields.TIMESTAMP, order: OrderTypes.DESC }],
      },
    };
    let params: any = { size: config.size ?? 10, page: config.page ?? 0, project: config.project ?? 'EXPLORE' };
    if (config.searchText && config.searchText !== '') {
      params = { ...params, keyword: config.searchText };
    }
    const request = new RequestBuilder(RequestTypeEnum.POST, this.baseSocialUrl + 'posts', body.searchRequest);
    request.setParams(params);
    return this.apiService.call<SocialPostResponseModel>(request);
  }

  getSuggestions(keyword: string): Observable<SearchSuggestionApiResponseInterface> {
    const request = new RequestBuilder(RequestTypeEnum.GET, this.baseSocialUrl + 'suggest');
    request.setParams({ keyword });
    return this.apiService.call<SearchSuggestionApiResponseInterface>(request);
  }

  getLatestPosts(trackingCodes: string[], page = 0, size = 10, postNumber = 4): Observable<SocialLatestPostsResponse> {
    const qp = '?storeTrackingCodes=' + trackingCodes.join(',');
    const request = new RequestBuilder(RequestTypeEnum.GET, this.baseSocialUrl + 'posts/latest' + qp);
    request.setParams({ page, size, postNumber });
    return this.apiService.call<SocialLatestPostsResponse>(request);
  }
}
