import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { StorageService } from '@client-monorepo/common/utilities';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  router = inject(Router);
  storageService = inject(StorageService);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.storageService.isLoggedIn()) {
      // user has requested a protected route, remember this request to redirect to it after a successful login
      let stateUrl = state.url;
      if (stateUrl.indexOf('?')) {
        stateUrl = stateUrl.split('?')[0];
      }
      if (stateUrl !== '/') {
        this.storageService.storeBeforeLoginRoute({ url: stateUrl, queryParams: route.queryParams });
      }

      this.router.navigate(['auth'], { queryParams: route.queryParams }).then();
      return false;
    }
    return true;
  }
}
