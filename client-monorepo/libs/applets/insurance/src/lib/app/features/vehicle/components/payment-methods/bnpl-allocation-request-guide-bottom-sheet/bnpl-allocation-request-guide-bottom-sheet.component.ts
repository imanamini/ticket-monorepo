import { Component, inject, OnInit, signal } from '@angular/core';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { NgxButtonComponent } from '@digipay/ngx-button';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule, ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import moment from 'jalali-moment';
import { NgxFormValidator } from '@digipay/ngx-form-validator';
import { BottomSheetService } from '../../../../../data-access/services/bottom-sheet.service';

@Component({
  selector: 'bnpl-allocation-request-guide-bottom-sheet',
  standalone: true,
  imports: [
    UiFormFieldBuilderModule,
    NgxButtonComponent,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './bnpl-allocation-request-guide-bottom-sheet.component.html',
  styleUrl: './bnpl-allocation-request-guide-bottom-sheet.component.scss'
})
export class BnplAllocationRequestGuideBottomSheetComponent implements OnInit {
  errorMapper = signal<{ [key: string]: string }>({
    required: '',
    minlength: 'تعداد ارقام کد ملی ۱۰ رقم می باشد.',
    maxlength: 'تعداد ارقام کد ملی ۱۰ رقم می باشد.',
    invalidNotionalCode: 'کدملی وارد شده معتبر نیست.',
    invalidBirthDate: 'سن مالک خودرو باید بالای ۱۸ سال باشد.'
  });
  form = signal<FormGroup>(null);
  showError = signal<boolean>(false);
  showErrors = signal<{ [key: string]: boolean }>({
    nationalCode: false,
    birthDate: false,
  });
  showHintStar = signal<{ [key: string]: boolean }>({
    nationalCode: false,
    birthDate: false,
  });
  currentDate = signal<number>(Date.now());
  minBirthDate = signal<number>(moment().subtract('18', 'year').valueOf());

  fb = inject(FormBuilder);
  private bottomSheetService = inject(BottomSheetService);

  ngOnInit(): void {
    this.initializeForm();
    this.subscribeOnFormChanges();
  }

  initializeForm(): void {
    this.form.set(this.fb.group({
      nationalCode: ['', [Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        NgxFormValidator.nationalCodeValidator()]],
      birthDate: ['', [Validators.required, this.birthDateValidator()]],
    }));
  }

  birthDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value: number = control.value;

      if (!value) {
        return null;
      }

      if (value <= this.minBirthDate()) {
        return null;
      }

      return {invalidBirthDate: true};
    };
  }

  subscribeOnFormChanges(): void {
    this.form()?.controls?.nationalCode?.valueChanges.subscribe({
      next: (value) => {
        this.showErrors().nationalCode = false;
        this.showHintStar().nationalCode = value.length > 0;
      }
    });

    this.form()?.controls?.birthDate?.valueChanges.subscribe({
      next: (value) => {
        this.showErrors().birthDate = false;
        this.showHintStar().birthDate = value.length > 0;
      }
    });
  }

  confirm(): void {
    if (this.form().invalid) {
      this.showError.set(true);
      this.showErrors().nationalCode = this.form().controls.nationalCode.invalid;
      this.showErrors().birthDate = this.form().controls.birthDate.invalid;
      return;
    }
    this.showError.set(false);
    this.bottomSheetService.closeCurrentBottomSheet({
      nationalCode: this.form().controls.nationalCode.value,
      birthDate: this.form().controls.birthDate.value,
    });
  }

  cancel(): void {
    this.bottomSheetService.closeCurrentBottomSheet();
  }
}
