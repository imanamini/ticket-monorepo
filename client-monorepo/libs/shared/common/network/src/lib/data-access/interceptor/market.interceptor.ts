import { inject, Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { from, Observable, of } from 'rxjs';
import { NgxHybridService } from '@digipay/ngx-hybrid-service';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { MarketCacheService } from '@client-monorepo/common/network';

@Injectable()
export class MarketInterceptor implements HttpInterceptor {
  private ngxHybridService = inject(NgxHybridService);
  private marketCacheService = inject(MarketCacheService);

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.ngxHybridService.isHybrid()) {
      return next.handle(request);
    }

    // Check if we have a cached market name
    const cachedMarketName = this.marketCacheService.getMarketName();
    if (cachedMarketName) {
      return this.handleRequestWithMarket(request, next, cachedMarketName);
    }

    // Fetch from native bridge and cache it
    return from(this.ngxHybridService.getMarketName()).pipe(
      catchError((error) => {
        // Handle "Java object is gone" and other native bridge errors
        console.warn('[MarketInterceptor] Failed to get market name from native bridge:', error?.message || error);

        // Return empty string as fallback - server should handle missing market header gracefully
        return of('');
      }),
      tap((marketName: string) => {
        // Cache the market name for future requests
        if (marketName) {
          this.marketCacheService.setMarketName(marketName);
        }
      }),
      switchMap((marketName: string) => {
        return this.handleRequestWithMarket(request, next, marketName);
      }),
    );
  }

  private handleRequestWithMarket(request: HttpRequest<any>, next: HttpHandler, marketName: string): Observable<HttpEvent<any>> {
    // Only add market header if we have a valid market name
    if (marketName) {
      const requestHeader = request.clone({
        setHeaders: {
          market: marketName,
        },
      });
      return next.handle(requestHeader);
    }

    // If no market name available, proceed without the header
    return next.handle(request);
  }
}
