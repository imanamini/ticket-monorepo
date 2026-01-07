import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { DigiCardIssuanceService } from '../services/digi-card-issuance.service';

export const IssuanceFlowGuard: CanActivateFn = (route, state): boolean | UrlTree => {
  const digiCardIssuanceService = inject(DigiCardIssuanceService);
  const router = inject(Router);
  const detail = digiCardIssuanceService.issuanceDetail();

  if (detail) {
    return true;
  }
  return router.createUrlTree(['/card/issuance']);
};
