import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoNavigationComponent } from '../no-navigation/no-navigation.component';
import { WithNavigationComponent } from '../with-navigation/with-navigation.component';
import { AuthGuard } from '@client-monorepo/common/network';

const routes: Routes = [
  {
    path: 'auth',
    component: NoNavigationComponent,
    loadChildren: () => import('@client-monorepo/applets/escrow/escrow-auth').then((lib) => lib.escrowAuthRoutes),
  },
  {
    path: 'purchase-flow',
    component: NoNavigationComponent,
    loadChildren: () => import('@client-monorepo/applets/escrow/escrow-purchase-flow').then((lib) => lib.escrowPurchaseFlowRoutes),
  },
  {
    path: 'home',
    component: WithNavigationComponent,
    loadChildren: () => import('@client-monorepo/applets/escrow/escrow-home').then((lib) => lib.escrowHomeRoutes),
  },
  {
    path: 'delivery',
    component: NoNavigationComponent,
    loadChildren: () => import('@client-monorepo/applets/escrow/escrow-delivery').then((lib) => lib.escrowDeliveryRoutes),
  },
  {
    path: 'orders',
    component: WithNavigationComponent,
    loadChildren: () => import('@client-monorepo/applets/escrow/escrow-orders').then((lib) => lib.escrowOrdersRoutes),
  },
  {
    path: 'profile',
    component: WithNavigationComponent,
    loadChildren: () => import('@client-monorepo/applets/escrow/escrow-profile').then((lib) => lib.escrowProfileRoutes),
  },
  {
    path: 'conflict',
    component: NoNavigationComponent,
    loadChildren: () => import('@client-monorepo/applets/escrow/escrow-conflict').then((lib) => lib.escrowConflictRoutes),
  },
  {
    path: 'error',
    component: NoNavigationComponent,
    loadChildren: () => import('@client-monorepo/applets/escrow/escrow-error').then((lib) => lib.escrowErrorRoutes),
  },
  {
    path: 'plugin-activation',
    component: NoNavigationComponent,
    loadChildren: () => import('@client-monorepo/applets/escrow/escrow-plugin').then((lib) => lib.escrowPluginRoutes),
  },
  {
    path: 'payment-link',
    component: NoNavigationComponent,
    loadChildren: () => import('@client-monorepo/applets/escrow/escrow-payment-link').then((lib) => lib.escrowPaymentLinkRoutes),
  },
  {
    path: 'payment',
    canActivate: [AuthGuard],
    loadChildren: () => import('@client-monorepo/applets/payment').then((lib) => lib.paymentRoutes),
    data: { animation: 'service' },
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'auth',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
