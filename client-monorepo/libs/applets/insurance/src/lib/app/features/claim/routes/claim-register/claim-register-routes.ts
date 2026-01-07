import { Route } from '@angular/router';
import { retryImport } from '../../../../util/retry-import-handler';

export const CLAIM_REGISTER_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => retryImport(() => import('./claim-register.component'), 3, 500).then(c => c.ClaimRegisterComponent),
    children: [
      {
        path: 'type',
        loadComponent: () => retryImport(() => import('./routes/claim-register-type/claim-register-type.component'), 3, 500).then(c => c.ClaimRegisterTypeComponent)
      },
      {
        path: 'policy',
        loadComponent: () => retryImport(() => import('./routes/claim-register-policy/claim-register-policy.component'), 3, 500).then(c => c.ClaimRegisterPolicyComponent)
      },
      {
        path: 'step-one',
        loadComponent: () => retryImport(() => import('./routes/register-damage-step-one/register-damage-step-one.component'), 3, 500).then(c => c.RegisterDamageStepOneComponent)
      },
      {
        path: 'step-two',
        loadComponent: () => retryImport(() => import('./routes/register-damage-step-two/register-damage-step-two.component'), 3, 500).then(c => c.RegisterDamageStepTwoComponent)
      },
      {
        path: 'step-three',
        loadComponent: () => retryImport(() => import('./routes/register-damage-step-three/register-damage-step-three.component'), 3, 500).then(c => c.RegisterDamageStepThreeComponent)
      },
      {
        path: 'step-four',
        loadComponent: () => retryImport(() => import('./routes/register-damage-step-four/register-damage-step-four.component'), 3, 500).then(c => c.RegisterDamageStepFourComponent)
      },
      {
        path: 'call-to-support-home',
        loadComponent: () => retryImport(() => import('./routes/call-to-support-home/call-to-support-home.component'), 3, 500).then(c => c.CallToSupportHomeComponent)
      },
    ]
  },
];

