import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseHttpClient } from '../base-http-client';
import { OperatorIds } from './models/carrier/operator-ids';
import {
  CreateInternetPurchaseTicketRequest,
  CreateInternetPurchaseTicketResponse,
  INTERNET_PACKAGE_DURATIONS_TRANSLATIONS,
  InternetPackagesResponse,
} from './models/internet';
import { FavouritePackagesResponse } from './models/internet/favourite';

@Injectable({
  providedIn: 'root',
})
export class InternetApiService extends BaseHttpClient {
  constructor(public httpClient: HttpClient) {
    super(httpClient);
    this.api = 'digipay';
  }

  getInternetPackage(operatorId: OperatorIds, params: object = {}): Observable<InternetPackagesResponse> {
    return super.post(`/bundles/${operatorId}`, params).pipe(
      map((response: InternetPackagesResponse) => {
        if (response.bundleCategories) {
          response.bundleCategories.forEach((category, catIndex) => {
            category.bundleSections.forEach((subCat, subCatIndex) => {
              subCat.bundles = subCat.bundles.map((bundle) => {
                bundle.internetPackages = bundle.internetPackages.map((ip) => {
                  /*ip.originalAmount = ip.amount;
                ip.amount /= 10;*/
                  ip.durationTranslation = INTERNET_PACKAGE_DURATIONS_TRANSLATIONS[ip.duration];
                  return ip;
                });

                return bundle;
              });

              category.bundleSections[subCatIndex] = subCat;
            });
          });
        }

        return response;
      }),
    );
  }

  getFavouriteInternetPackages(operatorId: OperatorIds, params: any = {}): Observable<FavouritePackagesResponse> {
    return super.post(`/bundles/${operatorId}/favorites`, params).pipe(
      map((response: FavouritePackagesResponse) => {
        if (response.bundles && response.bundles.length > 0) {
          response.cellNumber = params.cellNumber;
          response.simType = response.bundles[0].type;
          response.operatorId = operatorId;
        }

        return response;
      }),
    );
  }

  createInternetPurchase(request: CreateInternetPurchaseTicketRequest): Observable<CreateInternetPurchaseTicketResponse> {
    return super.post('bundles', request);
  }
}
