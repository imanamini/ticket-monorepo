import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from '@client-monorepo/common/utilities';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { passwordMatchValidatorFactory } from '../../data-access/utils/password-match.validator';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'digipay-card-applet-card-info-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, UiFormFieldBuilderModule, NgxCalloutComponent, NgxButtonComponent, NgxIcon],
  templateUrl: './card-info-form.component.html',
  styleUrl: './card-info-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardInfoFormComponent {
  private messageService = inject(MessageService);
  //todo any should replace with the real model
  onSubmit = output<any>();
  loading = input<boolean>();
  passwordMasked = signal(true);
  confirmPasswordMasked = signal(true);
  cvv2Masked = signal(true);
  form = new FormGroup(
    {
      cvv2: new FormControl<number | null>(null, [Validators.minLength(3), Validators.maxLength(4)]),
      newPassword: new FormControl<number | null>(null, [Validators.minLength(4), Validators.maxLength(4)]),
      confirmedNewPassword: new FormControl<number | null>(null, [Validators.minLength(4), Validators.maxLength(4)]),
    },
    {
      validators: passwordMatchValidatorFactory('newPassword', 'confirmedNewPassword'),
    },
  );

  submitForm() {
    if (this.form.hasError('passwordMismatch')) {
      this.messageService.showErrorMessage('رمز کارت و تکرار آن یکسان نیست.');
      return;
    }
    if (this.form.valid) {
      this.onSubmit.emit(this.form.value);
      return;
    }

    this.messageService.showErrorMessage('اطلاعات فرم معتبر نیست.');
  }

  protected toggleConfirmPasswordVisibility() {
    this.confirmPasswordMasked.update((ex) => !ex);
  }

  protected togglePasswordVisibility() {
    this.passwordMasked.update((ex) => !ex);
  }

  protected toggleCvv2Visibility() {
    this.cvv2Masked.update((ex) => !ex);
  }
}
