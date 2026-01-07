import { inject, Injectable, Injector } from '@angular/core';
import { TgsTicketInfoResponse } from '../../../api/models/tgs-ticket-info.response';
import { SaveCallbackUrl } from '../../../utils/storage';
import { HandleErrorService } from './handle-error.service';
import {NewUpgService} from "../../../api/services/new-upg/new-upg.service";
import {FAKE_TICKET_INFO} from "../fake-ticket-info";

@Injectable()
export class TicketInfoService {
  public state: TgsTicketInfoResponse;
  public ticket: string;
  private newUpgService = inject(NewUpgService);

  constructor(private injector: Injector) {}
  public get(): Promise<TgsTicketInfoResponse> {
    const handleErrorService = this.injector.get(HandleErrorService); // inject here for removing circular dependency.
    return new Promise<TgsTicketInfoResponse>((resolve, reject) => {
      if (this.state) {
        resolve(this.state);
      } else {
        this.newUpgService.getTgsTicketInfo(this.ticket)
          .subscribe((response: TgsTicketInfoResponse) => {
            // this.state = FAKE_TICKET_INFO;
            this.state = response;
            //ToDo: fallbackUrl has to change with callbackUrl after fix backend.
            SaveCallbackUrl(response.fallbackUrl);
            resolve(response);
          }, (errorResponse) => {
            handleErrorService.check(errorResponse);
            reject(errorResponse);
          });
      }
    });
  }

}
