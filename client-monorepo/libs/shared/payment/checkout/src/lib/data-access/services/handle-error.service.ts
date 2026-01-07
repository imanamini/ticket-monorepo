import { inject, Injectable } from '@angular/core';
import { fromEvent, merge, Observable, Observer } from 'rxjs';
import { map } from 'rxjs/operators';
import { UrlService } from './url.service';
import { TicketInfoService } from './ticket-info.service';
import { ErrorStatus } from '../models/error-status.enum';
import { CloseSessionService } from './close-session.service';
import { ApiResultInterface } from '@client-monorepo/common/network';
import { MessageService } from '@client-monorepo/common/utilities';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';

@Injectable({
  providedIn: 'root',
})
export class HandleErrorService {
  private urlService = inject(UrlService);
  private ticketInfoService = inject(TicketInfoService);
  private bottomSheetService = inject(NgxBottomSheetService);
  private closeSessionService = inject(CloseSessionService);
  private messageService = inject(MessageService);
  public listenToNetworkStatusChanges(): void {
    this.onConnectionStatusChange().subscribe((isOnline) => {
      if (!isOnline) {
        this.urlService.navigateToInternalUrl('/offline', this.ticketInfoService.ticket);
      }
    });
  }

  public onConnectionStatusChange() {
    // @ts-expect-error merge
    return merge<boolean>(
      fromEvent(window, 'offline').pipe(map(() => false)),
      fromEvent(window, 'online').pipe(map(() => true)),
      new Observable((sub: Observer<boolean>) => {
        sub.next(navigator.onLine);
        sub.complete();
      }),
    );
  }

  public check(error: ApiResultInterface): void {
    this.bottomSheetService.closeBottomSheet();

    switch (error.status) {
      case ErrorStatus.UNAUTHORIZED:
        this.ticketExpired(error);
        break;

      case ErrorStatus.NOT_FOUND:
        this.invalidTicket(error);
        break;

      case ErrorStatus.SERVICE_ERROR:
      case ErrorStatus.INTERNAL_SERVICE_ERROR:
      case ErrorStatus.INTERNET_CONNECTION:
        this.connectionError();
        break;

      default:
        break;
    }
    this.messageService.showErrorMessage(error?.message);
    throw new Error(error.message);
  }

  private ticketExpired(error: ApiResultInterface): void {
    if (error.error && error.error.result && error.error.result.status === ErrorStatus.TICKET_EXPIRED) {
      this.urlService.navigateToInternalUrl('/ticket-expired', this.ticketInfoService.ticket);
    }
  }

  private invalidTicket(error: ApiResultInterface): void {
    if (error.error && error.error.result && error.error.result.title === 'INVALID_TICKET') {
      this.closeSessionService.close();
    }
  }

  private connectionError(): void {
    this.urlService.navigateToInternalUrl('/service-connection', this.ticketInfoService.ticket);
  }
}
