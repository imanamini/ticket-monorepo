import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { finalize, from, Observable, of, shareReplay, tap } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CacheService } from '../services/cache.service';

@Injectable()
export class ApiCacheInterceptor implements HttpInterceptor {
  constructor(private cacheService: CacheService) {}
  private inFlightRequests = new Map<string, Observable<HttpEvent<any>>>();

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const cacheEnabledHeader = req.headers.get('enable-cache');
    if (!cacheEnabledHeader) {
      return next.handle(req);
    }

    const cacheTtl = req.headers.get('cache-ttl');
    req = req.clone({
      headers: req.headers.delete('cache-ttl').delete('enable-cache'),
    });

    const index = this.cacheService.makeRequestUrlIndex(req);

    return from(this.cacheService.getFromCache(index)).pipe(
      switchMap((cachedData) => {
        if (cachedData) {
          // Serve from cache
          return of(new HttpResponse({ body: cachedData }));
        }

        // If request already in-flight → reuse it
        if (this.inFlightRequests.has(index)) {
          return this.inFlightRequests.get(index)!;
        }

        // Otherwise send request & cache result
        const request$ = next.handle(req).pipe(
          tap((res) => {
            if (res instanceof HttpResponse) {
              this.cacheService.addToCache(index, res.body, Number(cacheTtl));
            }
          }),
          shareReplay(1),
          finalize(() => {
            this.inFlightRequests.delete(index);
          }),
        );

        this.inFlightRequests.set(index, request$);

        return request$;
      }),
    );
  }
}
