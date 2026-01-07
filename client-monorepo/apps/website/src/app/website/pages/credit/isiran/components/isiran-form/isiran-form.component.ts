import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ValidateCellNum } from '../../../../../../core/validators/cell-num.validator';
import { convertNonEnglishDigits } from '@digipay/strings';
import { NationalIdValidator, validateNationalCode } from '../../../../../../core/validators/national-id.validator';
import { IsiranTemplateDataSectionForm } from '../../../../../../api/clients/models/templates/isiran/isiran-template-data';
import { environment } from '../../../../../../../environments/environment';
import moment from 'jalali-moment';
import { DialogBottomSheetService } from '../../../../../../core/services/dialog-bottom-sheet.service';
import { IsiranConfirmDialogComponent } from '../isiran-confirm-dialog/isiran-confirm-dialog.component';
import { Subscription } from 'rxjs';
import { UiButtonComponent } from '../../../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { UiSectionComponent } from '../../../../../../ui/ui-components/ui-section/ui-section/ui-section.component';
import { isPlatformBrowser, NgIf } from '@angular/common';

@Component({
  selector: 'app-isiran-form',
  templateUrl: './isiran-form.component.html',
  styleUrls: ['./isiran-form.component.scss'],
  standalone: true,
  imports: [NgIf, UiSectionComponent, ReactiveFormsModule, UiFormFieldBuilderModule, UiButtonComponent],
})
export class IsiranFormComponent implements OnInit {
  @Input() data!: IsiranTemplateDataSectionForm;

  parentErrors: {
    nationalCode?: string;
    birthDate?: string;
  } = {};

  minBirthDate = moment().subtract('70', 'year').valueOf();

  maxBirthDate = moment().subtract('18', 'year').valueOf();

  form: UntypedFormGroup;

  textFieldHasError = false;

  textFieldFocused = false;

  cellNumberValidationRules = [Validators.required, Validators.pattern(/^0/), ValidateCellNum];

  nationalIdValidation = [Validators.required, NationalIdValidator];

  sub: Subscription;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private dialog: DialogBottomSheetService,
    @Inject(PLATFORM_ID) public platformId: string,
  ) {
    this.clearCellNumber();

    this.form?.valueChanges.subscribe((data) => {
      if (Number.isInteger(data.cellNumber)) {
        let val = String(data.cellNumber);
        if (!val.match(/^0/)) {
          val = '0' + val;
        }
        this.form.controls['cellNumber'].setValue(val, {
          emitEvent: false,
        });
        this.checkTextFieldErrors();
      } else {
        this.form.controls['cellNumber'].setValue(convertNonEnglishDigits(data.cellNumber), {
          emitEvent: false,
        });
        this.checkTextFieldErrors();
      }
    });
  }

  ngOnInit(): void {
    this.makeForm();
  }

  cellNumberValidator(control: AbstractControl): {
    [s: string]: boolean;
  } {
    if (!ValidateCellNum(control)) {
      return null;
    }
    return { invalidCellNumber: true };
  }

  birthDateValidator(control: AbstractControl): {
    [s: string]: boolean;
  } {
    const birthDate = control.value;
    if (!birthDate) {
      return null;
    }
    if (birthDate < this.minBirthDate || birthDate > this.maxBirthDate) {
      return { invalidBirthDate: true };
    }
    return null;
  }

  nationalCodeValidator(control: AbstractControl): {
    [s: string]: boolean;
  } {
    if (validateNationalCode(control.value)) {
      return null;
    }
    return { invalidNationalCode: true };
  }

  parentErrorValidator(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors => {
      if (this.parentErrors && this.parentErrors[formControlName]) {
        return { parentError: true };
      }
      return null;
    };
  }

  checkTextFieldErrors() {
    const ctrl = this.form.controls['cellNumber'];
    let val = false;
    if (ctrl.hasError('pattern') && ctrl.touched) {
      val = true;
    }
    if (ctrl.hasError('cellNumber') && ctrl.touched && !this.textFieldFocused) {
      val = true;
    }
    this.textFieldHasError = val;
  }

  clearCellNumber() {
    if (isPlatformBrowser(this.platformId)) {
      this.form = this.formBuilder.group({
        cellNumber: ['', this.cellNumberValidationRules],
        nationalCode: ['', this.nationalIdValidation],
      });
    }
  }

  openConfirmDialog() {
    this.dialog.open(IsiranConfirmDialogComponent, {
      width: 420,
      fullHeightBottomSheet: true,
    });
    this.sub = this.dialog.afterCloseData.subscribe((response) => {
      if (response === true) this.onSubmit();
    });
  }

  onSubmit() {
    this.sub.unsubscribe();
    if ((environment.name === 'staging' || environment.name === 'dev') && isPlatformBrowser(this.platformId)) {
      window.location.href = `${environment.appUrl}/service/credit/pre-register/underwriter?utm_source=website&utm_medium=isiran&nationalCode=${this.form.value.nationalCode}&birthDate=${this.form.value.birthDate}&org=${this.data.org}&profile=ba391bd0-13cb-46aa-9674-73ac8afec390&cellNumber=${this.form.value.cellNumber}&fpId=${this.data.fpId}`
    } else if (environment.name === 'production' && isPlatformBrowser(this.platformId)) {
      window.location.href = `${environment.appUrl}/service/credit/pre-register/underwriter?utm_source=website&utm_medium=isiran&nationalCode=${this.form.value.nationalCode}&birthDate=${this.form.value.birthDate}&org=${this.data.org}&profile=ba391bd0-13cb-46aa-9674-73ac8afec390&cellNumber=${this.form.value.cellNumber}&fpId=${this.data.fpId}`
    }
  }

  private makeForm() {
    if (isPlatformBrowser(this.platformId)) {
      this.form = this.formBuilder.group({
        cellNumber: ['', [Validators.required, this.cellNumberValidator]],
        birthDate: [null, [Validators.required, this.birthDateValidator.bind(this), this.parentErrorValidator('birthDate').bind(this)]],
        nationalCode: [null, [Validators.required, this.nationalCodeValidator, this.parentErrorValidator('nationalCode').bind(this)]],
      });
      for (const i in this.form.controls) {
        if (Object.prototype.hasOwnProperty.call(this.form.controls, i)) {
          this.form.controls[i]?.valueChanges.subscribe((res) => {
            if (this.parentErrors[i]) {
              delete this.parentErrors[i];
            }
          });
        }
      }
    }
  }
}
