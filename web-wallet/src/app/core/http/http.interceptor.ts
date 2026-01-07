import {
  HttpErrorResponse,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpSentEvent,
  HttpHeaderResponse,
  HttpProgressEvent,
  HttpResponse,
  HttpUserEvent,
} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, throwError, timeout} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {StorageService} from '../services/storage.service';
import {MessageService} from '../services/message.service';
import {ErrorMessagePipe} from './error-message.pipe';
import { NgxApiConfigService } from '@digipay/ngx-api-config';


@Injectable()
export class WalletHttpInterceptor implements HttpInterceptor {

  constructor(
    private storageService: StorageService,
    private messageService: MessageService,
    private errorMessagePipe: ErrorMessagePipe,
    private apiConfigService: NgxApiConfigService,
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any> | any> {
    return next.handle(this.addTokenToRequest(req)).pipe(
      timeout(4000), // Set the timeout value in milliseconds (e.g., 80000 for 80 seconds)
      catchError(error => {
        if (error instanceof HttpErrorResponse) {
          const message = this.errorMessagePipe.transform(error.status, error);
          this.messageService.showErrorMessage(message);
          switch ((<HttpErrorResponse>error).status) {
            default:
              return throwError(error)
          }
        } else {
          return throwError(error)
        }

      }),
    );
  }

  private addTokenToRequest(request: HttpRequest<any>): HttpRequest<any> {
    const headerKeys = request.headers.keys();

    let headers = request.headers;
    if (headerKeys.indexOf('Authorization') < 0 && headerKeys.indexOf('ticket') < 0) {
      const ticket = this.storageService.get('ticket');
      if (ticket) {
        headers = headers.set('ticket', ticket);
      }
    }

    headers = headers.set('Digipay-Version', this.apiConfigService.getApiConstants().digipayVersion);
    headers = headers.set('Agent', this.apiConfigService.getApiConstants().agent);
    return request.clone({
      headers
    });
  }
}
