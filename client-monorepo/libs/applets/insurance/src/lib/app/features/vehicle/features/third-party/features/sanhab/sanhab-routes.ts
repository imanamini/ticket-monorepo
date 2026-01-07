import { Route } from '@angular/router';
import { ThirdPartyRoutesEnum } from '../../data-access/enums/third-party-routes.enum';
import { ThirdPartyPageTitlesEnum } from '../../../../../../data-access/enums/third-party-page-titles.enum';
import { retryImport } from '../../../../../../util/retry-import-handler';

export const SANHAB_ROUTES: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    data: {title: ThirdPartyPageTitlesEnum.Sanhab},
    loadComponent: () => retryImport(() => import('./sanhab.component'), 3, 500).then(c => c.SanhabComponent),
  },
  {
    path: ThirdPartyRoutesEnum.CarInfo,
    data: {title: ThirdPartyPageTitlesEnum.SanhabCarInfo},
    loadComponent: () => retryImport(() => import('./features/sanhab-car-info/sanhab-car-info.component'), 3, 500)
      .then(c => c.SanhabCarInfoComponent)
  }
];
