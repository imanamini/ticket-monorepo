import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RefundReasonResponse, RefundRequest } from '../../../data-access/models/refund.interface';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { MessageService } from '@client-monorepo/common/utilities';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';
import { SellerOrderService } from '../../../data-access/services/seller-order.service';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxRadioButtonComponent } from '@digipay/ngx-radio-button';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'escrow-home-applet-seller-cancel-order',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UiFormFieldBuilderModule,
    NgxDividerComponent,
    NgxRadioButtonComponent,
    NgxButtonComponent
  ],
  templateUrl: './seller-cancel-order.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SellerCancelOrderComponent implements OnInit {
  protected readonly BorderColorsEnum = BorderColorsEnum;
  sellerOrderService = inject(SellerOrderService);
  bottomSheetService = inject(NgxBottomSheetService);
  fb = inject(FormBuilder);
  messageService = inject(MessageService);
  form!: FormGroup;
  refundReasonList = signal<RefundReasonResponse[]>([]);
  selectedReason = signal<RefundReasonResponse>({} as RefundReasonResponse);

  ngOnInit() {
    this.getRefundReasons();
    this.form = this.fb.group({
      description: ['', [Validators.maxLength(255)]],
    });
  }

  getRefundReasons() {
    this.sellerOrderService.getRefundReasons().subscribe((res) => {
      this.refundReasonList.set(res.refundReasons);
    });
  }

  handleCheckChange(code: number, isChecked: boolean): void {
    const filter = this.refundReasonList().find((reason) => reason.code === code);
    if (filter) {
      if (isChecked) {
        this.selectedReason.set(filter);
      }
    }
  }

  cancelOrder() {
    if (!this.selectedReason()?.code) return;
    const refundRequest: RefundRequest = {
      trackingCode: this.bottomSheetService.data().trackingCode,
      customDescription: this.form.get('description')?.value,
      code: this.selectedReason().code,
    };
    this.sellerOrderService.cancelSellerOrder(refundRequest).subscribe({
      next: () => {
        this.messageService.showSuccessMessage(`سفارش با کد ${refundRequest.trackingCode} لغو شد`);
      },
      error: (error) => {
        this.messageService.showErrorOfErrorResponse(error);
      },
    });
    this.bottomSheetService.closeBottomSheet();
  }
}
