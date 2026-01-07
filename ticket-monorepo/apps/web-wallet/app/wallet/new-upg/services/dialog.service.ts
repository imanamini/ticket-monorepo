import { inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GetCallbackUrl } from '../../../utils/storage';
import { RedirectFormData, RedirectService } from '../../../core/services/redirect.service';
import { TgsTicketInfoResponse } from '../../../api/models/tgs-ticket-info.response';
import {BadgeAlertComponent} from "../components/badge-alert/badge-alert.component";
import {EXIT_ALERT_DATA} from "../consts/exit-alert";
import {ActionType} from "../models/action.type";
import {ConvertorDeepLinkToHttpsProtocol} from "./convertor-deeplink-url.service";

@Injectable()
export class DialogService {
  private matDialog = inject(MatDialog);
  private redirectService = inject(RedirectService);
  private convertorDeepLinkToHttpsProtocol = inject(ConvertorDeepLinkToHttpsProtocol);

  public open(component, dialogData): MatDialogRef<any> {
    return this.matDialog.open(component, {
      width: '360px',
      maxWidth: '360px',
      maxHeight: '98vh',
      autoFocus: false,
      data: {...dialogData}
    });
  }

  public openExitAlert(ticketInfo: TgsTicketInfoResponse, reloadOnContinue = false): void {
    console.log('reloadOnContinue', reloadOnContinue);
    this.open(BadgeAlertComponent, EXIT_ALERT_DATA)
      .afterClosed().subscribe((result: ActionType) => {
      if (result === 'SUBMIT') {
        const callback = GetCallbackUrl();
        const convertedUrlToAcceptableUrl = this.convertorDeepLinkToHttpsProtocol.convert(callback)
        const RESULT_FIELD = {key: 'result', value: 'CANCEL'};
        const result: Array<RedirectFormData> = [];
        result.push({
          key: 'type',
          value: ticketInfo.type
        });
        result.push({
          key: 'rrn',
          value: null
        });
        result.push({
          key: 'psp',
          value: null
        });
        result.push({
          key: 'amount',
          value: ticketInfo.amount
        });
        result.push({
          key: 'providerId',
          value: ticketInfo.providerId
        });
        result.push({
          key: 'trackingCode',
          value: null
        });
        this.redirectService.url.next(convertedUrlToAcceptableUrl);
        this.redirectService.setAndRedirect([...result, RESULT_FIELD]);
      } else if (reloadOnContinue) {
          window.location.reload();
        }
    });
  }
}
