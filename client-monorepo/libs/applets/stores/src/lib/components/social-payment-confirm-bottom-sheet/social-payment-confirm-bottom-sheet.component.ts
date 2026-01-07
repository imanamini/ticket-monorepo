import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';

@Component({
  selector: 'stores-applet-social-payment-confirm-bottom-sheet',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent],
  templateUrl: './social-payment-confirm-bottom-sheet.component.html',
  styleUrl: './social-payment-confirm-bottom-sheet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialPaymentConfirmBottomSheetComponent {
  bottomSheetService = inject(NgxBottomSheetService);

  handleBtnClick(whichBtn: 'BUY' | 'MESSAGE'): void {
    this.bottomSheetService.outputData.set({
      button: whichBtn,
    });
    this.bottomSheetService.closeBottomSheet();
  }
}
