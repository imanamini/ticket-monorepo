import { Injectable } from '@angular/core';
import { DirectDebitTicketInfoResponse } from '../../../api/models/direct-debit.response';
import { WalletApiService } from '../../../api/wallet-api.service';
import { HandleErrorService } from './handle-error.service';
import { TicketService } from './ticket.service';
import { SaveProviderId } from '../utiles/digiplus-direct-debit-storage';
import {SaveCallbackUrl} from "../../../utils/storage";

@Injectable()
export class TicketInfoService {
  state: DirectDebitTicketInfoResponse;

  constructor(
    private handleErrorService: HandleErrorService,
    private walletApiService: WalletApiService,
    private ticketService: TicketService
  ) {
  }

  public get(): Promise<DirectDebitTicketInfoResponse> {
    return new Promise<DirectDebitTicketInfoResponse>((resolve, reject) => {
      if (this.state) {
        resolve(this.state);
      } else {
        const ticket: string = this.ticketService.get();
        this.walletApiService.getDirectDebitTicketInfo(ticket)
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
