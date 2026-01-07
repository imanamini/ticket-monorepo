import { Component, inject, OnInit, signal } from '@angular/core';
import { PolicyApiService } from '../../../../../../data-access/services/policy/policy-api.service';
import { MessageService } from '@client-monorepo/common/utilities';
import { FormFieldComponent } from '@digipay/ui-form-field-builder';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InsButtonComponent } from '../../../../../../components/ins-button/ins-button.component';
import { InsAlertComponent } from '../../../../../../components/ins-alert/ins-alert.component';
import { InsButtonSizeEnum } from '../../../../../../data-access/enums/ins-button-size.enum';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { BottomSheetService } from '../../../../../../data-access/services/bottom-sheet.service';
import { PolicyModel } from '../../../../../equipment/api/models/policy/policy.model';
import { EquipmentProductCategoryEnum } from '../../../../../../data-access/enums/equipment-product-category.enum';

@Component({
  selector: 'equipment-activate-bundle-bottom-sheet',
  standalone: true,
  imports: [FormFieldComponent, FormsModule, InsButtonComponent, InsAlertComponent, ReactiveFormsModule],
  templateUrl: './equipment-activate-bundle-bottom-sheet.component.html',
  styleUrl: './equipment-activate-bundle-bottom-sheet.component.scss',
})
export class EquipmentActivateBundleBottomSheetComponent implements OnInit {
  protected readonly InsButtonSizeEnum = InsButtonSizeEnum;

  serialNumberForm: FormGroup;
  errorMessageMapper = {
    required: 'وارد کردن این فیلد الزامی است',
    pattern: 'لطفا فقط از اعداد و حروف استفاده کنید',
    minlength: 'شماره سریال باید حداقل 5 کاراکتر باشد',
    maxlength: 'شماره سریال باید حداکثر 20 کاراکتر باشد',
  };
  showError = signal<boolean>(false);
  private policyService = inject(PolicyApiService);
  private messageService = inject(MessageService);
  private fb = inject(FormBuilder);
  private bottomSheetData = inject<{ data: PolicyModel }>(MAT_BOTTOM_SHEET_DATA);
  private bottomSheetService = inject(BottomSheetService);

  ngOnInit(): void {
    this.updatePatternErrorMessages();
    this.initializeForm();
  }

  initializeForm(): void {
    this.serialNumberForm = this.fb.group({
      serialNumber: [
        '',
        [Validators.required, Validators.pattern(this.getSerialNumberPattern()), Validators.minLength(5), Validators.maxLength(20)],
      ],
    });
  }

  updatePatternErrorMessages(): void {
    switch (this.bottomSheetData.data.electronicEquipment.category) {
      case EquipmentProductCategoryEnum.MOBILE:
        this.errorMessageMapper.pattern = 'لطفا فقط از اعداد استفاده کنید';
        break;
      case EquipmentProductCategoryEnum.HOMEAPPLIANCE:
      case EquipmentProductCategoryEnum.LAPTOP:
      case EquipmentProductCategoryEnum.TABLET:
      case EquipmentProductCategoryEnum.GAMECONSOLE:
      case EquipmentProductCategoryEnum.GAME_CONSOLE:
      default:
        this.errorMessageMapper.pattern = 'لطفا فقط از اعداد و حروف استفاده کنید';
        break;
    }
  }

  getSerialNumberPattern(): string {
    if (this.bottomSheetData.data.electronicEquipment.category === EquipmentProductCategoryEnum.MOBILE) {
      return '^[0-9]+$';
    }
    return '^[A-Za-z0-9]+$';
  }

  registerDeviceNumber(): void {
    if (this.serialNumberForm.invalid) {
      this.showError.set(true);
      return;
    }
    const serialNumber = this.serialNumberForm.get('serialNumber')?.value;
    this.policyService.policyActivate(this.bottomSheetData.data.policyDraftNo, serialNumber).subscribe({
      next: (res) => {
        this.messageService.showApiSuccess(res);
        this.bottomSheetService.closeCurrentBottomSheet(true);
      },
      error: (error) => {
        this.messageService.showErrorIfExists(error);
      },
    });
  }
}
