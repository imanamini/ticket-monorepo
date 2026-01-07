import { Route } from '@angular/router';
import { IplLayoutComponent } from './ipl-layout/ipl-layout.component';
import { IplStepsComponent } from './ipl-steps/ipl-steps.component';
import { IplDetailComponent } from './ipl-steps/ipl-detail/ipl-detail.component';
import { IplErrorService } from './ipl-errors/services/ipl-error.service';
import { IplService } from './services/ipl.service';
import { IplDetailService } from './services/ipl-detail/ipl-detail.service';
import { IplPayService } from './services/ipl-pay/ipl-pay.service';

export const IplRoutes: Route[] = [
  {
    path: ':uuid',
    component: IplLayoutComponent,
    children: [
      {
        path: '',
        component: IplStepsComponent,
        children: [
          {
            path: '',
            component: IplDetailComponent,
          },
        ],
      },
      {
        path: 'error',
        loadComponent: () => import('./ipl-errors/ipl-errors.component').then((m) => m.IplErrorsComponent),
      },
    ],
    providers: [IplErrorService, IplService, IplDetailService, IplPayService],
  },
];
