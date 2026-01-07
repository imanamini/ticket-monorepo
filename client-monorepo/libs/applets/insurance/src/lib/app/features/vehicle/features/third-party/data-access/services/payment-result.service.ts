import { Injectable } from '@angular/core';
import { PaymentResultData } from '../../../../data-access/models/payment-result-data.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentResultService {
  private readonly ORDER_DATA: string = 'order-data';

  storeOrderData(model: PaymentResultData): void {
    localStorage.setItem(this.ORDER_DATA, JSON.stringify(model));
  }

  getOrderData(): PaymentResultData {
    const item = localStorage.getItem(this.ORDER_DATA);
    if (item) {
      return JSON.parse(item);
    }
    return null;
  }

  removeOrderData(): void {
    localStorage.removeItem(this.ORDER_DATA);
  }
}
