import { CanActivateFn, Router } from '@angular/router';
import { TokenModel } from '../../../data-access/models/base/token.model';
import { AUTH_TOKEN_KEY, WEALTH_TOKEN } from '../../utils/variables';
import { IDGPTokenModel } from '../../../data-access/models/base/dgp-token.model';
import { checkWealthOrigin } from '../../utils/check-wealth-origin';
import { LOGIN_ROUTE } from '../../../data-access/constants/app-routes';
import { inject } from '@angular/core';

export const AuthenticationGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const wealthToken: TokenModel = JSON.parse(
    localStorage.getItem(WEALTH_TOKEN),
  );
  const dgpToken: IDGPTokenModel = JSON.parse(
    localStorage.getItem(AUTH_TOKEN_KEY),
  );

  if (
    (checkWealthOrigin() === 'wealth' &&
      wealthToken?.accessToken &&
      wealthToken?.permission === 'EndUser') ||
    (checkWealthOrigin() === 'dgp' && dgpToken?.auth?.access) ||
    (checkWealthOrigin() === 'localhost' &&
      ((wealthToken?.accessToken && wealthToken?.permission === 'EndUser') ||
        dgpToken?.auth?.access))
  ) {
    return true;
  }
  if (checkWealthOrigin() === 'wealth' || checkWealthOrigin() === 'localhost') {
    router.navigate([LOGIN_ROUTE]);
  } else {
    sessionStorage.setItem('redirectUrlAfterLogin', window.location.href);
    window.open(window.location.origin, '_self');
  }
  return false;
};
