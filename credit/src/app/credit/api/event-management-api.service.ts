import { CreditHttpService } from './credit-http.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AnalyticsEvent, CompletedAnalyticsEvent } from './models/event/send-event.request';
import { StorageService } from '../core/services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class EventManagementApiService {
  constructor(
    private http: CreditHttpService,
    private storageService: StorageService,
  ) {
  }

  sendEvents(data: AnalyticsEvent): void {
    try {
      const body = [this.completeEventsData(data)];
      this.http.post('public/events/send-event', body).subscribe();
    } catch (error) {
      console.error(error);
    }
  }

  private completeEventsData(event: AnalyticsEvent): CompletedAnalyticsEvent {
    const fullEvent: CompletedAnalyticsEvent = {
      ...event,
      userId: 'ticket_' + this.storageService.get('ticket'),
      timestamp: Math.floor(Date.now() / 1000),
      source: 'web-credit',
      agent: window?.navigator?.userAgent || 'unknown',
      from: window.location.href,
      utm_source: '',
      utm_campaign: '',
      utm_medium: '',
      platform: 'web',
      session_id: this.storageService.get('ticket'),
    };
    if (!fullEvent.data) {
      fullEvent.data = {};
    }
    return fullEvent;
  }
}
