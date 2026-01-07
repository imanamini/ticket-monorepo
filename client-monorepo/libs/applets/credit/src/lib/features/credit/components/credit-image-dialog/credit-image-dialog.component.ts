import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { CreditDigipayImageComponent } from '../credit-digipay-image/credit-digipay-image.component';
import { CreditDigipayDialogComponent } from '../credit-digipay-dialog/credit-digipay-dialog.component';

@Component({
  selector: 'app-credit-image-dialog',
  templateUrl: './credit-image-dialog.component.html',
  styleUrls: ['./credit-image-dialog.component.scss'],
  standalone: true,
  imports: [CreditDigipayDialogComponent, CreditDigipayImageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditImageDialogComponent {
  imageId = signal<string | null>(null);
  fileImageSrc = signal<string | null>(null);

  bottomSheetService = inject(NgxBottomSheetService);

  constructor() {
    this.imageId.set(this.bottomSheetService.data().imageId);
    this.fileImageSrc.set(this.bottomSheetService.data().fileImageSrc);
  }

  dialogClose(result: any) {
    this.bottomSheetService.outputData.set({
      confirmed: result,
    });
    this.bottomSheetService.closeBottomSheet();
  }
}
