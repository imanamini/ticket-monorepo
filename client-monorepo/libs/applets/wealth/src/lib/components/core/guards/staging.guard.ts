import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { HOME_ROUTE } from '../../../data-access/constants/app-routes';
import { environment } from '../../../data-access/environments/environment';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';

export const StagingGuard: CanActivateFn = (route, state) => {
  const navigationService = inject(WealthNavigationService);

  if (environment.env === 'staging') {
    return true;
  }

  navigationService.navigate([HOME_ROUTE]);
  return false;
};
