import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { StorageService } from '@client-monorepo/common/utilities';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const storageService = inject(StorageService);
  if (storageService.isLoggedIn()) {
    router.navigate(['/']).then();
    return false;
  }
  return true;
};
