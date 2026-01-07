import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { DpIconComponent } from '@client-monorepo/common/icon';

@Component({
  selector: 'c2c-applet-expiration-date',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent, DpIconComponent],
  templateUrl: './expiration-date-dialog.component.html',
  styleUrls: ['./expiration-date-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpirationDateDialogComponent {
  private readonly bottomSheetService = inject(NgxBottomSheetService);

  dialogClose(result: any) {
    this.bottomSheetService.outputData.set({
      confirmed: result,
    });
    this.bottomSheetService.closeBottomSheet();
  }
}
