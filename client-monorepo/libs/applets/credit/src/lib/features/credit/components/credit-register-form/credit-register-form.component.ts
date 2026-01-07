import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  OnInit,
  output,
  signal,
  untracked,
} from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import moment from 'jalali-moment';
import { NgxFormValidator } from '@digipay/ngx-form-validator';
import { SERVICE_TYPE } from '../../data-access/models/credit/service-type/service-type.model';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';
import { CreditScrollableViewComponent } from '../credit-scrollable-view/credit-scrollable-view.component';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { NgxIcon } from '@digipay/ngx-icon';
import { BorderColorsEnum } from '@digipay/ngx-divider';

type formControlNames = 'nationalCode' | 'birthDate';

@Component({
  selector: 'app-credit-register-form',
  templateUrl: './credit-register-form.component.html',
  styleUrls: ['./credit-register-form.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PipesModule,
    NgxButtonComponent,
    NgxTrackableIdDirective,
    CreditScrollableViewComponent,
    UiFormFieldBuilderModule,
    NgxIcon,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditRegisterFormComponent implements OnInit {
  form!: FormGroup;
  minBirthDate = moment().subtract('70', 'year').valueOf();
  maxBirthDate = moment().subtract('18', 'year').valueOf();
  values = input<{ nationalCode: string | null; birthDate: number | null }>();
  ctaLoading = input<boolean>();
  ctaText = input('تایید مشخصات و ادامه');
  errors = input<{ nationalCode?: string; birthDate?: string }>();
  parentErrors = signal<{ nationalCode?: string; birthDate?: string }>({});
  cellNumber = input('');
  editable = input<{
    birthDate?: boolean;
    nationalCode?: boolean;
  }>();
  title = input<string>();
  submit = output<{ nationalCode: string; birthDate: number }>();
  serviceType = input<SERVICE_TYPE>();
  customDateRange = computed<[number, number] | undefined>(() => {
    if (this.serviceType() !== SERVICE_TYPE.BNPL) {
      return [this.minBirthDate, this.maxBirthDate];
    } else return undefined;
  });

  formBuilder = inject(FormBuilder);
  cdr = inject(ChangeDetectorRef);
  destroyRef = inject(DestroyRef);
  private destroyed = false;

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.destroyed = true;
    });

    effect(() => {
      const errors = this.errors();
      untracked(() => {
        if (!this.destroyed) {
          this.parentErrors.set(errors || {});
          for (const controlName in this.form?.controls) {
            this.updateValidators(controlName as formControlNames);
          }
        }
      });
    });
  }

  ngOnInit() {
    this.makeForm(this.values()?.birthDate, this.values()?.nationalCode);
    this.formValueChanges();
    setTimeout(() => {
      if (!this.destroyed) {
        this.cdr.detectChanges();
      }
    }, 1000);
  }

  birthDateValidator(control: AbstractControl): { [p: string]: boolean } | null {
    const birthDate = control.value;
    if (!birthDate || this.serviceType() === SERVICE_TYPE.BNPL) {
      return null;
    }
    if (birthDate < this.minBirthDate || birthDate > this.maxBirthDate) {
      return { invalidBirthDate: true };
    }
    return null;
  }

  parentErrorValidator(formControlName: formControlNames): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (this.parentErrors() && this.parentErrors()[formControlName]) {
        return { parentError: true };
      }
      return null;
    };
  }

  submitForm() {
    if (this.form.valid && !this.destroyed) {
      this.submit.emit(this.form.value);
    }
  }

  private makeForm(birthDate: any, nationalCode: any) {
    this.form = this.formBuilder.group({
      birthDate: [birthDate || null],
      nationalCode: [nationalCode || null],
    });
    for (const controlName in this.form.controls) {
      this.updateValidators(controlName as formControlNames);
    }
  }

  private formValueChanges() {
    for (const controlName in this.form.controls) {
      if (this.form.controls.hasOwnProperty(controlName)) {
        const control = this.form.controls[controlName];
        control.valueChanges.subscribe(() => {
          if (this.destroyed) return;

          const controlKey = controlName as formControlNames;
          const currentErrors = this.parentErrors();
          if (currentErrors[controlKey]) {
            const newErrors = { ...currentErrors };
            delete newErrors[controlKey];
            this.parentErrors.set(newErrors);
            this.updateValidators(controlKey);
          }
          setTimeout(() => {
            if (!this.destroyed) {
              this.cdr.detectChanges();
            }
          });
        });
      }
    }
  }

  private updateValidators(controlName: formControlNames) {
    if (!this.form) return; // Guard against undefined form
    const currentControl = this.form.get(controlName);
    if (currentControl) {
      currentControl.clearValidators();
      if (controlName === 'birthDate') {
        currentControl.setValidators([
          Validators.required,
          this.birthDateValidator.bind(this),
          this.parentErrorValidator(controlName).bind(this),
        ]);
      } else if (controlName === 'nationalCode') {
        currentControl.setValidators([
          Validators.required,
          NgxFormValidator.nationalCodeValidator(),
          this.parentErrorValidator(controlName).bind(this),
        ]);
      }
      currentControl.updateValueAndValidity();
    }
  }

  protected readonly BorderColorsEnum = BorderColorsEnum;
}
