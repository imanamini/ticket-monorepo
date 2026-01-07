import { Route } from '@angular/router';

import { ThirdPartyRoutesEnum } from '../../data-access/enums/third-party-routes.enum';
import { ThirdPartyPageTitlesEnum } from '../../../../../../data-access/enums/third-party-page-titles.enum';
import { retryImport } from '../../../../../../util/retry-import-handler';

export const CAR_INFO_ROUTES: Route[] = [
  {
    path: ThirdPartyRoutesEnum.ExInsurer,
    loadChildren: () => retryImport(() => import('./features/ex-insurer/ex-insurer-routes'), 3, 500)
      .then(c => c.EX_INSURER_ROUTES),
  },
  {
    path: ThirdPartyRoutesEnum.ExInsurerInfo,
    data: {title: ThirdPartyPageTitlesEnum.CarInfoExInsurerInfo},
    loadComponent: () => retryImport(() => import('./features/ex-insurer-info/ex-insurer-info.component'), 3, 500)
      .then(c => c.ExInsurerInfoComponent),
  },
  {
    path: '',
    data: {title: ThirdPartyPageTitlesEnum.CarInfo},
    loadComponent: () => retryImport(() => import('./car-info.component'), 3, 500)
      .then(c => c.CarInfoComponent),
  },
];
