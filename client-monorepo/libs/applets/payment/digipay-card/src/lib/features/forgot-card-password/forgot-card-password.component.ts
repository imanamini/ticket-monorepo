import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { MessageService } from '@client-monorepo/common/utilities';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { OtpVerificationComponent } from '../../components/otp-verification/otp-verification.component';
import { passwordMatchValidatorFactory } from '../../data-access/utils/password-match.validator';

@Component({
  selector: 'digipay-card-applet-forgot-card-password',
  standalone: true,
  imports: [
    CommonModule,
    PageLayoutComponent,
    FormsModule,
    ReactiveFormsModule,
    NgxButtonComponent,
    UiFormFieldBuilderModule,
    UiFormFieldBuilderModule,
  ],
  templateUrl: './forgot-card-password.component.html',
  styleUrl: './forgot-card-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotCardPasswordComponent implements OnInit {
  private messageService = inject(MessageService);
  private readonly bottomSheetService = inject(NgxBottomSheetService);
  route = inject(ActivatedRoute);
  title = signal<string>('');

  ngOnInit(): void {
    this.configurePasswordType();
  }
  configurePasswordType() {
    const data = this.route.snapshot.data;
    const staticPassword = data['staticPassword'] as boolean;

    if (staticPassword) {
      this.title.set('فراموشی رمز خرید آنلاین دیجی‌کارت');
    } else {
      this.title.set('فراموشی رمز اول دیجی‌کارت');
    }
  }
  form = new FormGroup(
    {
      cvv2: new FormControl<number | null>(null, [Validators.minLength(3), Validators.maxLength(4)]),
      password: new FormControl<number | null>(null, [Validators.minLength(4), Validators.maxLength(4)]),
      passwordRepeat: new FormControl<number | null>(null, [Validators.minLength(4), Validators.maxLength(4)]),
    },
    { validators: passwordMatchValidatorFactory('password', 'passwordRepeat') },
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
