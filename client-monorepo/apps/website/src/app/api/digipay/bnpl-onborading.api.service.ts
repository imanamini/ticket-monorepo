import {Injectable} from "@angular/core";
import {BaseHttpClient} from "../base-http-client";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {BNPLOnboardingMerchantsResponse} from "./models/bnpl-onborading/bnplOnboardingMerchantsResponse";


@Injectable({
  providedIn: 'root',
})

export class BnplOnboradingApiService extends BaseHttpClient {

  constructor(public httpClient: HttpClient) {
    super(httpClient);
  }

  fetchRecappedMerchants(merchants: string[]): Observable<BNPLOnboardingMerchantsResponse> {
    return super.post(`api/website/recapped-merchants`, { merchants });
  }
}
