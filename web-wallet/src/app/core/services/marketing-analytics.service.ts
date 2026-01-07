import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MarketingAnalyticsService {
  private analyticsApp: any;

  setApp() {
    if (window.hasOwnProperty('ga') && typeof (window as any).ga === 'function') {
      this.analyticsApp = (window as any).ga;
    }
  }

  triggerEvent(category: string, action: string, label?: string, value?: string) {
    this.setApp();
    if (!this.analyticsApp || !environment.google_analytics_tracking_id) {
      return;
    }
    try {
      if (typeof this.analyticsApp.create === 'function') {
        const tracker = this.analyticsApp.create(environment.google_analytics_tracking_id);
        tracker.send('event', category, action, label, value);
      }
    } catch (e) {
      // console.warn('warning: marketing service');
    }
  }
}
