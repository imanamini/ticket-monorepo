export type EventType = 'location' | 'visit' | 'redirect' | 'click' | 'custom' | 'pageView';

export interface BaseAnalyticsEvent {
  eventType: EventType;
  data?: any;
  breadCrumbs?: string[];
  meta?: string;
}

export interface CompletedAnalyticsEvent extends BaseAnalyticsEvent {
  userId?: string;
  timestamp: number;
  source: string; // website, app , ...
  agent: string;
  from: string;
  utm_source?: string;
  utm_campaign?: string;
  utm_medium?: string;
  breadCrumbs?: string[];
  meta?: string;
  platform: string; // hybrid_android, web
  session_id: string;
}

export interface LocationEvent extends BaseAnalyticsEvent {
  eventType: 'location';
  data: {
    geoHash: string;
  };
}

export interface VisitEvent extends BaseAnalyticsEvent {
  eventType: 'visit';
}

export interface RedirectEvent extends BaseAnalyticsEvent {
  eventType: 'redirect';
  data: {
    to: string;
    host: string;
  };
}

export interface PageViewEvent extends BaseAnalyticsEvent {
  eventType: 'pageView';
  data: {
    url: string;
  };
}

export interface ClickEvent extends BaseAnalyticsEvent {
  eventType: 'click';
  data: {
    target: string;
  };
}

export interface CustomEvent extends BaseAnalyticsEvent {
  eventType: 'custom';
  data: {
    key: string;
    value: string;
  };
}

export type AnalyticsEvent = LocationEvent | VisitEvent | RedirectEvent | PageViewEvent | ClickEvent | CustomEvent;
