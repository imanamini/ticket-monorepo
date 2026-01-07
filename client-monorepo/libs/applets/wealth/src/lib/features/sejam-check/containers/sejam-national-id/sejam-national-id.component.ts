import { ChangeDetectionStrategy, Component, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxButtonComponent } from '@digipay/ngx-button';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { HOME_ROUTE, SEJAM_ERROR_ROUTE, SEJAM_SUCCESS_ROUTE } from '../../../../data-access/constants/app-routes';
import { ProfileService } from '../../../../components/core/services/profile.service';
import { UserInfoModel } from '../../../user-profile/models/user-info.model';
import { FormErrorStatus } from '../../../../data-access/models/form-error-status.model';
import { MaknaAuthenticationService } from '../../../makna-authentication/services/makna-authentication.service';
import { validateNationalId } from '../../../../components/utils/strings';
import { FormOutputModel } from '../../../makna-authentication/components/national-id/model/form-output.model';
import { ErrorCodes } from '../../../../data-access/enums/error-codes';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { MessageService } from '@client-monorepo/common/utilities';

@Component({
  selector: 'wealth-applet-sejam-national-id',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent, ReactiveFormsModule, NgxAppBarComponent, UiFormFieldBuilderModule],
  templateUrl: './sejam-national-id.component.html',
  styleUrl: './sejam-national-id.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SejamNationalIdComponent implements OnInit {
  navigationService = inject(WealthNavigationService);
  profileService = inject(ProfileService);
  maknaAuthService = inject(MaknaAuthenticationService);
  formBuilder = inject(FormBuilder);
  ms = inject(MessageService);
  user = signal<UserInfoModel>(null);
  form: FormGroup;
  nationalIdNotMatchError = false;
  showError: FormErrorStatus = 'hidden';
  errorMessage = '';
  isLoading = signal(false);
  isInputDisabled = signal(false);
  @Output() formValidation: EventEmitter<FormOutputModel> = new EventEmitter<FormOutputModel>();

  constructor() {
    this.form = this.formBuilder.group({
      nationalId: ['', [Validators.required, this.nationalIdValidator, Validators.minLength(10)]],
    });
  }

  ngOnInit(): void {
    this.profileService.getProfile().subscribe((res) => {
      if (res?.success) {
        this.user.set(res.result);
        if (res.result.nationalId) {
          this.form.setValue({ nationalId: this.user().nationalId });
          this.isInputDisabled.set(true);
        }
      }
    });
  }
  nationalIdChanged(): void {
    this.nationalIdNotMatchError = false;
  }

  onBackHandler() {
    this.navigationService.navigate([HOME_ROUTE]);
  }

  async onNationalCodeSubmit() {
    if (this.user()?.nationalId) {
      this.confirmSejami();
    } else {
      if (this.form.valid) {
        this.maknaAuthService.confirmNationalId(this.form.controls['nationalId']?.value).subscribe(
          (res) => {
            if (res?.success) {
              this.confirmSejami();
            } else {
              this.handleConfirmNationalIdErrors(res);
            }
          },
          (err) => {
            this.handleConfirmNationalIdErrors(err);
          },
        );
      } else {
        this.formValidation.emit({
          value: this.form.controls['nationalId']?.value,
          isValid: this.form.valid,
        });
        this.showError = 'show';
      }
    }
  }

  private nationalIdValidator(control: AbstractControl): {
    [s: string]: boolean;
  } {
    if (validateNationalId(control.value)) {
      return null;
    }
    return { invalidNotionalCode: true };
  }

  private confirmSejami() {
    this.maknaAuthService.confirmSejami(this.user().nationalId).subscribe(
      (res) => {
        if (res.result) {
          this.navigationService.navigateWithState([SEJAM_SUCCESS_ROUTE], {
            state: { hasAccess: true, prevRoute: 'nationalIdCheck' },
          });
        } else {
          //
          this.navigationService.navigate([SEJAM_ERROR_ROUTE]);
        }
      },
      (err) => {
        this.ms.showErrorMessage(err.error.title);
      },
    );
  }
  private handleConfirmNationalIdErrors(res) {
    if (res?.error?.code === ErrorCodes.NationalIdAlreadyExistWithDiffPhoneNumber) {
      this.ms.showErrorMessage(this.fixPhoneMessage(res.error.title));
    } else if (res?.error?.code === ErrorCodes.KYCShahkarFailed) {
      this.ms.showErrorMessage('اطلاعات ورودی اشتباه است.');
    } else if (res?.error?.code === ErrorCodes.kYCShahkarCellNumberMissmatchNationalId) {
      this.ms.showErrorMessage(`کد ملی موجود در حساب کاربری شما متعلق به مالک شماره ${this.user().phoneNumber} نیست.`);
    } else if (res?.error?.code == ErrorCodes.RateLimited || res?.error?.code == ErrorCodes.UserIsLockedOut) {
      this.ms.showErrorMessage('درخواست شما بیش از حد مجاز است. لطفا دقایقی صبر کنید.');
    } else {
      this.ms.showErrorMessage(res.error.title);
    }
  }

  private fixPhoneMessage(message = '') {
    const regex = /09\d*\*{5}\d{2}/;
    if (regex.test(message)) {
      message = message.replace(regex, (match) => {
        const splitedNumber = match.split('*****');
        return splitedNumber[1] + '*****' + splitedNumber[0];
      });
    }
    return message;
  }
}
