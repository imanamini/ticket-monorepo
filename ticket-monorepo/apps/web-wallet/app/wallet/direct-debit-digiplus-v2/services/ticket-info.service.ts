import { Injectable } from '@angular/core';
import { DirectDebitTicketInfoResponse } from '../../../api/models/direct-debit.response';
import { HandleErrorService } from './handle-error.service';
import { TicketService } from './ticket.service';
import {DirectDebitApiV2Service} from "../../../api/direct-debit-api-v2.service";
import {SaveProviderId} from "../../direct-debit-digiplus/utiles/digiplus-direct-debit-storage";
import {SaveCallbackUrl} from "../../../utils/storage";

@Injectable()
export class TicketInfoService {
  state: DirectDebitTicketInfoResponse;

  constructor(
    private handleErrorService: HandleErrorService,
    private directDebitApiV2Service: DirectDebitApiV2Service,
    private ticketService: TicketService
  ) {
  }

  public get(): Promise<DirectDebitTicketInfoResponse> {
    return new Promise<DirectDebitTicketInfoResponse>((resolve, reject) => {
      if (this.state) {
        resolve(this.state);
      } else {
        const ticket: string = this.ticketService.get();
        this.directDebitApiV2Service.getDirectDebitTicketInfoV2(ticket)
          .subscribe((response: DirectDebitTicketInfoResponse) => {
            this.state = response;
            SaveProviderId(response.providerId);
            SaveCallbackUrl(response.callbackUrl);
            resolve(response);
          }, (errorResponse) => {
            this.handleErrorService.handle(errorResponse , ticket);
            reject(errorResponse);
          });
      }
    });
  }
}
