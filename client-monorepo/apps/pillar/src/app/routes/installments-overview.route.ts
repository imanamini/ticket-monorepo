import { Route } from '@angular/router';
import { CreditPageComponent } from '../../../../../libs/applets/credit/src/lib/features/credit-wrapper/credit-page/credit-page.component';
import { CreditWrapperComponent } from '../../../../../libs/applets/credit/src/lib/features/credit/credit-wrapper/credit-wrapper.component';
import { CreditRouteStateService } from '../../../../../libs/applets/credit/src/lib/features/credit/data-access/services/route-state/credit-route-state.service';

export const installmentsOverviewRoute: Route = {
  path: 'service/credit/installments-overview',
  canActivate: [],
  component: CreditPageComponent,
  children: [
    {
      path: '',
      component: CreditWrapperComponent,
      children: [
        {
          path: '',
          loadComponent: () => import('@client-monorepo/applets/credit').then((c) => c.InstallmentsOverviewComponent),
          data: { animation: 'service', preload: true, critical: true },
        },
      ],
    },
  ],
  providers: [
    {
      provide: 'RouteStateInterface',
      useClass: CreditRouteStateService,
    },
  ],
};
