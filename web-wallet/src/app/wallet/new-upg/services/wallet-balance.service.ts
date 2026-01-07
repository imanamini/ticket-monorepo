import { inject, Injectable } from '@angular/core';
import { WalletBalanceResponse } from '../../../api/models/wallet-balance.response';
import { HandleErrorService } from './handle-error.service';
import { ApiResult } from '../../../api/models/api-result';
import { TicketInfoService } from './ticket-info.service';
import {NewUpgService} from "../../../api/services/new-upg/new-upg.service";

@Injectable()
export class WalletBalanceService {
  public state: WalletBalanceResponse;
  private newUpgService = inject(NewUpgService);
  private handleErrorService = inject(HandleErrorService);
  private ticketInfoService = inject(TicketInfoService);

  public get(): Promise<WalletBalanceResponse> {
    return new Promise<WalletBalanceResponse>((resolve, reject) => {
      if (this.state) {
        resolve(this.state);
      } else {
        this.newUpgService.getUpgWalletBalance(this.ticketInfoService.ticket)
          .subscribe((response: WalletBalanceResponse) => {
            this.state = response;
            resolve(response);
          }, (errorResponse: ApiResult) => {
            this.handleErrorService.check(errorResponse);
            reject(errorResponse);
          });
      }
    });
  }
}
