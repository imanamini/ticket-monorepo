import { inject, Injectable } from '@angular/core';
import { HttpContext } from '@angular/common/http';
import { BaseApiService, SKIP_BASIC_TOKEN } from '../base-api.service';
import { API } from '../../../../data-access/constants/api';
import { catchError, Observable, throwError } from 'rxjs';
import { IBankAccount } from '../../models/bank-account.interface';
import { ServiceResult } from '../../../../data-access/models/base/service-result';
import { TServiceResult } from '../../../../data-access/models/base/t-service-resutl';

@Injectable({
  providedIn: 'root',
})
export class BankAccountService {
  private baseApiService = inject(BaseApiService);

  getBankAcccounts(): Observable<TServiceResult<IBankAccount[]>> {
    return this.baseApiService.get(`${API.customer.base}/sheba-numbers`).pipe(
      catchError((err) => {
        return throwError(() => err);
      }),
    );
  }

  addNewBankAcccount(value: string): Observable<ServiceResult> {
    return this.baseApiService
      .post(`${API.customer.base}/sheba-number`, { value }, undefined, new HttpContext().set(SKIP_BASIC_TOKEN, true))
      .pipe(
        catchError((err) => {
          return throwError(() => err);
        }),
      );
  }

  deleteBankAccount(shebaNumberId: number): Observable<ServiceResult> {
    return this.baseApiService
      .put(`${API.customer.base}/deactivate-sheba-number`, { shebaNumberId }, new HttpContext().set(SKIP_BASIC_TOKEN, true))
      .pipe(
        catchError((err) => {
          return throwError(() => err);
        }),
      );
  }
}
