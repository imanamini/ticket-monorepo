import { Route } from '@angular/router';
import { routes } from './features/credit-wrapper/credit-wrapper-routing.module';
import { CreditRouteStateService } from './features/credit/data-access/services/route-state/credit-route-state.service';
export const creditRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'resolve',
    pathMatch: 'full',
  },
  {
    path: '',
    children: routes,
    providers: [
      {
        provide: 'RouteStateInterface',
        useClass: CreditRouteStateService,
      },
    ],
  },
];
