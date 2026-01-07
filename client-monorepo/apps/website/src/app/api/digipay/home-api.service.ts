import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { BaseHttpClient } from '../base-http-client';
import { HOME_FEATURE_GROUPS } from './models/home/home-feature-groups';
import { HomeFeaturesResponse } from './models/home/home-features.response';
import { FeedsResponse } from './models/home/feed/feeds.response';
import { CardsListResponse } from './models/home/cards-list.response';
import { HomeNotification } from './models/home/message/home-notification';
import { HomeFeature } from './models/home/home-feature';
import { ServiceUrlResponse } from './models/marketplace/service-url.response';
import { BaseApiResponse } from './models/base-api.response';

@Injectable({
  providedIn: 'root',
})
export class HomeApiService extends BaseHttpClient {
  constructor(public httpClient: HttpClient) {
    super(httpClient);
    this.api = 'digipay';
  }

  getFeatureGroup(feature: HOME_FEATURE_GROUPS): Observable<HomeFeaturesResponse> {
    return super.get(`features/${feature}`);
  }

  updateFeatureGroup(featureCode: HOME_FEATURE_GROUPS, features: Array<string>): Observable<BaseApiResponse> {
    return super.put(`features/${featureCode}/order`, {
      features,
    });
  }

  getFeeds(): Observable<FeedsResponse> {
    return super.get('feeds');
  }

  getWallets(): Observable<CardsListResponse> {
    return super.get('wallets/setting').pipe(
      map((response: CardsListResponse) => {
        return response;
      }),
    );
  }

  getCreditCards(): Observable<CardsListResponse> {
    return super.get('credit/users/wallet');
  }

  getCards(): Observable<CardsListResponse> {
    return super.get(`cards/setting`).pipe(
      map((response: CardsListResponse) => {
        return response;
      }),
    );
  }

  getNotifications(): Observable<HomeNotification> {
    return super.get('messages');
  }

  setReadNotify(uid: string): Observable<any> {
    return super.post('messages/' + uid + '/read');
  }

  clearBadge(uid: string, badgeId: string): Observable<any> {
    return super.put(`features/${uid}/badges/${badgeId}`);
  }

  /**
   * Webview features have two URLs, service URL and an API URL which
   * generates the service URL.
   * API is always protected, so an API call is necessary to get
   * the service URL, which is a public address that can be simply
   * opened web in browsers
   */
  getRedirectUrlForWebviewFeature(feature: HomeFeature): Promise<any> {
    const url = super.removeHostFromUrl(feature.url);
    return new Promise((resolve, reject) => {
      super
        .get(url)
        .toPromise()
        .then((response: ServiceUrlResponse) => {
          // resolve the promise with the service URL
          let serviceUrl = response.redirectUrl;
          if (feature.insiderEvent && feature.insiderEvent.toLowerCase().indexOf('wealth')) {
            // open wealth mini-app in browser, especially for DK app
            if (serviceUrl.indexOf('?') < 0) {
              serviceUrl += '?';
            }
            serviceUrl += '&inbrowser=1';
          }

          resolve(serviceUrl);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }
}
