import { ChangeDetectionStrategy, Component, computed, input, model, OnDestroy, output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Buttons } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { CreditPasswordSignatureComponent } from '../../../../components/credit-password-signature/credit-password-signature.component';
import { NgxAlert } from '@digipay/ngx-alert';

@Component({
  selector: 'app-credit-signing-document-password',
  templateUrl: './credit-signing-document-password.component.html',
  styleUrls: ['./credit-signing-document-password.component.scss'],
  imports: [NgxStatusResultModule, CreditPasswordSignatureComponent, NgxAlert],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditSigningDocumentPasswordComponent implements OnDestroy {
  password = '';
  subscription!: Subscription;

  cancelActivation = input(false);
  loading = input(false);
  errorText = model('');
  errorDescription = model('');
  expired = input(false);
  succeeded = output<string>();
  goBack = output<void>();

  buttons = computed<Buttons[]>(() => {
    if (this.cancelActivation()) {
      return [
        {
          id: 'back',
          style: 'fill',
          label: 'متوجه شدم',
          mode: 'form',
          fullWidth: true,
        },
      ];
    } else {
      return [
        {
          id: 'support',
          style: 'tinted-on-elevated',
          label: 'تماس با پشتیبانی',
          mode: 'form',
        },
        {
          id: 'back',
          style: 'link',
          label: 'بازگشت',
          mode: 'form',
        },
      ];
    }
  });

  handleToSubmit({ password }: any) {
    this.clearError();
    if (this.checkPasswordLength(password)) {
      this.setErrorText('رمز باید ۴ رقمی باشد');
      return;
    }
    this.validatePassword(password);
  }

  checkPasswordLength(password: string): boolean {
    return password.length !== 4;
  }

  validatePassword(password: string) {
    this.succeeded.emit(password);
  }

  onKeyBoardHitError() {
    this.setErrorText('رمزتان را توسط کیبورد همین صفحه وارد کنید.');
  }

  clearError() {
    this.errorText.set('');
    this.errorDescription.set('');
  }

  setErrorText(text: string) {
    this.errorText.set(text);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  close(id: string) {
    if (id === 'support') {
      window.open('tel:+982153924000');
    }
    if (id === 'back') {
      this.goBack.emit();
    }
  }
}
