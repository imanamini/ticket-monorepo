import { Route } from '@angular/router';

import { ThirdPartyRoutesEnum } from '../../../../data-access/enums/third-party-routes.enum';
import {
  ThirdPartyPageTitlesEnum
} from '../../../../../../../../data-access/enums/third-party-page-titles.enum';
import { retryImport } from '../../../../../../../../util/retry-import-handler';

export const EX_INSURER_ROUTES: Route[] = [
  {
    path: ThirdPartyRoutesEnum.Date,
    data: { title: ThirdPartyPageTitlesEnum.CarInfoExInsurerDate },
    loadComponent: () => retryImport(() => import('./routes/ex-insurer-date/ex-insurer-date.component'), 3, 500)
      .then(c => c.ExInsurerDateComponent)
  },
  {
    path: '',
    data: { title: ThirdPartyPageTitlesEnum.CarInfoExInsurer },
    loadComponent: () => retryImport(() => import('./ex-insurer.component'), 3, 500).then(c => c.ExInsurerComponent),
  }
];
