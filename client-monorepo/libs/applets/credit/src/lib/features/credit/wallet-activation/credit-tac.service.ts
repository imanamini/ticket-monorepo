import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CreditApiService } from '../data-access/services/credit-api.service';
import { CreditTacResponse } from '../data-access/models/credit/credit-tac-response.model';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CreditTacService {
  shouldAccept = new BehaviorSubject<boolean>(false);

  constructor(private apiService: CreditApiService) {}

  setShouldAccept(value: boolean) {
    this.shouldAccept.next(value);
  }

  getShouldAccept(): BehaviorSubject<boolean> {
    return this.shouldAccept;
  }

  getData(): Observable<CreditTacResponse> {
    return this.apiService.getTacData().pipe(
      tap((r) => {
        this.setShouldAccept(r.shouldAccept);
      }),
    );
  }

  confirm(): Observable<any> {
    return this.apiService.confirmTac().pipe(
      tap(() => {
        this.setShouldAccept(false);
      }),
    );
  }
}
