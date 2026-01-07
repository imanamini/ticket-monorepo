import { EventEmitter, Injectable } from '@angular/core';
import { GetTicketDetailResponse } from '../api/clients/registration/response-models/get-ticket-detail.response';
import { Observable } from 'rxjs';
import { RegistrationApiService } from '../api/clients/registration/registration-api.service';

@Injectable()
export class TicketService {

  ticketDetailsCache: { [key: string]: GetTicketDetailResponse } = {};

  gettingTicketDetail: { [key: string]: boolean } = {};

  GLOBAL_TICKET_INDEX = 'globalTicket';

  checkSignal = new EventEmitter<void>();

  constructor(
    private registrationApiService: RegistrationApiService
  ) {
  }

  getTicketDetail(creditId: string | null, forceUpdate: boolean = false): Observable<GetTicketDetailResponse> {
    return new Observable<GetTicketDetailResponse>(subscriber => {
      if (!forceUpdate && this.ticketDetailsCache[creditId || this.GLOBAL_TICKET_INDEX]) {
        subscriber.next(this.ticketDetailsCache[creditId || this.GLOBAL_TICKET_INDEX]);
        subscriber.complete();
        return;
      }
      if (!forceUpdate && this.gettingTicketDetail[creditId || this.GLOBAL_TICKET_INDEX]) {
        const checkSignalSubscribe = this.checkSignal.subscribe({
          next: () => {
            if (this.ticketDetailsCache[creditId || this.GLOBAL_TICKET_INDEX]) {
              checkSignalSubscribe.unsubscribe();
              subscriber.next(this.ticketDetailsCache[creditId || this.GLOBAL_TICKET_INDEX]);
              subscriber.complete();
              return;
            }
          }
        });
      }
      this.gettingTicketDetail[creditId || this.GLOBAL_TICKET_INDEX] = true;
      this.registrationApiService.getNewTicketDetail(creditId).subscribe(res => {
        this.ticketDetailsCache[creditId || this.GLOBAL_TICKET_INDEX] = res;
        this.gettingTicketDetail[creditId || this.GLOBAL_TICKET_INDEX] = false;
        subscriber.next(this.ticketDetailsCache[creditId || this.GLOBAL_TICKET_INDEX]);
        this.checkSignal.emit();
        subscriber.complete();
      });
    });
  }

  refreshTicketDetails(creditId: string): Observable<GetTicketDetailResponse> {
    delete this.ticketDetailsCache[creditId || this.GLOBAL_TICKET_INDEX];
    return this.getTicketDetail(creditId);
  }

}
