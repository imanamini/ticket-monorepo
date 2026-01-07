import { inject, Injectable } from '@angular/core';
import { TacResponse, UserDetail } from '../../../api/models/tac.response';
import { map } from 'rxjs/operators';
import { ApiResult } from '../../../api/models/api-result';
import { HandleErrorService } from './handle-error.service';
import { TicketInfoService } from './ticket-info.service';
import {NewUpgService} from "../../../api/services/new-upg/new-upg.service";

@Injectable()
export class UserInformationService {
  public user: UserDetail;
  private newUpgService = inject(NewUpgService);
  private handleErrorService = inject(HandleErrorService);
  private ticketInfoService = inject(TicketInfoService);

  public get(): Promise<UserDetail> {
    return new Promise<UserDetail>((resolve, reject) => {
      if (this.user) {
        resolve(this.user);
      } else {
        this.newUpgService.tac(this.ticketInfoService.ticket)
          .pipe(map((item: TacResponse) => item.userDetail))
          .subscribe((response: UserDetail) => {
            this.user = response;
            resolve(response);
          }, (errorResponse: ApiResult) => {
            this.handleErrorService.check(errorResponse);
            reject(errorResponse);
          });
      }
    });
  }
}
