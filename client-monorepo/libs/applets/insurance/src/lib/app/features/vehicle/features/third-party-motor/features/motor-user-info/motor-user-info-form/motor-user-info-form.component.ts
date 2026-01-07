import { Component, effect, input, model, OnInit, signal, untracked } from '@angular/core';
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
import moment from 'jalali-moment';
import { ThirdPartyMotorDirective } from '../../../directives/third-party-motor.directive';
import { FormControlItemModel } from '../../../../../data-access/models/form-control-item.model';
import { NgxPlateComponent } from '@digipay/ngx-plate';
import { MotorPlatePatternChecker } from '../../../../../util/plate-pattern-checker';
import { UserInfoMotorModel } from '../../../../../data-access/models/application-form/user-info.model';
import { NoWhitespaceOnlyValidator } from '../../../../../../../util/no-white-space-only-validator';
import { FaEnNumberTextPattern } from '../../../../../../../util/patterns';

@Component({
  selector: 'motor-user-info-form',
  standalone: true,
  imports: [
    UiFormFieldBuilderModule,
    ReactiveFormsModule,
    NgxPlateComponent
  ],
  templateUrl: './motor-user-info-form.component.html',
  styleUrl: './motor-user-info-form.component.scss'
})
export class MotorUserInfoFormComponent extends ThirdPartyMotorDirective implements OnInit {
  userInfoForm = input.required<FormGroup>();
  showError = model<boolean>(false);
  userInfo = input<UserInfoMotorModel>();
  currentDate = signal<number>(Date.now());
  plate = signal('');
  plateError = signal('');
  showPlateError = signal(false);
  showErrors = signal({
    firstName: false,
    lastName: false,
    nationalCode: false,
    birthDate: false,
    mobile: false
  });
  errorMapper = signal<{ [key: string]: string }>({
    required: '',
    minlength: 'تعداد ارقام کد ملی ۱۰ رقم می باشد.',
    maxlength: 'تعداد ارقام کد ملی ۱۰ رقم می باشد.',
    invalidNotionalCode: 'کدملی وارد شده معتبر نیست.',
    pattern: 'لطفا این فیلد را با دقت پر کنید.',
    invalidBirthDate: 'سن مالک خودرو باید بالای ۱۸ سال باشد.',
    invalidCellNumber: 'شماره تلفن همراه وارد شده اشتباه است.'
  });
  private minBirthDate = moment().subtract('18', 'year').valueOf();
  private formControls: FormControlItemModel[] = [
    {
      name: 'firstName',
      disabled: false,
      validators: [
        Validators.required,
        NoWhitespaceOnlyValidator(),
        Validators.pattern(FaEnNumberTextPattern)
      ]
    },
    {
      name: 'lastName',
      disabled: false,
      validators: [Validators.required,
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
    },
    {
      name: 'license',
      disabled: false,
      validators: [Validators.required]
    }
  ];
  protected readonly Date = Date;

  constructor() {
    super();
    effect(() => {
      if (this.showError()) {
        if (this.plate() && !MotorPlatePatternChecker(this.plate())) {
          this.showPlateError.set(true);
          this.plateError.set('شماره پلاک اشتباه است');
        } else if (!this.plate()) {
          this.showPlateError.set(true);
          this.plateError.set('شماره پلاک را وارد کنید');
        } else {
          this.showPlateError.set(false);
          this.plateError.set('');
        }
      }
    }, {allowSignalWrites: true});

    effect(() => {
      if (this.userInfo()) {
        untracked(() => {
          this.userInfoForm()?.patchValue({
            license: this.userInfo().license,
            firstName: this.userInfo().firstName,
            lastName: this.userInfo().lastName,
            nationalCode: this.userInfo().nationalCode,
            birthDate: this.userInfo().birthDate,
            mobile: this.userInfo().mobile
          }, {onlySelf: true, emitEvent: false});
          this.plate.set(this.userInfo().license ?? '');
        });
        this.setNullAllErrors();
      }
    }, {allowSignalWrites: true});
  }

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
    this.showErrors.set({
      firstName: false,
      lastName: false,
      nationalCode: false,
      birthDate: false,
      mobile: false
    });
  }

  handlePlateChange(plate: string): void {
    this.plate.set(plate);
    this.showPlateError.set(false);
    this.plateError.set('');
    this.validatePlate();
  }

  handleIsPlateComplete(event: any): void {
    this.validatePlate();
  }

  private validatePlate(): void {
    this.showPlateError.set(false);
    this.plateError.set('');
    const isValidPlate = this.plate() && MotorPlatePatternChecker(this.plate());
    if (!isValidPlate) {
      this.showPlateError.set(true);
      if (!this.plate()) {
        this.plateError.set('شماره پلاک را وارد کنید');
      } else {
        this.plateError.set('شماره پلاک اشتباه است');
      }
      this.userInfoForm().get('license').setValue(null);
    } else {
      this.showPlateError.set(false);
      this.plateError.set('');
      this.userInfoForm().get('license').setValue(this.plate(), {emitEvent: false});
    }
  }

  protected onClose(): void {
  }

  protected onNext(route: string): void {
  }
}

