import { inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EXIT_ALERT_DATA } from '../consts/exit-alert';
import { ActionType } from '../models/action.type';
import { ConvertorDeepLinkToHttpsProtocol } from './convertor-deeplink-url.service';
import { BadgeAlertComponent } from '../../components/badge-alert/badge-alert.component';
import { StorageService } from '@client-monorepo/common/utilities';
import { RedirectFormData, RedirectService } from './redirect.service';
import { AppPayFeaturesResponse } from '../models/app-pay-features.response';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private matDialog = inject(MatDialog);
  private redirectService = inject(RedirectService);
  private convertorDeepLinkToHttpsProtocol = inject(ConvertorDeepLinkToHttpsProtocol);
  storageService = inject(StorageService);
  // todo improve types
  public open(component: any, dialogData: any): MatDialogRef<any> {
    return this.matDialog.open(component, {
      width: '360px',
      maxWidth: '360px',
      maxHeight: '98vh',
      autoFocus: false,
      data: { ...dialogData },
    });
  }

  public openExitAlert(ticketInfo: AppPayFeaturesResponse): void {
    this.open(BadgeAlertComponent, EXIT_ALERT_DATA)
      .afterClosed()
      .subscribe((result: ActionType) => {
        if (result === 'SUBMIT') {
          const callback = this.storageService.getCallbackUrl() || '';
          const convertedUrlToAcceptableUrl = this.convertorDeepLinkToHttpsProtocol.convert(callback);
          const RESULT_FIELD = { key: 'result', value: 'CANCEL' };
          const result: Array<RedirectFormData> = [];
          result.push({
            key: 'type',
            value: ticketInfo.type,
          });
          result.push({
            key: 'rrn',
            value: null,
          });
          result.push({
            key: 'psp',
            value: null,
          });
          result.push({
            key: 'amount',
            value: ticketInfo.amount,
          });
          result.push({
            key: 'providerId',
            value: ticketInfo.providerId,
          });
          result.push({
            key: 'trackingCode',
            value: null,
          });
          this.redirectService.url.next(convertedUrlToAcceptableUrl);
          this.redirectService.setAndRedirect([...result, RESULT_FIELD]);
        }
      });
  }
}
