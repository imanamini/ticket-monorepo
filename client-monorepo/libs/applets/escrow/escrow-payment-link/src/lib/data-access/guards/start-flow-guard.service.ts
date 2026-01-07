import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { StorageService } from '@client-monorepo/common/utilities';

@Injectable({
  providedIn: 'root',
})
export class StartFlowGuardService {
  router = inject(Router);
  storageService = inject(StorageService);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (route.queryParams['requestId'] && localStorage.getItem('active-request-id') === route.queryParams['requestId']) {
      return true;
    }
    if (route.queryParams['linkId'] && localStorage.getItem('active-link-id') === route.queryParams['linkId']) {
      return true;
    }
    if (!route.queryParams['requestId'] && !route.queryParams['linkId']) {
      return true;
    }
    localStorage.removeItem('__dp_storage');
    if (route.queryParams['requestId']) {
      localStorage.setItem('active-request-id', route.queryParams['requestId']);
    }
    if (route.queryParams['linkId']) {
      localStorage.setItem('active-link-id', route.queryParams['linkId']);
    }
    return true;
  }
}
