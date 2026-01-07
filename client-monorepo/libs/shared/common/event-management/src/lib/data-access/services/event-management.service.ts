import { inject, Injectable } from '@angular/core';
import { EventManagementApiService } from './event-management-api.service';
import { StorageService } from '@client-monorepo/common/utilities';
import { NgxHybridServiceService } from '@digipay/ngx-hybrid-service';
import { AnalyticsEvent, CompletedAnalyticsEvent } from '../models/send-event.request';
import * as geohash from 'ngeohash';

interface AppEnvironment {
  env: string;
}

@Injectable({
  providedIn: 'root',
})
export class EventManagementService {
  private eventManagementApiService = inject(EventManagementApiService);
  private events: CompletedAnalyticsEvent[] = [];
  private storageService = inject(StorageService);
  private hybridService = inject(NgxHybridServiceService);
  private platformMap: { [key: number]: string } = {
    0: 'web',
    1: 'Android',
    2: 'iOS',
  };

  private isEnabled(): boolean {
    return process.env['name'] === 'production';
  }

  constructor() {
    setInterval(() => {
      this.sendEvents();
    }, 30 * 1000);
  }

  public triggerEvent(event: AnalyticsEvent, immediately = false): void {
    if (!this.isEnabled()) {
      return;
    }
    this.events.push(this.completeEventsData(event));
    if (immediately) {
      this.sendEvents();
    }
  }

  private getNowDate(): string {
    const now = new Date();
    return now.toISOString();
  }

  public sendEvents(): void {
    if (!this.isEnabled() || this.events.length <= 0) {
      return;
    }
    const events = [...this.events];
    this.events = [];
    this.eventManagementApiService.sendEvents(events).subscribe({});
  }

  private getPlatform(): string {
    return this.platformMap[this.hybridService.detectPlatform() as number] || 'web';
  }

  private completeEventsData(event: AnalyticsEvent): CompletedAnalyticsEvent {
    const utmData = this.storageService.getInputUtmData();
    const fullEvent: CompletedAnalyticsEvent = {
      ...event,
      userId: this.storageService.getUserId() || 'guest_' + this.storageService.getSessionId(),
      timestamp: Math.floor(Date.now() / 1000),
      source: 'app',
      agent: window?.navigator?.userAgent || 'unknown',
      from: window.location.href,
      utm_source: utmData?.source || '',
      utm_campaign: utmData?.campaign || '',
      utm_medium: utmData?.medium || '',
      platform: this.getPlatform(),
      session_id: this.storageService.getSessionId(),
    };
    if (!fullEvent.data) {
      fullEvent.data = {};
    }
    return fullEvent;
  }

  sendLocation(latitude: number, longitude: number, immediately = false) {
    if (!this.isEnabled()) {
      return;
    }
    const geoHash = geohash.encode(latitude, longitude, 5);
    this.triggerEvent(
      {
        eventType: 'location',
        data: {
          geoHash,
        },
      },
      immediately,
    );
  }
}
