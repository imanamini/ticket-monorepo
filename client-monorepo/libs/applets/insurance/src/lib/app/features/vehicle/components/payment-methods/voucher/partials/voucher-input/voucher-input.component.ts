import { Component, effect, HostListener, inject, input, OnInit, signal } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { NgxIcon } from '@digipay/ngx-icon';
import { InsButtonComponent } from '../../../../../../../components/ins-button/ins-button.component';
import { BaseComponent } from '../../../../../../../components/base/base.component';
import { VoucherApiService } from '../../../../../data-access/services/third-party/voucher-api.service';
import { StoreService } from '../../../../../features/third-party/data-access/services/store.service';
import { InsButtonSizeEnum } from '../../../../../../../data-access/enums/ins-button-size.enum';
import { InsButtonStyleEnum } from '../../../../../../../data-access/enums/ins-button-style.enum';
import { MotorStoreService } from '../../../../../features/third-party-motor/data-access/services/motor-store.service';
import {
  MotorApplicationFormApiService
} from '../../../../../data-access/services/third-party-motor/motor-application-form-api.service';

@Component({
  selector: 'voucher-input',
  standalone: true,
  imports: [
    UiFormFieldBuilderModule,
    InsButtonComponent,
    ReactiveFormsModule,
    NgxIcon
  ],
  templateUrl: './voucher-input.component.html',
  styleUrl: './voucher-input.component.scss'
})
export class VoucherInputComponent extends BaseComponent implements OnInit {
  productType = input.required<'car' | 'motor'>();
  private uniqueCodeBottomSheet = inject<any>(MAT_BOTTOM_SHEET_DATA);
  private sheetRef = inject(MatBottomSheetRef<VoucherInputComponent>);
  private voucherApiService: VoucherApiService | MotorApplicationFormApiService;
  private storeService: StoreService | MotorStoreService;

  private readonly carStoreService = inject(StoreService);
  private readonly motorStoreService = inject(MotorStoreService);
  private readonly carApplicationService = inject(VoucherApiService);
  private readonly motorApplicationService = inject(MotorApplicationFormApiService);

  protected readonly InsButtonSizeEnum = InsButtonSizeEnum;
  protected readonly InsButtonStyleEnum = InsButtonStyleEnum;

  showError = false;
  voucherInput = new FormControl(null,
    [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)]);

  errorMapper = signal<{ [key: string]: string }>({
    required: '',
    pattern: 'لطفاً حروف انگلیسی وارد کنید.',
    inValid: 'کد تخفیف وارد شده صحیح نیست.',
  });

  @HostListener('document:keydown.enter', ['$event'])
  onEnter(event: KeyboardEvent): void {
    event.preventDefault();
    this.handleClicked();
  }

  ngOnInit(): void {
    this.subScribeOnValueChanged();
    switch (this.uniqueCodeBottomSheet.data?.productType) {
      case 'car':
        this.voucherApiService = this.carApplicationService;
        this.storeService = this.carStoreService;
        break;
      case 'motor':
        this.voucherApiService = this.motorApplicationService;
        this.storeService = this.motorStoreService;
        break;
    }
  }

  handleClicked(): void {
    if (this.voucherInput.invalid) {
      this.showError = true;
      return;
    }

    super.addSubscription(this.voucherApiService.addVoucher(
      this.storeService.getFormId(),
      this.voucherInput.value,
      this.uniqueCodeBottomSheet.data?.ticketType
    ).subscribe({
      next: res => {
        if (res.success) {
          this.sheetRef.dismiss(res.success);
          return;
        }
        this.voucherInput.setErrors({inValid: true});
      }, error: err => {
        const errorKey = err?.error?.error?.key;
        if (errorKey) {
          this.errorMapper.update(prev => {
            return {...prev, [errorKey]: err.error.error.title};
          });
          this.voucherInput.setErrors({[errorKey]: true});
        } else {
          this.voucherInput.setErrors({inValid: true});
        }
      }
    }));
  }

  close(): void {
    this.sheetRef.dismiss();
  }

  subScribeOnValueChanged(): void {
    super.addSubscription(this.voucherInput.valueChanges.subscribe({
      next: () => {
        this.showError = true;
      }
    }));
  }

}
