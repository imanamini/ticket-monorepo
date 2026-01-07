import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AbTestService } from '@client-monorepo/common/utilities';

export const directDebitGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const allowed = AbTestService.showDirectDebit();

  if (allowed) {
    return true;
  }

  return router.parseUrl('/wallet-management');
};
