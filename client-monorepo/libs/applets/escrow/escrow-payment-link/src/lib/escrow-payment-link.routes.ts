import { Route } from '@angular/router';
import { PaymentLinkCreateComponent } from './features/payment-link-create/payment-link-create.component';
import { PaymentLinkResultComponent } from './features/payment-link-result/payment-link-result.component';
import { PaymentLinkDetailComponent } from './features/payment-link-detail/payment-link-detail.component';
import { PaymentLinkErrorComponent } from './features/payment-link-error/payment-link-error.component';
import { AdvertiseDetailsComponent } from './features/advertise-details/advertise-details.component';
import { AuthGuard } from '@client-monorepo/common/network';
import { StartFlowGuardService } from './data-access/guards/start-flow-guard.service';

export const escrowPaymentLinkRoutes: Route[] = [
  {
    path: 'create',
    component: PaymentLinkCreateComponent,
    canActivate: [StartFlowGuardService, AuthGuard],
  },
  {
    path: 'result/:status',
    component: PaymentLinkResultComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'user/detail',
    component: PaymentLinkDetailComponent,
    canActivate: [StartFlowGuardService, AuthGuard],
  },
  {
    path: 'advertise',
    component: AdvertiseDetailsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'error',
    component: PaymentLinkErrorComponent,
  },
];
