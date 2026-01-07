import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { checkWealthOrigin } from '../../utils/check-wealth-origin';
import { HOME_ROUTE } from '../../../data-access/constants/app-routes';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';

export const LandingPageGuard: CanActivateFn = (route, state) => {
  const navigationService = inject(WealthNavigationService);

  if (checkWealthOrigin() === 'wealth' || checkWealthOrigin() === 'localhost') {
    return true;
  }
  navigationService.navigate([HOME_ROUTE]);
  return false;
};
