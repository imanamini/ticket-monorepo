import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from '@client-monorepo/common/utilities';

export const CardOnboardingGuard: CanActivateFn = (route, state) => {
  const storageService = inject(StorageService);
  const router = inject(Router);

  if (storageService.isDigipayCardOnboardingChecked()) {
    return true;
  }

  return router.createUrlTree(['/card/onboarding']);
};
