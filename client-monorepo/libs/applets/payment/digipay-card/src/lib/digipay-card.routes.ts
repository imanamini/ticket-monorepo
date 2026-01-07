import { Route } from '@angular/router';
import { PageLoadingService } from './components/page-loading/page-loading.service';
import { DigiCardIssuanceService } from './data-access/services/digi-card-issuance.service';
import { IssuanceFlowGuard } from './data-access/guards/issuance-flow.guard';
import { CardOnboardingGuard } from './data-access/guards/card-onboarding.guard';
import { comingSoonGuard } from './data-access/guards/coming-soon.guard';

export const DigiPayCardRoutes: Route[] = [
  {
    path: 'issuance',
    providers: [PageLoadingService, DigiCardIssuanceService],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/issuance/card-issuance.component').then((c) => c.CardIssuanceComponent),
        pathMatch: 'full',
      },
      {
        path: 'callback/:source',
        loadComponent: () => import('./features/issuance/card-issuance.component').then((c) => c.CardIssuanceComponent),
        pathMatch: 'full',
      },
      {
        path: 'validation',
        canActivate: [IssuanceFlowGuard, CardOnboardingGuard],
        loadComponent: () =>
          import('./features/national-code-validator/national-code-validator.component').then((c) => c.NationalCodeValidatorComponent),
      },
      {
        path: 'subscription-required',
        canActivate: [IssuanceFlowGuard],
        loadComponent: () =>
          import('./features/issuance/subscription/subscription-required/subscription-required.component').then(
            (c) => c.SubscriptionRequiredComponent,
          ),
      },
      {
        path: 'subscription-active',
        canActivate: [IssuanceFlowGuard],
        loadComponent: () =>
          import('./features/issuance/subscription/subscription-active/subscription-active.component').then(
            (c) => c.SubscriptionActiveComponent,
          ),
      },
      {
        path: 'subscription-change',
        canActivate: [IssuanceFlowGuard],
        loadComponent: () =>
          import('./features/issuance/subscription/subscription-change/subscription-change.component').then(
            (c) => c.SubscriptionChangeComponent,
          ),
      },
      {
        path: 'personal-info',
        canActivate: [IssuanceFlowGuard],
        loadComponent: () => import('./features/issuance/personal-info/personal-info.component').then((c) => c.PersonalInfoComponent),
      },
      {
        path: 'personal-info-review',
        canActivate: [IssuanceFlowGuard],
        loadComponent: () =>
          import('./features/issuance/personal-info-review/personal-info-review.component').then((c) => c.PersonalInfoReviewComponent),
      },
      {
        path: 'result',
        canActivate: [IssuanceFlowGuard],
        loadComponent: () => import('./features/issuance/issuance-result/issuance-result.component').then((c) => c.IssuanceResultComponent),
      },
    ],
  },
  {
    path: 'onboarding',
    loadComponent: () => import('./components/card-onboarding/card-onboarding.component').then((c) => c.CardOnboardingComponent),
  },
  {
    path: 'activation/:id',
    loadComponent: () => import('./features/activation/card-activation/card-activation.component').then((c) => c.CardActivationComponent),
  },

  {
    path: 'password/:mode/:type/:id',
    canActivate: [comingSoonGuard],
    loadComponent: () => import('./features/password/password-shell/password-shell.component').then((c) => c.PasswordShellComponent),
  },

  {
    path: 'blocking/:id',
    canActivate: [comingSoonGuard],
    loadComponent: () => import('./features/blocking/card-blocking.component').then((c) => c.CardBlockingComponent),
  },
  {
    path: 'unblocking/:id',
    canActivate: [comingSoonGuard],
    loadComponent: () => import('./features/unblocking/card-unblocking.component').then((c) => c.CardUnblockingComponent),
  },
  {
    path: 'instructions',
    loadComponent: () => import('./features/card-instructions/card-instructions.component').then((c) => c.CardInstructionsComponent),
  },
  {
    path: 'attachment/:id',
    canActivate: [comingSoonGuard],
    loadComponent: () => import('./features/attachment/card-attachment.component').then((c) => c.CardAttachmentComponent),
  },
  {
    path: 'password-settings/:id',
    canActivate: [comingSoonGuard],
    loadComponent: () => import('./features/password/password-setting/password-setting.component').then((c) => c.PasswordSettingComponent),
  },
  {
    path: 'coming-soon',
    loadComponent: () => import('./features/coming-soon/coming-soon.component').then((c) => c.ComingSoonComponent),
  },
];
