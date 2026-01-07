import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CREDIT_ENVIRONMENT, CreditEnvironmentInterface } from './credit-environment.interface';

/**
 * Guard to handle redirect logic for credit overview route.
 * If the credit environment is 'pillar', redirect user to '/home'.
 */
export const creditOverviewGuard: CanActivateFn = () => {
  const creditEnvironment = inject<CreditEnvironmentInterface>(CREDIT_ENVIRONMENT);
  const router = inject(Router);

  if (creditEnvironment?.creditEnv === 'pillar') {
    // Redirect to /home when running inside pillar app
    return router.navigateByUrl('/');
  }

  return true;
};
