import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';

@Component({
  selector: 'stores-applet-violation-leave-bottom-sheet',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent],
  templateUrl: './violation-leave-bottom-sheet.component.html',
  styleUrl: './violation-leave-bottom-sheet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViolationLeaveBottomSheetComponent {
  bottomSheetService = inject(NgxBottomSheetService);

  handleClick(confirmed: boolean) {
    this.bottomSheetService.outputData.set({
      confirmed,
      showedBefore: true,
    });
    setTimeout(() => {
      this.bottomSheetService.outputData.set({
        confirmed,
        showedBefore: false,
      });
    }, 500);
    this.bottomSheetService.closeBottomSheet();
  }
}
