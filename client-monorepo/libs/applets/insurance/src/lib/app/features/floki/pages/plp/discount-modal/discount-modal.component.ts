import { Component, inject, OnInit, signal } from '@angular/core';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { VoucherCodePattern } from '../../../../../util/patterns';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheet } from '@angular/material/bottom-sheet';
import { ApplicationFormService } from '../../../services/application-form.service';
import { BaseComponent } from '../../../../../components/base/base.component';
import { MessageService } from '@client-monorepo/common/utilities';

@Component({
  selector: 'discount-modal',
  standalone: true,
  imports: [UiFormFieldBuilderModule, NgxButtonComponent, ReactiveFormsModule],
  templateUrl: './discount-modal.component.html',
  styleUrl: './discount-modal.component.scss',
})
export class DiscountModalComponent extends BaseComponent implements OnInit {
  sheet = inject(MatBottomSheet);
  applicationFormService = inject(ApplicationFormService);
  bottomSheetData = inject(MAT_BOTTOM_SHEET_DATA);
  isSubmitting = signal<boolean>(false);
  messageService = inject(MessageService);
  voucherCode = new FormControl('', [Validators.pattern(VoucherCodePattern), Validators.minLength(1)]);

  public messageErrorMapper = {
    pattern: 'کد تخفیف اشتباه است',
    invalid: '',
  };

  ngOnInit(): void {
    this.voucherCode.valueChanges.subscribe(() => (this.messageErrorMapper.invalid = ''));
  }

  closeDialog(): void {
    return this.sheet.dismiss();
  }

  submitDiscount(): void {
    const subscription = this.applicationFormService.setDiscount(this.voucherCode.value, this.bottomSheetData.data.formId).subscribe({
      next: (res) => {
        this.sheet.dismiss(res.result);
      },
      error: (e) => {
        this.messageService.showErrorIfExists(e);
      },
    });
    super.addSubscription(subscription);
  }
}
