import { inject, Injectable, isDevMode } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DisasterLevelService } from '@client-monorepo/common/utilities';

@Injectable()
export class DisasterLevelInterceptor implements HttpInterceptor {
  private disasterLevelService = inject(DisasterLevelService);

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap((event: any) => {
        if (event instanceof HttpResponse) {
          if (!isDevMode()) {
            console.info('Response now returned to interceptor');
            this.checkDisasterLevelHeader(event);
          }
        }
      }),
    );
  }

  private checkDisasterLevelHeader(response: HttpResponse<any>): void {
    const disasterLevelHeader = response.headers.get('disaster-level');
    if (disasterLevelHeader !== null) {
      const disasterLevel = Number(disasterLevelHeader);
      if (disasterLevel !== this.disasterLevelService.getCurrentDisasterLevel()) {
        console.info('Disaster level changed with url:', response.url);
        this.disasterLevelService.updateDisasterLevel(disasterLevel);
      }
    } else {
      console.info('No disaster-level header found in response');
    }
  }
}
