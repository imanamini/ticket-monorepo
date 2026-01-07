import { Component, inject, signal } from '@angular/core';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { InsButtonComponent } from '../../../../components/ins-button/ins-button.component';
import { InsButtonSizeEnum } from '../../../../data-access/enums/ins-button-size.enum';
import { InsButtonStyleEnum } from '../../../../data-access/enums/ins-button-style.enum';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { ApplicationFormService } from '../../../floki/services/application-form.service';
import { MessageService } from '@client-monorepo/common/utilities';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseComponent } from '../../../../components/base/base.component';
import { HouseIncidentsApiService } from '../../data-access/services/house-incidents-api.service';
import { HouseIncidentsDataStorageService } from '../../data-access/services/house-incidents-data-storage.service';
import { BottomSheetService } from '../../../../data-access/services/bottom-sheet.service';

@Component({
  selector: 'add-voucher-bottom-sheet',
  standalone: true,
  imports: [
    UiFormFieldBuilderModule,
    InsButtonComponent,
    NgxButtonComponent,
    ReactiveFormsModule
  ],
  templateUrl: './add-voucher-bottom-sheet.component.html',
  styleUrl: './add-voucher-bottom-sheet.component.scss'
})
export class AddVoucherBottomSheetComponent extends BaseComponent {

  protected readonly InsButtonSizeEnum = InsButtonSizeEnum;
  protected readonly InsButtonStyleEnum = InsButtonStyleEnum;
  public isSubmitting = signal<boolean>(false);

  houseIncidentsApiService = inject(HouseIncidentsApiService);
  houseIncidentsDataStorageService = inject(HouseIncidentsDataStorageService);
  bottomSheetService = inject(BottomSheetService);
  applicationFormService = inject(ApplicationFormService);
  bottomSheetData = inject(MAT_BOTTOM_SHEET_DATA);
  messageService = inject(MessageService);
  voucherInput = new FormControl(null,
    [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)]);
  showError = false;
  errorMapper = signal<{ [key: string]: string }>({
    required: '',
    pattern: 'لطفاً حروف انگلیسی وارد کنید.',
    inValid: 'کد تخفیف وارد شده صحیح نیست.',
  });

  closeDialog(): void {
    this.bottomSheetService.closeCurrentBottomSheet();
  }

  submitVoucher(): void {
    this.isSubmitting.set(true);
    if (this.voucherInput.invalid) {
      this.showError = true;
      this.isSubmitting.set(false);
      return;
    }
    const appId = this.houseIncidentsDataStorageService.getApplicationFormId();
    super.addSubscription(this.houseIncidentsApiService.addVoucher(
      appId,
      this.voucherInput.value
    ).subscribe({
      next: res => {
        if (res.success) {
          this.houseIncidentsApiService.getPolicyUserInfo(appId).subscribe({
            next: res => {
              this.bottomSheetService.closeCurrentBottomSheet(res.result);
            }
          });
          return;
        }
        this.voucherInput.setErrors({inValid: true});
      }, error: err => {
        this.isSubmitting.set(false);
        const errorKey = err.error.error.key;
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
}
