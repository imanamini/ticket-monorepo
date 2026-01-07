import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CreditConfirmDialogData } from './models/credit-confirm-dialog-data';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'app-credit-confirm-dialog',
  templateUrl: './credit-confirm-dialog.component.html',
  styleUrls: ['./credit-confirm-dialog.component.scss'],
  standalone: true,
  imports: [NgxButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditConfirmDialogComponent {
  isDesktop = signal<boolean | null>(null);
  creditConfirmDialogData!: CreditConfirmDialogData;
  bottomSheetService = inject(NgxBottomSheetService);

  constructor() {
    this.creditConfirmDialogData = this.bottomSheetService.data();
  }

  confirm() {
    this.bottomSheetService.outputData.set(true);
    this.bottomSheetService.closeBottomSheet();
  }

  reject() {
    this.bottomSheetService.outputData.set(false);
    this.bottomSheetService.closeBottomSheet();
  }
}
