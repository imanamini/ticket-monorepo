import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { NationalIdValidator, validateNationalCode } from '../../../../../../core/validators/national-id.validator';
import { Subscription } from 'rxjs';
import { ValidateCellNum } from '../../../../../../core/validators/cell-num.validator';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { KybApiService } from '../../services/kyb-api.service';
import { WorkingCapitalKybOtpComponent } from '../working-capital-kyb-otp/working-capital-kyb-otp.component';
import { DialogBottomSheetService } from '../../../../../../core/services/dialog-bottom-sheet.service';
import { ERROR } from '../../models/error.enum';
import { NgxButtonComponent } from '@digipay/ngx-button';
import moment from 'jalali-moment';
import { isValidIBANNumber } from '../../../../../../ui/ui-components/form-field-builder/utils/strings';
import { MessageService } from '@client-monorepo/common/utilities';

@Component({
  selector: 'app-working-capital-kyb-form',
  templateUrl: './working-capital-kyb-form.component.html',
  standalone: true,
  imports: [UiFormFieldBuilderModule, ReactiveFormsModule, NgxButtonComponent],
  styleUrls: ['./working-capital-kyb-form.component.scss'],
})
export class WorkingCapitalKybFormComponent implements OnInit {
  parentErrors: {
    nationalCode?: string;
    cellNumber?: string;
    birthDate?: string;
  } = {};
  ibanServerErrorMessage = '';
  invalidIbans: string[] = [];

  minBirthDate = moment().subtract('70', 'year').valueOf();

  maxBirthDate = moment().subtract('18', 'year').valueOf();

  form: UntypedFormGroup;

  nationalIdValidation = [Validators.required, NationalIdValidator];

  cellNumberValidationRules = [Validators.required, Validators.pattern(/^0/), ValidateCellNum];

  sub: Subscription;

  @Output() state = new EventEmitter();

  private api = inject(KybApiService);
  private dialog = inject(DialogBottomSheetService);
  private formBuilder = inject(UntypedFormBuilder);
  private messageService = inject(MessageService);

  constructor() {
    this.clearCellNumber();
  }

  ngOnInit(): void {
    this.makeForm();
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

  clearCellNumber() {
    this.form = this.formBuilder.group({
      cellNumber: ['', this.cellNumberValidationRules],
      nationalCode: ['', this.nationalIdValidation],
    });
  }

  openConfirmDialog(trackingCode: string, formData) {
    this.dialog
      .open(WorkingCapitalKybOtpComponent, {
        trackingCode: trackingCode,
        cellNumber: this.form.controls['cellNumber'].value,
        formData,
      })
      .then((result) => {
        if (result.retry) {
          this.submit();
        }
        if (result.success) {
          this.state.emit('IN_PROGRESS');
        }
      });
  }

  submit() {
    const birthDateTimeStamp = this.form.value.birthDate;
    const formData = {
      ...this.form.value,
      birthDate: moment(birthDateTimeStamp).locale('fa').format('YYYY/MM/DD'),
    };
    this.api.checkICS(formData).subscribe({
      next: (data: any) => {
        if (data.trackingCode) {
          this.openConfirmDialog(data.trackingCode, formData);
        }
      },
      error: (error) => {
        const waiting =
          error.error.result.status === ERROR.CREDIT_SCORE_ICS_NATIONAL_CODE_VALIDATION_COUNT_EXCEED ||
          error.error.result.status === ERROR.CREDIT_SCORE_EXISTS_IN_PROGRESS_ICS_SCORE;
        if (waiting) {
          this.state.emit('IN_PROGRESS');
        } else {
          this.messageService.showErrorOfErrorResponse(error.error);
        }
      },
    });
  }

  cellNumberValidator(control: AbstractControl): {
    [s: string]: boolean;
  } {
    if (!ValidateCellNum(control)) {
      return null;
    }
    return { invalidCellNumber: true };
  }

  ibanChecksumValidator(control: FormControl): { [p: string]: boolean } | null {
    if (isValidIBANNumber(this.cleanIban(control.value))) {
      return null;
    }
    return { invalidIban: true };
  }

  serverIbanValidator(control: FormControl): { [p: string]: boolean } | null {
    if (this.invalidIbans.indexOf(this.cleanIban(control.value)) < 0) {
      return null;
    }
    return { serverError: true };
  }

  private cleanIban(value: string) {
    if (!value) {
      return value;
    }
    return value.replace('-', '').replace(/\s/gi, '');
  }

  private makeForm() {
    this.form = this.formBuilder.group({
      birthDate: [null, [Validators.required, this.birthDateValidator.bind(this), this.parentErrorValidator('birthDate').bind(this)]],
      nationalCode: [null, [Validators.required, this.nationalCodeValidator, this.parentErrorValidator('nationalCode').bind(this)]],
      cellNumber: ['', [Validators.required, this.cellNumberValidator]],
      iban: [
        null,
        [Validators.required, Validators.pattern(/IR\d{24}$/i), this.serverIbanValidator.bind(this), this.ibanChecksumValidator.bind(this)],
      ],
    });
    for (const i in this.form.controls) {
      if (this.form.controls.hasOwnProperty(i)) {
        this.form.controls[i].valueChanges.subscribe((res) => {
          if (this.parentErrors[i]) {
            delete this.parentErrors[i];
          }
        });
      }
    }
  }
}
