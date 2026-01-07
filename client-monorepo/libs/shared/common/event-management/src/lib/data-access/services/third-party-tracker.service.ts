import { Injectable } from '@angular/core';
declare const dataLayer: any;

@Injectable({
  providedIn: 'root',
})
export class ThirdPartyTrackerService {
  trackedIds: string[] = [];

  sendEvent(eventName: string, data: any) {
    try {
      dataLayer.push({ event: eventName, ...data });
    } catch (error) {
      console.warn(error);
    }
  }

  observeViewElementAndSendEvent(element: Element, eventName: string, data: any, uniqueId = '', threshold = 0.5): void {
    if (this.trackedIds.includes(uniqueId)) {
      return;
    }
    const bannerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            this.sendEvent(eventName, data);
            if (uniqueId) {
              this.trackedIds.push(uniqueId);
            }
            bannerObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold,
      },
    );
    bannerObserver.observe(element);
  }
}
