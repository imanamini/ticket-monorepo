import {Component, inject, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import moment from 'jalali-moment';
import {
  AbstractControl,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {NationalIdValidator, validateNationalCode} from '../../../../../../core/validators/national-id.validator';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {UiButtonComponent} from '../../../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import {UiFormFieldBuilderModule} from '@digipay/ui-form-field-builder';
import {isPlatformBrowser, NgIf} from '@angular/common';
import {UrlService} from "../../../../../services/url.service";

@Component({
  selector: 'app-working-capital-form',
  templateUrl: './working-capital-form.component.html',
  styleUrls: ['./working-capital-form.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, UiFormFieldBuilderModule, UiButtonComponent, NgIf],
})
export class WorkingCapitalFormComponent implements OnInit {
  parentErrors: {
    nationalCode?: string;
    birthDate?: string;
  } = {};

  minBirthDate = moment().subtract('70', 'year').valueOf();

  maxBirthDate = moment().subtract('18', 'year').valueOf();

  form: UntypedFormGroup;

  nationalIdValidation = [Validators.required, NationalIdValidator];

  sub: Subscription;

  urlService = inject(UrlService);

  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    @Inject(PLATFORM_ID) public platformId: string,
  ) {
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
      return {invalidBirthDate: true};
    }
    return null;
  }

  nationalCodeValidator(control: AbstractControl): {
    [s: string]: boolean;
  } {
    if (validateNationalCode(control.value)) {
      return null;
    }
    return {invalidNationalCode: true};
  }

  parentErrorValidator(formControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors => {
      if (this.parentErrors && this.parentErrors[formControlName]) {
        return {parentError: true};
      }
      return null;
    };
  }

  clearCellNumber() {
    if (isPlatformBrowser(this.platformId)) {
      this.form = this.formBuilder.group({
        nationalCode: ['', this.nationalIdValidation],
      });
    }
  }

  openConfirmDialog() {
    const currentRoute = this.router.url.slice(0, this.router.url.lastIndexOf('/') + 1);
    const detailPageUrl = `${currentRoute}?nationalCode=${this.form.value.nationalCode}&birthDate=${this.form.value.birthDate}`.slice(1);
    this.urlService.handleLink(detailPageUrl);
  }

  private makeForm() {
    if (isPlatformBrowser(this.platformId)) {
      this.form = this.formBuilder.group({
        birthDate: [null, [Validators.required, this.birthDateValidator.bind(this), this.parentErrorValidator('birthDate').bind(this)]],
        nationalCode: [null, [Validators.required, this.nationalCodeValidator, this.parentErrorValidator('nationalCode').bind(this)]],
      });
      for (const i in this.form.controls) {
        if (Object.prototype.hasOwnProperty.call(this.form.controls, i)) {
          this.form.controls[i].valueChanges.subscribe((res) => {
            if (this.parentErrors[i]) {
              delete this.parentErrors[i];
            }
          });
        }
      }
    }
  }
}
