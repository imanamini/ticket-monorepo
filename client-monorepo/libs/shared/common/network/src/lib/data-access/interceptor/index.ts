import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { HttpRefreshInterceptor } from './http.interceptor';
import { ApiCacheInterceptor } from './api-cache.interceptor';
import { PinInterceptor } from '@client-monorepo/common/pin';
import { TimeoutInterceptor } from './http-timeout.interceptor';
import { MarketInterceptor } from './market.interceptor';
import { HttpGeneralErrorInterceptor } from './http-general-error.interceptor';
import { ShahkarInterceptor } from './shahkar.interceptor';

export const httpInterceptorProviders = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: MarketInterceptor,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpRefreshInterceptor,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: PinInterceptor,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: ShahkarInterceptor,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: TimeoutInterceptor,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: ApiCacheInterceptor,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpGeneralErrorInterceptor,
    multi: true,
  },
];
