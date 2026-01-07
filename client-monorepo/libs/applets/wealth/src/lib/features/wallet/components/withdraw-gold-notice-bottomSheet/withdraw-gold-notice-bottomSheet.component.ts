import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxIcon } from '@digipay/ngx-icon';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';

@Component({
  selector: 'wealth-applet-withdraw-gold-notice-bottom-sheet',
  standalone: true,
  imports: [CommonModule, NgxIcon, NgxButtonComponent],
  templateUrl: './withdraw-gold-notice-bottomSheet.component.html',
  styleUrl: './withdraw-gold-notice-bottomSheet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WithdrawGoldNoticeBottomSheetComponent {
  private bottomsheetService = inject(NgxBottomSheetService);

  handleAction() {
    this.bottomsheetService.outputData.set('continue');
    this.bottomsheetService.closeBottomSheet();
  }
}
