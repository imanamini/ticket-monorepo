import { Routes } from '@angular/router';
import { ThirdPartyRoutesEnum } from '../../data-access/enums/third-party-routes.enum';
import { ThirdPartyPageTitlesEnum } from '../../../../../../data-access/enums/third-party-page-titles.enum';
import { retryImport } from '../../../../../../util/retry-import-handler';

export const INSURERS_ROUTES: Routes = [
  {
    path: '',
    data: { title: ThirdPartyPageTitlesEnum.PLP },
    loadComponent: () => retryImport(() => import('./price-card-list.component'), 3, 500).then((c) => c.PriceCardListComponent),
  },
  {
    path: ThirdPartyRoutesEnum.PLPCardSelect,
    data: { title: ThirdPartyPageTitlesEnum.PLPCardSelect },
    loadComponent: () =>
      retryImport(() => import('./features/plp-card-select/plp-card-select.component'), 3, 500).then((c) => c.PlpCardSelectComponent),
  },
];
