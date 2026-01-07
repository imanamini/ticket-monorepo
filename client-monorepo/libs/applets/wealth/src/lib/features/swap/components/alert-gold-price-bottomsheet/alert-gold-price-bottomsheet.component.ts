import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxIcon } from '@digipay/ngx-icon';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';

@Component({
  selector: 'wealth-applet-alert-gold-price-bottomsheet',
  standalone: true,
  imports: [CommonModule, NgxIcon, NgxButtonComponent],
  templateUrl: './alert-gold-price-bottomsheet.component.html',
  styleUrl: './alert-gold-price-bottomsheet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertGoldPriceBottomsheetComponent {
  private bottomsheetService = inject(NgxBottomSheetService);

  handleAction(action: 'continue') {
    this.bottomsheetService.outputData.set(action);
    this.bottomsheetService.closeBottomSheet();
  }
}
