import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { FormsModule } from '@angular/forms';
import { LoginState, LoginStateService } from '@client-monorepo/applets/auth';
import { AuthService } from '@client-monorepo/common/user';
import { MessageService } from '@client-monorepo/common/utilities';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'auth-applet-presentative-code',
  standalone: true,
  imports: [CommonModule, UiFormFieldBuilderModule, FormsModule, NgxButtonComponent],
  templateUrl: './presentative-code.component.html',
  styleUrl: './presentative-code.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresentativeCodeComponent {
  code = '';

  loginStateService = inject(LoginStateService);
  authService = inject(AuthService);
  messageService = inject(MessageService);

  cancel(): void {
    this.loginStateService.goToState(LoginState.PHONENUMBER);
  }

  submitCode(): void {
    this.authService.verifyReferral(this.code).subscribe({
      next: () => {
        this.loginStateService.presentativeCode.set(this.code);
        this.messageService.showSuccessMessage('کد معرف با موفقیت ثبت شد!');
        this.loginStateService.goToState(LoginState.PHONENUMBER);
      },
      error: () => {
        this.messageService.showErrorMessage('کد وارد شده معتبر نیست!');
      },
    });
  }
}
