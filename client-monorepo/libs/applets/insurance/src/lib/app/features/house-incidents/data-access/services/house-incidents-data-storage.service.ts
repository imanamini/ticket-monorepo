import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HouseIncidentsDataStorageService {
  private readonly HOUSE_INCIDENTS_ORDER_DATA_KEY = 'house-incidents-order-data';
  private readonly HOUSE_INCIDENTS_APP_ID_KEY = 'house-incidents-app-id';
  private readonly HOUSE_INCIDENTS_APP_ID_TTL: number = 24 * 60 * 60 * 1000;
  private readonly HOUSE_INCIDENTS_JOURNEY_TYPE_KEY = 'house-incidents-journey-type';

  storeOrderData(model: { isHybrid: boolean, referrer?: string; appId: string; providerId: string }): void {
    localStorage.setItem(this.HOUSE_INCIDENTS_ORDER_DATA_KEY, JSON.stringify(model));
  }

  getOrderData(): { isHybrid: boolean, referrer?: string; appId: string; providerId: string } {
    const item = localStorage.getItem(this.HOUSE_INCIDENTS_ORDER_DATA_KEY);
    if (item) {
      return JSON.parse(item);
    }
    return null;
  }

  removeOrderData(): void {
    localStorage.removeItem(this.HOUSE_INCIDENTS_ORDER_DATA_KEY);
  }

  storeApplicationFormId(appId: string): void {
    const value = {appId, expiry: new Date().getTime() + this.HOUSE_INCIDENTS_APP_ID_TTL};
    localStorage.setItem(this.HOUSE_INCIDENTS_APP_ID_KEY, JSON.stringify(value));
  }

  getApplicationFormId(): string | null {
    const value = JSON.parse(localStorage.getItem(this.HOUSE_INCIDENTS_APP_ID_KEY));
    return value?.expiry > new Date().getTime() ? value.appId : null;
  }

  removeApplicationFormId(): void {
    localStorage.removeItem(this.HOUSE_INCIDENTS_APP_ID_KEY);
  }

  storeJourneyType(journeyType: string): void {
    localStorage.setItem(this.HOUSE_INCIDENTS_JOURNEY_TYPE_KEY, journeyType);
  }

  getJourneyType(): string | null {
    return localStorage.getItem(this.HOUSE_INCIDENTS_JOURNEY_TYPE_KEY);
  }

  removeJourneyType(): void {
    localStorage.removeItem(this.HOUSE_INCIDENTS_JOURNEY_TYPE_KEY);
  }
}
