import { inject, Injectable } from '@angular/core';
import { fromEvent, merge, Observable, Observer } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResult } from '../../../api/models/api-result';
import { UrlService } from './url.service';
import { ErrorStatusEnum } from '../../../api/emuns/error-status.enum';
import { TicketInfoService } from './ticket-info.service';
import { ErrorStatus } from '../enums/error-status.enum';
import { BottomSheetService } from './bottom-sheet.service';
import { CloseSessionService } from './close-session.service';

@Injectable()
export class HandleErrorService {
  private urlService = inject(UrlService);
  private ticketInfoService = inject(TicketInfoService);
  private bottomSheetService = inject(BottomSheetService);
  private closeSessionService = inject(CloseSessionService);

  public listenToNetworkStatusChanges(): void {
    this.onConnectionStatusChange()
      .subscribe((isOnline: boolean) => {
        if (isOnline === false) {
          this.urlService.navigateToInternalUrl('/offline', this.ticketInfoService.ticket);
        }
      });
  }

  public onConnectionStatusChange() {
    // @ts-ignore
    return merge<boolean>(
      fromEvent(window, 'offline').pipe(map(() => false)),
      fromEvent(window, 'online').pipe(map(() => true)),
      new Observable((sub: Observer<boolean>) => {
        sub.next(navigator.onLine);
        sub.complete();
      }));
  }

  public check(error: ApiResult): void {
    this.bottomSheetService.close();

    switch (error.status) {
      case ErrorStatusEnum.UNAUTHORIZED:
        this.ticketExpired(error);
        break;

      case ErrorStatusEnum.NOT_FOUND:
        this.invalidTicket(error);
        break;

      case ErrorStatusEnum.SERVICE_ERROR:
      case ErrorStatusEnum.INTERNAL_SERVICE_ERROR:
      case ErrorStatusEnum.INTERNET_CONNECTION:
        this.connectionError();
        break;

      default:
        break;
    }
    throw new Error(error.message)
  }

  private ticketExpired(error: ApiResult): void {
    if (error.error && error.error.result && error.error.result.status === ErrorStatus.TICKET_EXPIRED) {
      this.urlService.navigateToInternalUrl('/ticket-expired', this.ticketInfoService.ticket);
    }
  }

  private invalidTicket(error: ApiResult): void {
    if (error.error && error.error.result && error.error.result.title === 'INVALID_TICKET') {
      this.closeSessionService.close();
    }
  }

  private connectionError(): void {
    this.urlService.navigateToInternalUrl('/service-connection', this.ticketInfoService.ticket);
  }
}
