import { NgxIcon } from '@digipay/ngx-icon';
import { CommonModule } from '@angular/common';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

@Component({
  selector: 'wealth-applet-swap-activation-alert-bottomsheet',
  standalone: true,
  imports: [CommonModule, NgxIcon, NgxButtonComponent],
  templateUrl: './swap-activation-alert-bottomsheet.component.html',
  styleUrl: './swap-activation-alert-bottomsheet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SwapActivationAlertBottomsheetComponent {
  private bottomsheetService = inject(NgxBottomSheetService);

  handleAction(action: 'continue') {
    this.bottomsheetService.outputData.set(action);
    this.bottomsheetService.closeBottomSheet();
  }
}
