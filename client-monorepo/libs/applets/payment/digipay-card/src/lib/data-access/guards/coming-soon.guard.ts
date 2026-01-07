import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ComingSoonFeature } from '../models/digi-card-shared.model';

function resolveFeatureFromRoutePath(path?: string | null, mode?: 'change' | 'forgot'): ComingSoonFeature {
  if (!path) return 'unknown';
  const firstSegment = path.split('/')[0];

  switch (firstSegment) {
    case 'password-settings':
      return 'password-settings';
    case 'blocking':
      return 'blocking';
    case 'unblocking':
      return 'unblocking';
    case 'activation':
      return 'activation';
    case 'attachment':
      return 'attachment';
    default:
      return mode ?? 'unknown';
  }
}

export const comingSoonGuard: CanActivateFn = (route) => {
  const router = inject(Router);

  const isFeatureEnabled = false;

  if (isFeatureEnabled) {
    return true;
  }
  const feature = resolveFeatureFromRoutePath(route.routeConfig?.path, route.params['mode']);
  router.navigate(['/card/coming-soon'], { queryParams: { feature } });
  return false;
};