import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { FormsModule } from '@angular/forms';
import { InquiryBarcodeData } from '../data-access/models/barcode.model';
import { IranianRialsPipe } from '@client-monorepo/shared/common/iranian-rials';
import { ScannerApiService } from '../data-access/services/scanner-api.service';
import { MessageService } from '@client-monorepo/common/utilities';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { BarcodeLoadingService } from '../barcode-loading/service/barcode-loading.service';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'lib-inquiry-barcode',
  standalone: true,
  imports: [CommonModule, DpIconComponent, FormsModule, IranianRialsPipe, NgxButtonComponent],
  templateUrl: './inquiry-barcode.component.html',
  styleUrl: './inquiry-barcode.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InquiryBarcodeComponent {
  private bottomSheetService = inject(NgxBottomSheetService);
  private barcodeLoading = inject(BarcodeLoadingService);
  private api = inject(ScannerApiService);
  private message = inject(MessageService);
  data!: InquiryBarcodeData;

  constructor() {
    this.data = this.bottomSheetService.data();
  }

  public handleClickSubmit() {
    this.barcodeLoading.timerLoading(this.api.acceptPurchase(this.data.barcodeNumber)).subscribe({
      next: (res) => {
        this.bottomSheetService.closeBottomSheet();
        this.bottomSheetService.outputData.set({ type: 'SUCCESS', data: res.receiptData });
      },
      error: (err) => {
        this.message.showErrorOfErrorResponse(err);
      },
    });
  }

  public handleClickCancel() {
    this.api.rejectPurchase(this.data.barcodeNumber).subscribe({
      next: () => {
        this.bottomSheetService.closeBottomSheet();
        this.message.showSuccessMessage('خرید اعتباری شما کنسل شد.');
        this.bottomSheetService.outputData.set({ type: 'CANCEL', data: null });
      },
      error: (err) => {
        this.bottomSheetService.closeBottomSheet();
        this.message.showErrorOfErrorResponse(err);
      },
    });
  }
}
