import { ChangeDetectionStrategy, Component, inject, OnInit, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { AuthService } from '@client-monorepo/common/user';
import { MessageService } from '@client-monorepo/common/utilities';
import { NgxFormValidator } from '@digipay/ngx-form-validator';
import { LoginStateService } from '@client-monorepo/applets/auth';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'escrow-auth-applet-change-phone-number',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UiFormFieldBuilderModule, NgxButtonComponent],
  templateUrl: './change-phone-number.component.html',
  styleUrl: './change-phone-number.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePhoneNumberComponent implements OnInit {
  authService = inject(AuthService);
  loginStateService = inject(LoginStateService);
  messageService = inject(MessageService);
  fb = inject(FormBuilder);
  form!: FormGroup;
  okReturned = output();

  ngOnInit(): void {
    this.form = this.fb.group({
      phoneNumber: ['', [Validators.required, NgxFormValidator.cellNumberValidator()]],
    });
  }

  get getPhoneNumberValue(): string {
    return this.form.get('phoneNumber')?.value;
  }

  async getCode(): Promise<void> {
    if (this.form.invalid) {
      return;
    }
    const sendSms$ = await this.authService.getCode(this.getPhoneNumberValue);

    sendSms$.subscribe({
      next: (res) => {
        this.loginStateService.phoneNumber.set(this.getPhoneNumberValue)
        this.loginStateService.userId.set(res.userId)
        this.loginStateService.isAutofill.set(res.autofill)
        this.okReturned.emit();
      },
      error: (error) => {
        this.messageService.showErrorOfErrorResponse(error);
      },
    });
  }

  checkKeyCode(event: KeyboardEvent) {
    if (event.code === 'Enter' || event.code === 'NumpadEnter') {
      this.getCode();
      return;
    }
  }
}
