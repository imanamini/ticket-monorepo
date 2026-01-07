import { NgxIcon } from '@digipay/ngx-icon';
import { CommonModule } from '@angular/common';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

@Component({
  selector: 'wealth-applet-maximum-swap-bottomsheet',
  standalone: true,
  imports: [CommonModule, NgxIcon, NgxButtonComponent],
  templateUrl: './maximum-swap-bottomsheet.component.html',
  styleUrl: './maximum-swap-bottomsheet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaximumSwapBottomsheetComponent {
  private bottomsheetService = inject(NgxBottomSheetService);

  handleAction() {
    this.bottomsheetService.closeBottomSheet();
  }
}
