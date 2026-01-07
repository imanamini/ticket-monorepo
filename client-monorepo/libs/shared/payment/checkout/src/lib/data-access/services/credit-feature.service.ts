import { inject, Injectable } from '@angular/core';
import { DialogService } from './dialog.service';
import { ActionType } from '../models/action.type';
import { BadgeAlertInterface } from '../models/badge-alert.interface';
import { BadgeAlertComponent } from '../../components/badge-alert/badge-alert.component';

@Injectable({
  providedIn: 'root',
})
export class CreditFeatureService {
  private dialogService = inject(DialogService);

  public openModal(url: string): void {
    const dialogState: BadgeAlertInterface = {
      title: 'فعال‌سازی خرید اعتباری',
      description:
        'برای بهره‌مندی از روش خرید اعتباری، درخواست خود' +
        ' را ارسال کنید. تا دقایقی دیگر پیامکی حاوی اطلاعات دریافت اعتبار برای شما ارسال می‌شود.',
      submitButtonText: 'ارسال درخواست',
      logoPath: '/assets/image/tgs/card.svg',
      appearance: 'default',
    };
    this.dialogService
      .open(BadgeAlertComponent, dialogState)
      .afterClosed()
      .subscribe((result: ActionType) => {
        if (result === 'SUBMIT') {
          // todo handle navigation
          document.location.href = url;
        }
      });
  }
}
