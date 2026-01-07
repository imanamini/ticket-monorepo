import { Injectable } from '@angular/core';
import {ApiService} from "../../../core/http/api.service";
import { HttpHeaders} from "@angular/common/http";
import {StorageService} from "../../../core/services/storage.service";
import {Observable} from "rxjs";
import {TacResponse} from "../../models/tac.response";
import {TgsGetTicketBody} from "../../models/tgs-get-ticket-body";
import {TgsTicketInfoResponse} from "../../models/tgs-ticket-info.response";
import {TgsSelectFeatureBody} from "../../models/tgs-select-feature-body";
import {TgsSelectFeatureResponse} from "../../models/tgs-select-feature-response";
import {PaymentResult} from "../../models/payment-result.response";
import {map} from "rxjs/operators";
import {WalletApiService} from "../../wallet-api.service";
import {WalletBalanceResponse} from "../../models/wallet-balance.response";
import {LoginResponse} from "../../models/login.response";
import {convertNonEnglishDigits} from "../../../utils/strings";
import {DeviceInfoService} from "../../../user-interface/services/device-info.service";

@Injectable({
  providedIn: 'root'
})
export class NewUpgService {

  constructor(
    private apiService: ApiService,
    private storageService: StorageService,
    private deviceInfoService:DeviceInfoService
  ) {
  }

  /**
   * Get upg ticket (USED FOR TESTING)
   */
  getTgsTicket(body: TgsGetTicketBody): Observable<any> {
    const token: string = this.storageService.getAccessToken();
    return this.apiService.post('/tickets/business', body,
      {headers: new HttpHeaders().set('Authorization', 'Bearer ' + token)});
  }


  /**
   * Get TGS ticket info
   */
  getTgsTicketInfo(ticket: string): Observable<TgsTicketInfoResponse> {
    return this.apiService.get('tickets/' + ticket, {},
      {headers: new HttpHeaders().set('ticket', ticket)});
  }

  /**
   * Select feature TGS
   */

  tgsSelectFeature(state: TgsSelectFeatureBody): Observable<TgsSelectFeatureResponse> {
    const body = {
      ticket: state.ticket,
      featureName: state.featureName.toString()
    };
    return this.apiService.post('/tickets/features/select', body,
      {headers: new HttpHeaders().set('ticket', state.ticket)});
  }

  tgsPayByWallet(relativePayUrl, ticket: string): Observable<PaymentResult> {
    const body = {type: 'wallet', ticket};
    return this.apiService.post(relativePayUrl, body, {headers: {ticket}})
      .pipe(
        map((response) => {
          // convert JSON string to an object
          if (response.payInfo && typeof response.payInfo === 'string') {
            response.payInfo = JSON.parse(response.payInfo);
          }
          // fix activity info response
          // convert object with numeric keys to an array
          if (response.activityInfo) {
            response.activityInfo = WalletApiService.fixActivityInfoArray(response.activityInfo);
          }
          return response;
        }));
  }

  tac(ticket: string): Observable<TacResponse> {
    return this.apiService.post('users/in-app/tac', null,
      {headers: new HttpHeaders().set('ticket', ticket)});
  }

  tacAccept(ticket: string): Observable<TacResponse> {
    return this.apiService.post('users/in-app/tac/accept', null,
      {headers: new HttpHeaders().set('ticket', ticket)});
  }

  getHtml(address: string, headers: { [p: string]: string | string[] }): Observable<any> {
    return this.apiService.get(address, null,
      {
        responseType: 'text',
        headers: {
          Accept: 'text/html,application/xhtml+xml;',
          ...headers
        }
      }
    );
  }

  getUpgWalletBalance(ticket: string): Observable<WalletBalanceResponse> {
    return this.apiService.get('wallets/balance', {}, {headers: {ticket}});
  }

  loginUser(userId: string, password: string, features: Array<number>, ticket?: string): Observable<LoginResponse> {
    return this.apiService.post('users/login', {
        username: userId,
        password: convertNonEnglishDigits(password),
        features,
        device: this.deviceInfoService.get(),
      },
      ticket && {headers: {ticket}});
  }
}
