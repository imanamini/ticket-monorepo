import { Injectable } from '@angular/core';
import { CheckCreditFileFailedResult } from '../check-credit-file-failed-result';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CheckCreditFileFailedService {
  failedData = new BehaviorSubject<CheckCreditFileFailedResult | null>(null);

  setFailedData(data: CheckCreditFileFailedResult) {
    this.failedData.next(data);
  }
}
