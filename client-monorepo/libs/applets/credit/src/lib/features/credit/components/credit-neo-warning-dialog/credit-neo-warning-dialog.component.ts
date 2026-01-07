import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { convertDecimalToRgb } from '../../data-access/utils/colors';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { CreditDigipayImageComponent } from '../credit-digipay-image/credit-digipay-image.component';
import { CreditDigipayDialogComponent } from '../credit-digipay-dialog/credit-digipay-dialog.component';

@Component({
  selector: 'app-credit-neo-warning-dialog',
  templateUrl: './credit-neo-warning-dialog.component.html',
  styleUrls: ['./credit-neo-warning-dialog.component.scss'],
  standalone: true,
  imports: [CreditDigipayDialogComponent, CreditDigipayImageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditNeoWarningDialogComponent {
  confirmBtnTxt = signal('متوجه شدم');
  rejectBtnTxt = signal<string | null>(null);
  title = signal<string | null>(null);
  firstDesc = signal<string | null>(null);
  secondDesc = signal<string | null>(null);
  pictorial = signal<boolean | null>(null);
  secondDescColor = signal<string | null>(null);
  secondDescImgId = signal<string | null>(null);

  bottomSheetService = inject(NgxBottomSheetService);

  constructor() {
    this.title.set(this.bottomSheetService.data().title || null);
    this.firstDesc.set(this.bottomSheetService.data().firstDesc || null);
    this.secondDesc.set(this.bottomSheetService.data().secondDesc || null);
    this.confirmBtnTxt.set(this.bottomSheetService.data().buttonText || null);
    this.pictorial.set(this.bottomSheetService.data().pictorial || null);
    this.secondDescColor.set(
      this.bottomSheetService.data().secondDescColor ? convertDecimalToRgb(this.bottomSheetService.data().secondDescColor) : null,
    );
    this.secondDescImgId.set(this.bottomSheetService.data().secondDescImgId || null);
    this.rejectBtnTxt.set(this.bottomSheetService.data().rejectBtnTxt || null);
  }

  dialogClose(result: any) {
    this.bottomSheetService.outputData.set({
      confirmed: result,
    });
    this.bottomSheetService.closeBottomSheet();
  }
}
