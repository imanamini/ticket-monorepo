import { BehaviorSubject } from 'rxjs';
import { importProvidersFrom } from '@angular/core';
import { AuthInterceptor } from './auth.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { environment } from '../../../../../../../apps/dpx/src/environments/environment';
import { HttpWealthRefreshTokenInterceptor } from './http-wealth-refresh-token.interceptor';
import { WEALTH_INTERCEPTOR_TOKEN_NOTIFIER } from '../../components/core/interceptors/interceptor-share.token';
import { ServerErrorInterceptor } from './server-error.interceptor';

export const httpWealthInterceptorProviders = [
  importProvidersFrom(WealthNavigationService),
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpWealthRefreshTokenInterceptor,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: ServerErrorInterceptor,
    multi: true,
  },
  {
    provide: WEALTH_INTERCEPTOR_TOKEN_NOTIFIER,
    useFactory: () => {
      return new BehaviorSubject<string>(null);
    },
  },
  {
    provide: 'APP_CONFIG',
    useValue: environment.wealth.navigation,
  },
  {
    provide: 'WEALTH_ENV',
    useValue: environment,
  },
  provideCharts(withDefaultRegisterables()),
];
