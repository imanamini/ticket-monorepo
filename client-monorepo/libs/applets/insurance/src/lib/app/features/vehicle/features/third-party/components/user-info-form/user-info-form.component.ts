import {
  Component,
  effect,
  input,
  model,
  OnInit,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { NgxFormValidator } from '@digipay/ngx-form-validator';

import { BaseComponent } from '../../../../../../components/base/base.component';
import { FormControlItemModel } from '../../../../data-access/models/form-control-item.model';
import moment from 'jalali-moment';
import { UserInfoModel } from '../../../../data-access/models/application-form/user-info.model';
import { NoWhitespaceOnlyValidator } from '../../../../../../util/no-white-space-only-validator';
import { FaEnNumberTextPattern } from '../../../../../../util/patterns';

@Component({
  selector: 'user-info-form',
  standalone: true,
  imports: [
    UiFormFieldBuilderModule,
    ReactiveFormsModule
  ],
  templateUrl: './user-info-form.component.html',
  styleUrl: './user-info-form.component.scss'
})
export class UserInfoFormComponent extends BaseComponent implements OnInit {

  constructor() {
    super();
    effect(() => {
      if (this.userInfo()) {
        setTimeout(() => {
          this.userInfoForm().setValue({
            firstName: this.userInfo()?.firstName,
            lastName: this.userInfo()?.lastName,
            nationalCode: this.userInfo()?.nationalCode,
            birthDate: this.userInfo()?.birthDate,
            mobile: this.userInfo()?.mobile
          }, {onlySelf: true, emitEvent: false});
        }, 0);
        this.setNullAllErrors();
      }
    });
  }

  userInfoForm = input.required<FormGroup>();
  showError = model<boolean>(false);
  userInfo = input<UserInfoModel>();
  currentDate = signal<number>(Date.now());
  minBirthDate = moment().subtract('18', 'year').valueOf();

  showErrors = {
    firstName: false,
    lastName: false,
    nationalCode: false,
    birthDate: false,
    mobile: false
  };
  formControls: FormControlItemModel[] = [
    {
      name: 'firstName',
      disabled: false,
      validators: [
        Validators.required,
        NoWhitespaceOnlyValidator(),
        Validators.pattern(FaEnNumberTextPattern)],

    },
    {
      name: 'lastName',
      disabled: false,
      validators: [
        Validators.required,
        NoWhitespaceOnlyValidator(),
        Validators.pattern(FaEnNumberTextPattern)
      ]
    },
    {
      name: 'nationalCode',
      disabled: false,
      validators: [Validators.minLength(10), Validators.maxLength(10), NgxFormValidator.nationalCodeValidator()]
    },
    {
      name: 'mobile',
      disabled: false,
      validators: [NgxFormValidator.cellNumberValidator()]
    },
    {
      name: 'birthDate',
      disabled: false,
      validators: [this.birthDateValidator()]
    }
  ];

  errorMapper: { [key: string]: string } = {
    required: '',
    minlength: 'تعداد ارقام کد ملی ۱۰ رقم می باشد.',
    maxlength: 'تعداد ارقام کد ملی ۱۰ رقم می باشد.',
    invalidNotionalCode: 'کدملی وارد شده معتبر نیست.',
    pattern: 'لطفا این فیلد را با دقت پر کنید.',
    invalidBirthDate: 'سن مالک خودرو باید بالای ۱۸ سال باشد.',
    invalidCellNumber: 'شماره تلفن همراه وارد شده اشتباه است.'
  };

  protected readonly Date = Date;

  ngOnInit(): void {
    this.setFormControls();
    this.subscribeOnFormChanges();
  }

  setFormControls(): void {
    this.formControls.forEach(item => {
      this.userInfoForm()?.setControl(item.name, new FormControl({
        value: null,
        disabled: item.disabled
      }, [Validators.required, ...item.validators]));
    });
  }

  birthDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value: number = control.value;

      if (!value || value <= this.minBirthDate) {
        return null;
      }

      return {invalidBirthDate: true};
    };
  }

  subscribeOnFormChanges(): void {
    this.formControls.forEach(control => {
      super.addSubscription(this.userInfoForm()?.controls[control.name]?.valueChanges.subscribe({
        next: () => {
          this.showErrors[control.name] = true;
        }
      }));
    });
  }

  setNullAllErrors(): void {
    this.showErrors = {
      firstName: false,
      lastName: false,
      nationalCode: false,
      birthDate: false,
      mobile: false
    };
  }
}
