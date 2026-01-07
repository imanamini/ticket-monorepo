import {Injectable} from "@angular/core";

import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {BaseHttpClient} from "../../base-http-client";
import {thirdPartyInsuranceModel} from "./thirdPartyInsurance.model";
import {ThirdPartyInsuranceResponse} from "./ThirdPartyInsurance-response";


@Injectable({
  providedIn: 'root'
})

export class InsuranceApiService {
  constructor(private http: HttpClient,
              private apiService: BaseHttpClient) {

  }

  thirdPartyInsurance(insuranceInput: thirdPartyInsuranceModel): Observable<ThirdPartyInsuranceResponse> {
    const input = JSON.stringify(insuranceInput);
    let headers = new HttpHeaders().append('content-type', 'application/json');
    return this.http.post<ThirdPartyInsuranceResponse>(this.apiService.getApiPath('/insurance/vehicle-thirdparty/v1/application-forms'), input, {headers: headers});
  }
}



