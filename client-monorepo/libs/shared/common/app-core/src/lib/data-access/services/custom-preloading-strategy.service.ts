import { inject, Injectable } from '@angular/core';
import { PreloadingStrategy, Route, Router } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CustomPreloadingStrategy implements PreloadingStrategy {
  router = inject(Router);
  unloadedPath: string[] = [];
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    if (!route.data || (route.data && !route.data['preload'])) {
      return of(null);
    }
    if (this.isInCredit()) {
      if (!route.data['critical']) {
        return of(null);
      }
    }
    return load();
  }

  isInCredit(): boolean {
    return this.router.url.includes('service/credit') || this.router.url.includes('service/bnpl');
  }
}
