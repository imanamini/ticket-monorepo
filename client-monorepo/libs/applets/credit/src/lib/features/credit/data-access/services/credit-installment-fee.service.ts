import { Injectable, signal } from '@angular/core';
import { FeeDetails } from '../models/credit/installment/fee';

@Injectable({
  providedIn: 'root',
})
export class CreditInstallmentFeeService {
  #feeDetails = signal<FeeDetails | null>(null);

  get feeDetails() {
    return this.#feeDetails.asReadonly();
  }

  setFeeDetails(feeDetails: FeeDetails) {
    return this.#feeDetails.set(feeDetails);
  }
}
