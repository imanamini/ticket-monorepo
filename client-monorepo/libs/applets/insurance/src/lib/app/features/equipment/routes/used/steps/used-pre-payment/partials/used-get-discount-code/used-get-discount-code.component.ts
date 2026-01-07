import { Component, Inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { convertNonEnglishDigits } from '@digipay/strings';
import {
  AbstractControl,
  FormControl,
  ReactiveFormsModule, ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { VoucherCodePattern } from '../../../../../../../../util/patterns';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { UiButtonComponent } from '../../../../../../../../components/ui-button/ui-button/ui-button.component';
import { DiscountReserveBody } from '../../../../../../api/models/renewal/discount-reserve-body.model';
import { finalize } from 'rxjs/operators';
import { UsedApiService } from '../../../../../../api/services/used/used-api.service';
import { Subscription } from 'rxjs';
import { ReserveModel } from '../../../../../../api/models/renewal/reserve.model';

@Component({
  selector: 'used-get-discount-code',
  templateUrl: './used-get-discount-code.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    UiFormFieldBuilderModule,
    UiButtonComponent
  ],
  styleUrls: ['./used-get-discount-code.component.scss']
})
export class UsedGetDiscountCodeComponent implements OnInit, OnDestroy {
  isSubmitting = signal<boolean>(false);

  constructor(private sheetRef: MatBottomSheetRef<UsedGetDiscountCodeComponent>,
              @Inject(MAT_BOTTOM_SHEET_DATA) public sheetData: {
                uniqueCode: string,
              },
              private apiService: UsedApiService) {
  }

  voucherCode = new FormControl('', [
    Validators.pattern(VoucherCodePattern),
    Validators.minLength(1),
  ]);
  subscription: Subscription = new Subscription();
  public messageErrorMapper = {
    pattern: 'کد تخفیف اشتباه است',
    invalid: ''
  };

  ngOnInit(): void {
    this.voucherCode.valueChanges.subscribe(() => this.messageErrorMapper.invalid = '');
  }

  reserveDiscount(): void {
    if (!this.isSubmitting() && this.voucherCode.valid) {
      this.messageErrorMapper.invalid = '';
      this.isSubmitting.set(true);
      const body: DiscountReserveBody = {
        key: this.sheetData.uniqueCode,
        discountCode: convertNonEnglishDigits(this.voucherCode.value).trim(),
      };
      const subscription = this.apiService.reserveDiscount(body)
        .pipe(
          finalize(() => this.isSubmitting.set(false))
        )
        .subscribe({
          next: (res) => {
            if (res.data.isValid) {
              const prePaymentData = {
                ...res.data,
                discountAmount: (res.data.discountAmount / 10),
                payableAmount: (res.data.payableAmount / 10),
                taxAmount: (res.data.taxAmount / 10)
              };
              this.closeDialog(prePaymentData);
            } else {
              this.messageErrorMapper.invalid = (res.data.invalidMessage);
            }
          },
          error: (e) => {
            this.messageErrorMapper.invalid = 'خطا در ثبت کد تخفیف';
          }
        });
      this.subscription.add(subscription);
    }
  }

  closeDialog(prePaymentData?: ReserveModel): void {
    return this.sheetRef.dismiss({prePaymentData, discount: convertNonEnglishDigits(this.voucherCode.value).trim()});
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
