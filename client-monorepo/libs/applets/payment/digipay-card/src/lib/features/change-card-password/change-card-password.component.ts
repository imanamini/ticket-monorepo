import { ChangeDetectionStrategy, Component, effect, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { MessageService } from '@client-monorepo/common/utilities';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { OtpVerificationComponent } from '../../components/otp-verification/otp-verification.component';
import { ActivatedRoute, Router } from '@angular/router';
import { passwordMatchValidatorFactory } from '../../data-access/utils/password-match.validator';

@Component({
  selector: 'digipay-card-applet-change-card-password',
  standalone: true,
  imports: [CommonModule, PageLayoutComponent, FormsModule, ReactiveFormsModule, NgxButtonComponent, UiFormFieldBuilderModule],
  templateUrl: './change-card-password.component.html',
  styleUrl: './change-card-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangeCardPasswordComponent implements OnInit {
  private messageService = inject(MessageService);
  private readonly bottomSheetService = inject(NgxBottomSheetService);
  router = inject(Router);

  title = signal<string>('');
  loading = signal<boolean>(false);

  route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.configurePasswordType();
  }
  configurePasswordType() {
    const data = this.route.snapshot.data;
    const staticPassword = data['staticPassword'] as boolean;
    if (!staticPassword) {
      this.router.navigate(['/card/password-settings', this.route.snapshot.params['id']]);
    }
    if (staticPassword) {
      this.title.set('تغییر رمز خرید آنلاین دیجی‌کارت');
    } else {
      this.title.set('تغییر رمز اول دیجی‌کارت');
    }
  }
  errorMessageMapper = {
    minlength: 'رمز کارت باید 4  رقم باشد',
    maxlength: 'رمز کارت باید 4  رقم باشد',
    pattern: 'رمز کارت باید 4  رقم باشد',
  };
  form = new FormGroup(
    {
      currentPassword: new FormControl<number | null>(null, [Validators.minLength(4), Validators.maxLength(4)]),
      newPassword: new FormControl<number | null>(null, [Validators.minLength(4), Validators.maxLength(4)]),
      newPasswordRepeat: new FormControl<number | null>(null, [Validators.minLength(4), Validators.maxLength(4)]),
    },
    { validators: passwordMatchValidatorFactory('newPassword', 'newPasswordRepeat') },
  );

  submitForm() {
    if (this.form.valid) {
      this.bottomSheetService.openBottomSheet(
        OtpVerificationComponent,
        {
          title: 'احراز هویت',
          phoneNumber: '09123456789',
        },
        { disableClose: true },
      );
      return;
    }
    if (this.form.hasError('passwordMismatch')) {
      this.messageService.showErrorMessage('رمز کارت و تکرار آن یکسان نیست.');
      return;
    }
    this.messageService.showErrorMessage('اطلاعات فرم معتبر نیست.');
  }
}
