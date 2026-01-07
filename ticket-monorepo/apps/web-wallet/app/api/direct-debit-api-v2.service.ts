import { Injectable } from '@angular/core';
import {DurationTimeUnitEnum} from "./emuns/duration-time-unit.enum";
import {Observable} from "rxjs";
import {
  DirectDebitBanks, DirectDebitContractRegister, DirectDebitContractResponse,
  DirectDebitTicketInfoResponse
} from "./models/direct-debit.response";
import {ApiService} from "../core/http/api.service";
import {DirectDebitGenerateTicketBody} from "./models/direct-debit-generate-ticket-body";

@Injectable({
  providedIn: 'root'
})
export class DirectDebitApiV2Service {

  constructor(
    private apiService: ApiService,
  ) {
  }

  getMaxFeeV2(
    ticket: string,
    maxMonthlyTransactionCount: number,
    timeUnit: DurationTimeUnitEnum,
    count: number
  ): Observable<{
    feeAmount: number
  }> {
    return this.apiService.post('/direct-debits/v2/contracts/max-fee', {
      maxMonthlyTransactionCount,
      duration: {
        timeUnit,
        count,
      }
    }, {
      headers: {
        ticket
      }
    });
  }

  /**
   * Get direct debit ticket (USED FOR TESTING)
   */
  getDirectDebitTicket(body: DirectDebitGenerateTicketBody, options = {}): Observable<any> {
    return this.apiService.post('direct-debits/v2/ticket', body, options);
  }


  /**
   * Get Direct debit ticket info
   */
  getDirectDebitTicketInfoV2(ticket: string): Observable<DirectDebitTicketInfoResponse> {
    return this.apiService.get('direct-debits/v2/ticket/' + ticket, {}, {headers: {ticket}});
  }

  /**
   * Get Direct debit bank list
   */
  getDirectDebitBanksV2(ticket: string): Observable<DirectDebitBanks> {
    return this.apiService.get('direct-debits/v2/banks', {}, {headers: {ticket}});
  }

  /**
   * Register new Direct Debit contract
   */
  registerDirectDebitContractV2(body = {}, ticket: string): Observable<DirectDebitContractRegister> {
    return this.apiService.post('direct-debits/v2/contracts', body, {headers: {ticket}});
  }

  /**
   * Get Direct Debit contract data
   */
  getDirectDebitContractInfoV2(contractId, ticket: string): Observable<DirectDebitContractResponse> {
    return this.apiService.get('direct-debits/v2/contracts/' + contractId, {}, {headers: {ticket}});
  }

  //  Direct debit digiplus
  directDebitContractValidationV2(nationalCode: string, ticket: string): Observable<any> {
    return this.apiService.post('direct-debits/v2/contracts/validate', {nationalCode: Boolean(nationalCode) ?nationalCode: null}, {headers: {ticket}});
  }

}
