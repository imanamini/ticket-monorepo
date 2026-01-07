import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { Buttons } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';

@Component({
  selector: 'app-credit-cheque-step-error-dialog',
  templateUrl: './credit-cheque-step-error-dialog.component.html',
  styleUrls: ['./credit-cheque-step-error-dialog.component.scss'],
  standalone: true,
  imports: [NgxCalloutComponent, NgxStatusResultModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditChequeStepErrorDialogComponent {
  buttons: Buttons[] = [
    {
      id: 'chequeStepErrorDialogButtonClick',
      label: 'متوجه شدم',
      mode: 'form',
      fullWidth: true,
      style: 'fill',
    },
  ];
  title = signal<string | null>(null);
  description = signal<string | null>(null);
  descriptionHtml = signal<string | null>(null);
  reasons = signal<string[]>([]);
  bottomSheetService = inject(NgxBottomSheetService);

  constructor() {
    this.title.set(this.bottomSheetService.data().title || 'متاسفانه مشکلی پیش آمده لطفا با پشتیبانی تماس بگیرید.');
    this.description.set(this.bottomSheetService.data().firstDesc);
    this.descriptionHtml.set(this.bottomSheetService.data().descriptionHtml);
    if (this.bottomSheetService.data().reasons) {
      this.reasons.set(this.bottomSheetService.data().reasons);
    }
  }

  close() {
    this.bottomSheetService.closeBottomSheet();
  }
}
