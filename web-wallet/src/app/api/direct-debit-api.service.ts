import { Injectable } from '@angular/core';
import { ApiService } from '../core/http/api.service';
import { Observable } from 'rxjs';
import { DurationTimeUnitEnum } from './emuns/duration-time-unit.enum';
import {
  DirectDebitBanks, DirectDebitContractRegister, DirectDebitContractResponse,
  DirectDebitContractsResponse,
  DirectDebitCreateTicketResponse,
  DirectDebitTicketInfoResponse
} from "./models/direct-debit.response";
import {GenericResponse} from "./models/generic.response";

@Injectable({
  providedIn: 'root'
})
export class DirectDebitApiService {

  constructor(
    private apiService: ApiService,
  ) {
  }

  getMaxFee(
    ticket: string,
    maxMonthlyTransactionCount: number,
    timeUnit: DurationTimeUnitEnum,
    count: number
  ): Observable<{
    feeAmount: number
  }> {
    return this.apiService.post('/direct-debits/contracts/max-fee', {
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

}
