import { Route } from '@angular/router';
import { ThirdPartyRoutesEnum } from './features/third-party/data-access/enums/third-party-routes.enum';
import { BodyInsuranceRoutesEnum } from './features/body-insurance/data-access/enums/body-insurance-routes.enum';
import {
  THIRD_PARTY_MOTOR_ROUTES
} from './features/third-party-motor/data-access/constants/third-party-motor-routes.const';
import { GetConstantResolver } from './data-access/resolvers/get-constants.resolver';
import { retryImport } from '../../util/retry-import-handler';

export const VEHICLE_ROUTES: Route[] = [
  {
    path: '',
    redirectTo: '/',
    pathMatch: 'full'
  },
  {
    path: '',
    loadComponent: () => retryImport(() => import('./vehicle.component'), 3, 500).then(c => c.VehicleComponent),
    children: [
      {
        path: ThirdPartyRoutesEnum.ThirdParty,
        loadChildren: () => retryImport(() => import('./features/third-party/third-party-routes'), 3, 500).then(m => m.THIRD_PARTY_ROUTES),
        resolve: {
          constants: GetConstantResolver
        }
      },
      {
        path: BodyInsuranceRoutesEnum.BODY,
        loadChildren: () => retryImport(() => import('./features/body-insurance/body-insurance-routes'), 3, 500).then(m => m.BODY_ROUTES)
      },
      {
        path: THIRD_PARTY_MOTOR_ROUTES.ThirdPartyMotor,
        loadChildren: () => retryImport(() => import('./features/third-party-motor/third-party-motor-routes'), 3, 500).then(m => m.THIRD_PARTY_MOTOR),
        resolve: {
          constants: GetConstantResolver
        }
      },
      {
        path: ThirdPartyRoutesEnum.Error,
        loadComponent: () => retryImport(() => import('./features/error/retry-error/retry-error.component'), 3, 500).then(c => c.RetryErrorComponent),
      }
    ]
  }
];
