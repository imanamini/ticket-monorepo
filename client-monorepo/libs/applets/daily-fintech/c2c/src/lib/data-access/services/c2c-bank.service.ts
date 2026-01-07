import { inject, Injectable } from '@angular/core';
import { catchError, Observable, take, tap, throwError } from 'rxjs';
import {
  BankCard,
  BankCardApiService,
  BankClientResponse,
  DynamicPasswordRequest,
  DynamicPasswordResponse,
} from '@client-monorepo/daily-fintech/bank-card';
import { C2cApiService } from './c2c-api.service';
import { C2cStateService } from './c2c-state.service';
import { SOURCE_CARD_LOAD_STATUS } from '../models/source-card-load-status';
import { C2cCardHelper } from '../../utils/c2c-card';
import { CARD_TRANSACTION_TYPES } from '../models/card-transaction-types.enum';

@Injectable({
  providedIn: 'root',
})
export class C2cBankService {
  private bankCardApiService = inject(BankCardApiService);
  private c2cApiService = inject(C2cApiService);
  private c2cStateService = inject(C2cStateService);

  /**
   * Loads all banks and updates related state.
   * This is the specialized logic for bank operations.
   */
  loadAllBanks(): Observable<any> {
    return this.bankCardApiService
      .getAllBanks()
      .pipe(tap(this.handleBanksSuccess.bind(this)), catchError(this.handleBanksError.bind(this)), take(1));
  }

  loadBankConfig(bankCode: string): Observable<BankClientResponse> {
    return this.bankCardApiService.getBankClientConfig(bankCode);
  }

  sendRequestForDynamicPassword(sourceCard: BankCard, destCard: BankCard, config: BankClientResponse): Observable<DynamicPasswordResponse> {
    const request: DynamicPasswordRequest = {
      certFile: config.certFileName,
      amount: Number(this.c2cStateService.amount()),
      pan: C2cCardHelper.makeCardDtoForOtp(sourceCard as BankCard),
      targetPan: C2cCardHelper.makeCardDtoForOtp(destCard as BankCard, config.certFile),
      transactionType: CARD_TRANSACTION_TYPES.CARD_TO_CARD,
    };
    return this.c2cApiService.requestDynamicPassword(request, config.timeout);
  }

  // Private bank-specific logic
  private handleBanksSuccess(banks: any) {
    this.c2cApiService.timeout.set(banks.maxTimeout);
    this.c2cStateService.allBanks.set(banks.banks);
    this.c2cStateService.profileEncryptionCertFile.set(banks.banks[0]?.profileCert || '');
  }

  private handleBanksError = (error: any) => {
    this.c2cStateService.sourceCardsLoadStatus.set(SOURCE_CARD_LOAD_STATUS.FAILED);
    return throwError(() => error);
  };

  /**
   * Fetches the bank certificate for encryption.
   * @returns Observable emitting the bank certificate string
   */
  public getBankCert(): Observable<string> {
    return this.bankCardApiService.getCertFileByUrl(this.c2cStateService.sourceBank()?.xferCertFileUrl || '');
  }
}
