import {Injectable} from '@angular/core';
import {ApiService} from '../core/http/api.service';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {FEATURE_NAMES, FEATURES} from './constants';
import {AuthResponse} from './models/auth.response';
import {TicketResponse} from './models/ticket.response';
import {TacResponse} from './models/tac.response';
import {map} from 'rxjs/operators';
import {TicketInfoResponse} from './models/ticket-info.response';
import {PaymentConfig} from './models/payment-config.response';
import {paymentCallbackUrl} from '../utils/url';
import {CashInTicketResponse} from './models/cash-in-ticket.response';
import {convertNonEnglishDigits} from '../utils/strings';
import {LoginResponse} from './models/login.response';
import {PaymentResult} from './models/payment-result.response';
import {activityInfoTransformer} from './transformer/activity-info.transformer';
import {
  DirectDebitBanks,
  DirectDebitContractRegister,
  DirectDebitContractResponse,
  DirectDebitContractsResponse,
  DirectDebitCreateTicketResponse,
  DirectDebitTicketInfoResponse
} from './models/direct-debit.response';
import {GenericResponse} from './models/generic.response';
import {DirectDebitGenerateTicketBody} from './models/direct-debit-generate-ticket-body';
import {NgxApiConfigService} from '@digipay/ngx-api-config';
import {DeviceInfoService} from "../user-interface/services/device-info.service";

@Injectable({
  providedIn: 'root'
})
export class WalletApiService {
  constructor(
    private apiService: ApiService,
    private httpClient: HttpClient,
    private apiConfigService: NgxApiConfigService,
    private deviceInfoService: DeviceInfoService
  ) {
  }

  /**
   * Initial authentication data
   */
  initAuthData = {
    username: 'digipay-username',
    password: 'digipay-password',
    grant_type: 'password'
  };

  /**
   * ActivityInfo key in the payment result object is
   * an object with numeric indexes and it is not
   * good structure to used inside loops.
   */
  static fixActivityInfoArray(objectOfActivities: object) {
    return activityInfoTransformer(objectOfActivities);
  }

  /**
   * Get authorization accessToken for calling test APIs (MERCHANT SIDE)
   */
  getAuthorization(authData = this.initAuthData): Observable<AuthResponse | any> {
    const formData = new HttpParams()
      .set('username', authData.username)
      .set('password', authData.password)
      .set('grant_type', authData.grant_type);

    return this.httpClient.post(this.apiService.makePath('/oauth/token'), formData, {
      responseType: 'json',
      headers: {
        Authorization: this.apiConfigService.getBasicAuthHeader(),
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    });
  }

  /**
   * Get payment ticket (USED FOR TESTING)
   * (MERCHANT SIDE)
   */
  getPurchaseTicket(body, options = {}): Observable<TicketResponse | any> {
    return this.apiService.post('/purchases/ticket', body, options);
  }

  /**
   * Get cash-in ticket (USED FOR TESTING)
   */
  getCashInTicket(body, options = {}): Observable<TicketResponse | any> {
    return this.apiService.post('/wallets/cash-in/ticket', body, options);
  }

  /**
   * Get cash-out ticket (USED FOR TESTING)
   */
  getCashOutTicket(body, options = {}): Observable<TicketResponse | any> {
    return this.apiService.post('/tickets/business?type=30', body, options);
  }

  /**
   * Get activate ticket (USED FOR TESTING)
   */
  getActivationTicket(body, options = {}): Observable<any> {
    return this.apiService.post('/businesses/ticket?type=6', body, options);
  }

  /**
   * Get upg ticket (USED FOR TESTING)
   */
  getUpgTicket(body, options = {}): Observable<any> {
    return this.apiService.post('/businesses/ticket?type=11', body, options);
  }

  /**
   * Get direct debit ticket (USED FOR TESTING)
   */
  getDirectDebitTicket(body: DirectDebitGenerateTicketBody, options = {}): Observable<any> {
    return this.apiService.post('/businesses/ticket?type=12', body, options);
  }

  /**
   * In app terms and conditions
   */
  inAppTac(ticket): Observable<TacResponse | any> {

    const fixUrl = (url) => {
      if (url.indexOf('digipay/api') >= 0) {
        url = url.split('digipay/api')[1];
        if (url.charAt(url.length - 1) === '/') {
          url = url.substr(0, url.length - 1);
        }
      }
      return url;
    };

    return this.apiService.post('users/in-app/tac', {}, {
      headers: new HttpHeaders().append('ticket', ticket)
    }).pipe(map((response: TacResponse) => {
        if (response.features) {
          Object.keys(response.features).forEach(featureKey => {
            const feature = response.features[featureKey];
            if (feature.url) {
              feature.originalUrl = feature.url;
              feature.url = fixUrl(feature.url);
            }
            return feature;
          });
        }

        return response;
      }
    ));
  }

  /**
   * Get purchase ticket info
   */
  getTicketInfo(ticket: string, tacResponse: TacResponse): Observable<TicketInfoResponse | any> {
    const featureCode = FEATURES[FEATURE_NAMES.SDK_INFO];
    return this.apiService.get(tacResponse.features[featureCode].url + '/' + ticket, {}, {headers: {ticket}});
  }

  /**
   * Get configuration of payments,
   * like maximum and minimum amount for cash-in
   */
  getPaymentConfig(): Observable<PaymentConfig> {
    return this.apiService.get('payments/config', null, {})
      .pipe(map((response: PaymentConfig) => {
        if (response.cashInDefaults) {
          response.cashInDefaults = response.cashInDefaults.reverse();
        }
        return response;
      }));
  }

  /**
   * Create a cash-in payment
   */
  createCashInPayment(purchaseTicket: string, amount: number, type): Observable<CashInTicketResponse | any> {
    return this.apiService.post('wallets/cash-in', {
      amount,
      redirectUrl: paymentCallbackUrl(type, purchaseTicket),
    });
  }

  /**
   * This probability is checked to be no greater than the assumed value
   */
  checkForCashInInput(amount, ticket: string): Observable<GenericResponse> {
    return this.apiService.post('/wallets/cash-in/cap', {amount}, {headers: {ticket}});
  }

  /*
   * Create a cash-in payment
   */
  createCashInPaymentUsingTacResponse(relativePayUrl: string, amount: number): Observable<CashInTicketResponse | any> {
    return this.apiService.post(relativePayUrl, {
      amount,
    });
  }

  /**
   * Send user PIN (password) to the API
   */
  loginUser(userId: string, password: string, features: Array<number>, ticket?: string): Observable<LoginResponse> {
    return this.apiService.post('users/login', {
        username: userId,
        password: convertNonEnglishDigits(password),
        features,
        device: this.deviceInfoService.get()
      },
      ticket && {headers: {ticket}});
  }

  /**
   * Pay by wallet
   */
  payByWallet(relativePayUrl, ticket: string): Observable<PaymentResult> {
    const body = {type: 'wallet', ticket};
    const header = {headers: {ticket}};

    return this.apiService.post(relativePayUrl, body, header).pipe(map((response) => {
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

  /**
   *
   */
  getTextFile(pageId: string) {
    return this.apiService.get('/files/' + pageId, {}, {
      responseType: 'text',
      headers: {
        Accept: 'text/html,application/xhtml+xml;'
      }
    });
  }

  /**
   * Get All subscription template groups (USED FOR TESTING)
   */
  getSubscriptionAllGroups(body = {}, options = {}): Observable<any> {
    return this.apiService.get('/subscriptions/templates/groups', body, options);
  }

  /**
   * Get subscription ticket (USED FOR TESTING)
   */
  getSubscriptionTicket(body, options = {}): Observable<any> {
    return this.apiService.post('/subscriptions/ticket', body, options);
  }

  /**
   * Get purchase ticket info
   */
  getSubscriptionTicketInfo(ticket: string, tacResponse: TacResponse): Observable<TicketInfoResponse | any> {
    return this.apiService.get('subscriptions/ticket/' + ticket, {}, {headers: {ticket}});
  }

  /**
   * Get subscription template info by group Id
   */
  getSubscriptionTemplateByGroup(ticket: string, groupId: string): Observable<TicketInfoResponse | any> {
    return this.apiService.get('subscriptions/templates/groups/' + groupId, {}, {headers: {ticket}});
  }

  /**
   * Register Subscription template
   */
  registerSubscriptionTemplate(body, options = {}): Observable<any> {
    return this.apiService.post('/subscriptions', body, options);
  }

  /**
   * Pay Subscription by wallet
   */
  subscriptionPay(body, options = {}): Observable<any> {
    return this.apiService.post('/subscriptions/pay/wallet', body, options);
  }

  /**
   * Get Subscription Activities
   */
  getSubscriptionActivities(body = {}, options = {}): Observable<any> {
    return this.apiService.get('/subscriptions', body, options);
  }

  /**
   * Cancel Subscription Contract
   */
  cancelSubscription(contractId = '', body = {}, options = {}): Observable<any> {
    return this.apiService.post(`/subscriptions/cancel/${contractId}`, body, options);
  }

  /**
   * Get Direct debit ticket info
   */
  getDirectDebitTicketInfo(ticket: string): Observable<DirectDebitTicketInfoResponse> {
    return this.apiService.get('direct-debits/ticket/' + ticket, {}, {headers: {ticket}});
  }

  /**
   * Create Direct debit ticket
   */
  createDirectDebitsTicket(body, options): Observable<DirectDebitCreateTicketResponse> {
    return this.apiService.post('direct-debits', body, options);
  }

  /**
   * Get Direct debit ticket info
   */
  getActiveDirectDebits(ticket: string): Observable<DirectDebitContractsResponse> {
    return this.apiService.get('direct-debits/contracts', {}, {headers: {ticket}});
  }

  /**
   * Get Direct debit bank list
   */
  getDirectDebitBanks(ticket: string): Observable<DirectDebitBanks> {
    return this.apiService.get('direct-debits/banks', {}, {headers: {ticket}});
  }

  /**
   * Cancel Direct debit contract based on ContractId
   */
  cancelDirectDebitContract(contractId: string, ticket: string): Observable<GenericResponse> {
    return this.apiService.post('direct-debits/contracts/cancel/' + contractId, {}, {headers: {ticket}});
  }

  /**
   * Register new Direct Debit contract
   */
  registerDirectDebitContract(body = {}, ticket: string): Observable<DirectDebitContractRegister> {
    return this.apiService.post('direct-debits/contracts', body, {headers: {ticket}});
  }

  /**
   * Get Direct Debit contract data
   */
  getDirectDebitContractInfo(contractId, ticket: string): Observable<DirectDebitContractResponse> {
    return this.apiService.get('direct-debits/contracts/' + contractId, {}, {headers: {ticket}});
  }

//  Direct debit digiplus
  directDebitContractValidation(nationalCode: string, ticket: string): Observable<any> {
    return this.apiService.post('direct-debits/contracts/validate', {nationalCode}, {headers: {ticket}});
  }

  walletFlag(ticket: string , module:'ICP' | 'CahInAndPay' | 'OldCashIn'): Observable<any> {
    return this.apiService.post(`purchases/${ticket}/wallet-flag?module=${module}`);
  }
}
