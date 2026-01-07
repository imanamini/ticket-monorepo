import { inject, Injectable } from '@angular/core';
import { EventManagementService } from '@client-monorepo/common/event-management';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class SocialService {
  eventManagementService = inject(EventManagementService);
  private router = inject(Router);

  sendClickEvent(target: string, additionalCrumbs: string[] = []): void {
    const breadCrumbs = [...this.getSocialRouteParams(), ...additionalCrumbs];
    this.eventManagementService.triggerEvent({
      eventType: 'click',
      breadCrumbs: breadCrumbs,
      data: {
        target: target,
      },
    });
  }

  getSocialRouteParams(): string[] {
    return this.router.url
      .split('/')
      .filter((segment) => !!segment)
      .map((segment) => {
        if (segment.includes('?')) return segment.split('?')[0];
        return segment;
      });
  }
}
