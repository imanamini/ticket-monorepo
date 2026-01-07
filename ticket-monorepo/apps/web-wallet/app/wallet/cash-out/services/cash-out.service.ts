import {Inject, Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CashOutConfigModel} from '../models/cash-out.model';
import {CashOutRegisterModel} from '../models/cash-out-register.model';
import {ApiService} from "../../../core/http/api.service";
import {TICKET_TOKEN} from "../utiles/ticket-token";

@Injectable()
export class CashOutService {
  constructor(
    public http: HttpClient,
    private apiService: ApiService,
    @Inject(TICKET_TOKEN) private ticketToken: BehaviorSubject<string>,
  ) {
  }

  private getHeader():{headers: HttpHeaders} {
    let headers = new HttpHeaders();
    headers = headers.set('ticket', this.ticketToken.value);
    return {headers};
  }

  getCertFile(fileId: string ): Observable<any> {
    return this.apiService.get('certs' + (fileId ? '/'+fileId: ''), null, {responseType: 'text' , ...this.getHeader()});
  }

  getCashOutConfig(): Observable<CashOutConfigModel> {
    return this.apiService.get('wallets/cash-out/card' , null , this.getHeader());
  }

  getCards(): Observable<any> {
    return this.apiService.get('cards' , null , this.getHeader());
  }

  getBanks(): Observable<any> {
    return this.apiService.get('banks' , null , this.getHeader());
  }

  registerCertificate(certificate: string ): Observable<string> {
    return this.http.get(`/certs/${certificate}`, {responseType: 'text' , ...this.getHeader()}).pipe();
  }

  getActiveBanks(): Observable<any> {
    return this.apiService.get('/banks/active-banks' , null , this.getHeader());
  }

  getCardProfileByCardNumber(body ): Observable<any> {
    return this.apiService.post('/cards/profile', body , this.getHeader());
  }

  getPublicKey(certName: string ): Observable<any> {
    return this.http.get(`${certName}`, {responseType: 'text' , ...this.getHeader()});
  }

  registerCashOut(cashOut: CashOutRegisterModel ): Observable<any> {
    return this.apiService.post('wallets/cash-out/register/card', cashOut , this.getHeader());
  }

  getFee(amount: number ): Observable<{ feeCharge: number }> {
    return this.apiService.get(`/wallets/cash-out/card/estimated-fee?amount=${amount}` , null , this.getHeader());
  }
}
