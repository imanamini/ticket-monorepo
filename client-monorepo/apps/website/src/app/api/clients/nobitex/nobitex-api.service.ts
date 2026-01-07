import { Injectable } from '@angular/core';
import { BaseHttpClient } from '../../base-http-client';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { InquiryResponse } from '../../../ui/models/nobitex/inquiry.response';
import { estimateNobitexResponse } from '../../../ui/models/nobitex/estimate-nobitex.response';
import { SubmitNobitexCreditResponse } from '../../../ui/models/nobitex/submit-nobitex.response';
import { nobitexCredit } from '../../../ui/models/nobitex/nobitex-credit.model';
import { MerchantsApiService } from '../credit/merchants-api.service';
import { map } from 'rxjs/operators';

export interface validateUserInShahkar {
  nationalCode: string;
  cellNumber: string;
  birthDate: number;
}

export enum VOLUNTEER_STATES {
  ON_BOARDING = 0,
  ON_BOARDED = 1,
  PREREGISTERING = 2,
  PREREGISTERED = 3,
  REGISTERED = 4,
  REGISTRATION_FAILED = 5,
  DUPLICATE_CELL_NUMBER = 6,
  DUPLICATE_NATIONAL_ID = 7,
}

@Injectable({
  providedIn: 'root',
})
export class NobitexApiService extends BaseHttpClient {
  constructor(
    private httpClient: HttpClient,
    private merchantsApiService: MerchantsApiService,
  ) {
    super(httpClient);
  }

  getInQuiry(input: validateUserInShahkar): Observable<InquiryResponse> {
    const obj = JSON.stringify(input);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return super.post(`website/identity/inquiry`, obj, httpOptions).pipe(
      map((value) => value),
      catchError((error: HttpErrorResponse) => {
        return of({ info: error.error.info });
      }),
    );
  }

  estimateNobitexCredit(cellNumber: string, nationalCode: string, birthDate: number): Observable<estimateNobitexResponse> {
    return super.post(`website/nobitex/estimate`, {
      cellNumber: cellNumber,
      nationalCode: nationalCode,
      birthDate: birthDate,
    });
  }

  submitCreditReq(input: nobitexCredit): Observable<SubmitNobitexCreditResponse> {
    const obj = JSON.stringify(input);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return super.post(`website/nobitex/credit`, obj, httpOptions);
  }
}
