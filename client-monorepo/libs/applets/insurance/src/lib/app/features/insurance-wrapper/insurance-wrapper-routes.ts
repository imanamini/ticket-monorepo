import { Route } from '@angular/router';
import { JourneyTypeResolve } from '../house-incidents/journey-type.resolve';
import { retryImport } from '../../util/retry-import-handler';

export const INSURANCE_WRAPPER_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => retryImport(() => import('../home/home.component'), 3, 500).then((m) => m.HomeComponent),
  },
  {
    path: 'policy',
    loadChildren: () => retryImport(() => import('../policy/policy-routes'), 3, 500).then((m) => m.POLICY_ROUTES),
  },
  {
    path: 'claim',
    loadChildren: () => retryImport(() => import('../claim/claim-routes'), 3, 500).then((m) => m.CLAIM_ROUTES),
  },
  {
    path: 'profile',
    loadChildren: () => retryImport(() => import('../profile/profile-routes'), 3, 500).then((m) => m.PROFILE_ROUTES),
  },
  {
    path: 'faq',
    loadChildren: () => retryImport(() => import('../faq/faq-routes'), 3, 500).then((m) => m.FAQ_ROUTES),
  },
  {
    path: 'house-incidents',
    resolve: {
      journeyType: JourneyTypeResolve,
    },
    loadChildren: () =>
      retryImport(() => import('../house-incidents/house-incidents-routes'), 3, 500).then((m) => m.HOUSE_INCIDENTS_ROUTES),
  },
  {
    path: 'terms-and-condition',
    loadComponent: () =>
      retryImport(() => import('../terms-and-condition/terms-and-condition.component'), 3, 500).then((c) => c.TermsAndConditionComponent),
  },
];
