import { Component, inject, signal } from '@angular/core';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { EAlertNotice } from '../../models/alert-notice.enum';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { IButton } from '../../models/ipo-buttons.interface';

@Component({
  selector: 'app-alert-me-notice',
  standalone: true,
  imports: [NgxButtonComponent],
  templateUrl: './alert-me-notice.component.html',
  styleUrl: './alert-me-notice.component.scss',
})
export class AlertMeNoticeComponent {
  private bottomSheet = inject(NgxBottomSheetService);

  buttons = signal<IButton[]>([
    {
      style: 'tinted-on-elevated',
      disabled: false,
      loading: false,
      id: EAlertNotice.GOT_IT,
      label: 'متوجه شدم',
    },
    {
      style: 'fill',
      disabled: false,
      loading: false,
      id: EAlertNotice.CHECK_SEJAM,
      label: 'بررسی حساب سجام',
    },
  ]);

  action(id: string) {
    this.bottomSheet.outputData.set(id);
    this.bottomSheet.closeBottomSheet();
  }
}
