import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StoreDataForPaymentService {
  private readonly KEY: string = 'floki-order-data';

  storeOrderData(model: { isHybrid: boolean, referrer?: string; appId: string; paymentId: string}): void {
    localStorage.setItem(this.KEY, JSON.stringify(model));
  }

  getOrderData(): { isHybrid: boolean, referrer?: string; appId: string; paymentId: string } {
    const item = localStorage.getItem(this.KEY);
    if (item) {
      return JSON.parse(item);
    }
    return null;
  }

  removeOrderData(): void {
    localStorage.removeItem(this.KEY);
  }
}
