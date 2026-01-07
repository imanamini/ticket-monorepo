import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'wealth-applet-swap-notifier-bottom-sheet',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent, NgxIcon],
  templateUrl: './swap-notifier-bottomSheet.component.html',
  styleUrl: './swap-notifier-bottomSheet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SwapNotifierBottomSheetComponent {
  bottomSheetService = inject(NgxBottomSheetService);

  confirm() {
    this.bottomSheetService.closeBottomSheet();
  }
}
