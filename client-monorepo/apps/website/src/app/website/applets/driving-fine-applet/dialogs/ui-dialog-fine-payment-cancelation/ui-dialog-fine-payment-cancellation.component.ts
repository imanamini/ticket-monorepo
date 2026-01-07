import { Component } from '@angular/core';
import { DialogBottomSheetService } from '../../../../../core/services/dialog-bottom-sheet.service';
import { UiButtonComponent } from '../../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { NgOptimizedImage } from '@angular/common';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'app-ui-dialog-fine-payment-cancelation',
  templateUrl: './ui-dialog-fine-payment-cancellation.component.html',
  styleUrls: ['./ui-dialog-fine-payment-cancellation.component.scss'],
  standalone: true,
  imports: [NgOptimizedImage, UiButtonComponent, NgxIcon],
})
export class UiDialogFinePaymentCancellationComponent {
  constructor(private dialogBottomSheetService: DialogBottomSheetService) {}

  closeDialog(result?) {
    this.dialogBottomSheetService.close(result);
  }
}
