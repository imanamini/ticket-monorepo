import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BodyInsuranceStoreService {
  private readonly ORDER_DATA: string = 'order-bimeh.com-data';

  storeOrderData(model: { isHybrid: boolean, referrer?: string }): void {
    localStorage.setItem(this.ORDER_DATA, JSON.stringify(model));
  }

  getOrderData(): { isHybrid: boolean, referrer?: string } {
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
